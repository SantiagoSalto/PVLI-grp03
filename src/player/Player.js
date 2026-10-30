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
        this.setGravityY(1000);                                // gravedad
        this.body.setMaxVelocityY(900);                        // velocidad maxima de caida (si es mayor atraviesa el suelo de Tiled)

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

        // sistema de vidas del jugador
        this.lives = 3;                                        // cantidad de golpes que el jugador aguantará hasta perder en el nivel
        this.invincibilitydur = 2000;                             // duración del estado de invencibilidad cuando el jugador sufre daño
        this.invencible = 0;                                   // variable que comprobará si el jugador es invencible
        this.invincibilityframe = 0;

        // input
        this.mouse = scene.inputManager;
        // Ataque
        this.attackPressed = false;

        scene.input.mouse.disableContextMenu();

        scene.input.on('pointerdown', (pointer) => {
            if (pointer.button === 2) {
                this.attackPressed = true;
            }
        });

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
        if (this.invencible == 1)
        {
            this.setAlpha(0.7);
            this.invincibilityframe += dt;
            if (this.invincibilityframe >= this.invincibilitydur) 
            {
                this.invencible = 0;
                this.invincibilityframe = 0;
                console.log("Invencibilidad desactivada")
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

    wantsToAttack() {
        if (!this.attackPressed) return false;

        this.attackPressed = false;
        return true;
    }

    isGrounded() {
        return this.body.onFloor();
    }
}
