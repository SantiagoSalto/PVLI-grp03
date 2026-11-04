import StateMachine from '../stateMachine/StateMachine.js';
import PlayerIdleState from './States/PlayerIdleState.js';
import PlayerMoveState from './States/PlayerMoveState.js';
import PlayerJumpState from './States/PlayerJumpState.js';
import PlayerAttackState from './States/PlayerAttackState.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'squirrel');

        scene.add.existing(this);                              // agregar sprite
        scene.physics.add.existing(this);                      // activar fisicas
        this.setCollideWorldBounds(true);                      // colision con bordes

        //Cambios suavizado eje Y
        this.setGravityY(1050);                                  // gravedad
        this.body.setMaxVelocityY(900); //900                   // velocidad maxima de caida (si es mayor atraviesa el suelo de Tiled)
        this.body.setDragY(20)                                  //Añade ligera resistencia al aire vertical

        this.setScale(0.15);                                   // tamaño en pantalla
        this.body.setSize(300, 400);                           // hitbox ajustada
        this.body.setOffset(130, 70);                          // colocar hitbox

        // movimiento
        this.walkSpeed = 120;                                  // velocidad andando
        this.runSpeed = 380;                                   // velocidad corriendo
        this.runDistance = 200;                                // distancia al cursor a partir de la que corre
        this.stopDistance = 5;                                 // distancia al cursor para pararse

        // salto
        this.jumpSpeed = 700;                                  // fuerza del salto (altura fija)

        // ataque
        this.minShotSpeed = 400;                               // velocidad del proyectil con muy poco arrastre
        this.maxShotSpeed = 1150;                              // velocidad del proyectil con arrastre maximo
        this.maxDrag = 500;                                    // pixeles de arrastre para llegar a la fuerza maxima
        this.minRange = 150;                                   // alcance con muy poco arrastre (parabola cerrada)
        this.maxRange = 5000;                                  // alcance con arrastre maximo (casi recto)
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
            if (Math.abs(this.body.velocity.y) < 20) {
                this.body.setGravityY(500); // Reducimos la gravedad a la mitad para que flote
            } else {
                this.body.setGravityY(1050); // Gravedad normal en caída o subida fuerte
            }
        } else {
            this.body.setGravityY(1050);
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

    // clic con el cursor por encima de la cabeza estando en el suelo
    wantsToJump() {
        if (!this.mouse.isLeftDown() || !this.isGrounded()) return false;
        return this.mouse.getY() < this.body.top;
    }

    // velocidad horizontal segun la distancia al cursor: lejos corre, cerca anda
    getSpeed(distance) {
        if (Math.abs(distance) > this.runDistance) return this.runSpeed;
        return this.walkSpeed;
    }

    // mantener el clic derecho para apuntar
    wantsToAttack() {
        return this.mouse.isRightDown();
    }

    isGrounded() {
        // touching.down cuenta tambien las cajas (onFloor solo cuenta objetos inmoviles)
        return this.body.onFloor() || this.body.touching.down;
    }
}
