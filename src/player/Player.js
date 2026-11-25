import StateMachine from '../stateMachine/StateMachine.js';
import PlayerIdleState from './States/PlayerIdleState.js';
import PlayerMoveState from './States/PlayerMoveState.js';
import PlayerJumpState from './States/PlayerJumpState.js';
import PlayerAttackState from './States/PlayerAttackState.js';
import { SCALE } from '../Measures.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'squirrel');

        scene.add.existing(this);                              // agregar sprite
        scene.physics.add.existing(this);                      // activar fisicas
        this.setCollideWorldBounds(true);                      // colision con bordes

        //Efectos ataque lento
        this.shine = this.scene.add.sprite(x,y,'aura'); //efecto
        this.shine.setScale(1 * SCALE);
        this.maskShape = this.scene.add.sprite(x,y,'invmask'); //mascara
        this.maskShape.setScale(1 * SCALE);
        this.maskShape.setVisible(false);
        this.shine.setVisible(false); //aura invisible hasta que se de el caso
        this.shine.enableFilters();
        this.shine.filters.external.addMask(this.maskShape);
        this.maskOffset =  {x: 0, y: 0};

        //Cambios suavizado eje Y
        this.setGravityY(550 * SCALE);                                  // gravedad
        this.body.setMaxVelocityY(900 * SCALE); //900                   // velocidad maxima de caida (si es mayor atraviesa el suelo de Tiled)
        this.body.setDragY(20 * SCALE)                                  //Añade ligera resistencia al aire vertical

        this.setScale(0.15 * SCALE);                                   // tamaño en pantalla
        this.body.setSize(300, 400);                           // hitbox ajustada
        this.body.setOffset(130, 70);                          // colocar hitbox

        // movimiento
        this.walkSpeed = 120 * SCALE;                                  // velocidad andando
        //nuevos
        this.maxSpeedMultiplier = 4.2;                              //velocidad maxima = 120 *4.2 = 504
        this.maxSpeedDistance = 250 * SCALE;                        //Distna cia a la que ya no acelera mas

        this.stopDistance = 5 * SCALE;                                 // distancia al cursor para pararse

        // salto
        this.jumpSpeed = 700 * SCALE;                                  // fuerza del salto (altura fija)
        this.jumpMargin = 65* SCALE;                                    //margen de salto (cuanto arriba tiene que estar el raton de la ardilla para que salte)
        // ataque
        this.minShotSpeed = 400 * SCALE;                               // velocidad del proyectil con muy poco arrastre
        this.maxShotSpeed = 1150 * SCALE;                              // velocidad del proyectil con arrastre maximo
        this.maxDrag = 500;                                    // pixeles de arrastre para llegar a la fuerza maxima
        this.minRange = 150 * SCALE;                                   // alcance con muy poco arrastre (parabola cerrada)
        this.maxRange = 5000 * SCALE;                                  // alcance con arrastre maximo (casi recto)
        this.bulletTimeSpeed = 0.1;                            // velocidad del juego al apuntar en el aire (1 = normal)

        // sistema de vidas del jugador
        this.lives = 3;                                        // cantidad de golpes que el jugador aguantará hasta perder en el nivel
        this.invincibilitydur = 2000;                          // duración del estado de invencibilidad cuando el jugador sufre daño
        this.invencible = false;                               // variable que comprobará si el jugador es invencible
        this.invincibilityframe = 0;                           // cronómetro que dice cuanto tiempo se ha pasado siendo invencible (usado más abajo) 

        // input
        this.mouse = scene.inputManager;

        // estados
        this.stateMachine = new StateMachine(this);
        this.stateMachine
            .addState('idle', new PlayerIdleState())
            .addState('move', new PlayerMoveState())
            .addState('jump', new PlayerJumpState())
            .addState('attack', new PlayerAttackState())
            .setState('idle');
    }
    preUpdate(t, dt)
    {
        //Hang time = Flotando unos instantes cuando llega a punto maximo de salto
        if (!this.isGrounded()) {
            // Si la velocidad vertical es cercana a 0 (está en la cúspide del salto)
            if (Math.abs(this.body.velocity.y) < 20 * SCALE) {
                this.body.setGravityY(500 * SCALE); // Reducimos la gravedad a la mitad para que flote
            } else {
                this.body.setGravityY(1050 * SCALE); // Gravedad normal en caída o subida fuerte
            }
        } else {
            this.body.setGravityY(1050 * SCALE);
        }

        if (this.invencible) // Control de la invencibilidad del jugador
        {
            this.setAlpha(0.7);
            this.invincibilityframe += dt * this.scene.gameSpeed;
            if (this.invincibilityframe >= this.invincibilitydur) 
            {
                this.invencible = false;
                this.invincibilityframe = 0;
            }
        }

        //sigue a player efecto
        if (this.shine.visible){
            this.shine.setPosition(this.x, this.y);
            this.maskShape.setPosition(this.x + this.maskOffset.x, this.y + this.maskOffset.y);
        }

        else this.setAlpha(1);
    }
    update(time, delta) {
        // avanzar maquina de estados
        this.stateMachine.step(time, delta);
    }

    wantsToMove() {
        if (!this.mouse.isLeftDown()) return false;
        return Math.abs(this.mouse.getX() - this.x) > this.stopDistance;
    }

    //Comprobador de zona valida para saltar
    //Aplicado en player y en ArrowCursor, para que vayan a la par
    isInJumpZone() {
        return this.mouse.getY() < this.body.top - this.jumpMargin;
    }

    // clic con el cursor por encima de la cabeza estando en el suelo
    wantsToJump() {
        if (!this.mouse.isLeftDown() || !this.isGrounded()) return false;
        return this.isInJumpZone();
    }

    // velocidad horizontal segun la distancia al cursor: lejos corre, cerca anda
    getSpeed(distance) {
        //Como distancia puede sern negativa, hacemos el valor absoluto
        const absDist = Math.abs(distance);
        //Si la distancia esta a 5 px o menos anda
        if (absDist <= this.stopDistance){
            return this.walkSpeed;
        }
        //Ponerle el tope a de velocidad 
        const maxDist = Math.min(absDist, this.maxSpeedDistance);

        // Calculamos PORCENTAJE DE LEJANIA (0.0 cerca = 5px y 1.0 límite = 250px)
        const ratio = (maxDist - this.stopDistance) / (this.maxSpeedDistance - this.stopDistance);

        // Multiplicador progresivo: empieza en 1x (walkSpeed) y sube hasta maxSpeedMultiplier
        const multiplier = 1 + ratio * (this.maxSpeedMultiplier - 1); //se le resta 1 ya que el rango va desde (1-4.2) es decir 3.2 valores

        return this.walkSpeed * multiplier;
    }

    // mantener el clic derecho para apuntar
    wantsToAttack() {
        return this.mouse.isRightDown();
    }

    isGrounded() {
        // touching.down cuenta tambien las cajas (onFloor solo cuenta objetos inmoviles)
        return this.body.onFloor() || this.body.touching.down;
    }
    slowEffect(){
    if(this.tweenSlow && this.tweenSlow.isPlaying()) return;

    this.shine.setVisible(true);

     this.tweenSlow = this.scene.tweens.add({
            targets: this.maskOffset,
            y: { from: -32, to: 40 },
            duration: 800,
            repeat:-1,
            yoyo: true,
            ease: 'Sine.easeInOut',
        });
    }
    
    stopSlowEffect(){
        if(this.tweenSlow){
            this.tweenSlow.stop(); //Lo para
            this.tweenSlow = null;
        }
        this.shine.setVisible(false);
    }

}
