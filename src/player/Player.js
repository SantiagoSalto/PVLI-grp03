import StateMachine from '../stateMachine/StateMachine.js';
import PlayerIdleState from './States/PlayerIdleState.js';
import PlayerMoveState from './States/PlayerMoveState.js';
import PlayerJumpState from './States/PlayerJumpState.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'squirrel');

        scene.add.existing(this);                              // agregar sprite
        scene.physics.add.existing(this);                      // activar fisicas
        this.setCollideWorldBounds(true);                      // colision con bordes
        this.setGravityY(1000);                                // gravedad

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

        // input
        this.mouse = scene.inputManager;

        // estados
        this.stateMachine = new StateMachine(this);
        this.stateMachine
            .addState('idle', new PlayerIdleState())
            .addState('move', new PlayerMoveState())
            .addState('jump', new PlayerJumpState())
            .setState('idle');
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

    isGrounded() {
        return this.body.onFloor();
    }
}
