import StateMachine from '../stateMachine/StateMachine.js';
import PlayerIdleState from './States/PlayerIdleState.js';
import PlayerMoveState from './States/PlayerMoveState.js';

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
        this.walkSpeed = 150;                                  // velocidad andando
        this.stopDistance = 5;                                 // distancia al cursor para pararse

        // input
        this.mouse = scene.inputManager;

        // estados
        this.stateMachine = new StateMachine(this);
        this.stateMachine
            .addState('idle', new PlayerIdleState())
            .addState('move', new PlayerMoveState())
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
}
