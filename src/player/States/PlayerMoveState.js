import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerMoveState extends BaseState {

    execute(player) {

        // si se mantiene el clic derecho ir a attack
        if (player.wantsToAttack()) {
            player.stateMachine.setState('attack');
            return;
        }

        // si el cursor esta por encima ir a jump
        if (player.wantsToJump()) {
            player.stateMachine.setState('jump');
            return;
        }

        // si suelta el clic o el cursor esta encima idle
        if (!player.wantsToMove()) {
            player.stateMachine.setState('idle');
            return;
        }

        let distance = player.mouse.getX() - player.x;

        // direccion hacia el cursor: 1 derecha, -1 izquierda
        let direction = 1;
        if (distance < 0) direction = -1;

        // mirar hacia el cursor
        player.setFlipX(direction < 0);

        // aplicar velocidad horizontal
        let speed = player.getSpeed(distance);
        player.setVelocityX(direction * speed);

        // animacion segun la velocidad
        if (speed === player.runSpeed) player.play('player_run', true);
        else player.play('player_walk', true);
    }

    exit(player) {
        player.setVelocityX(0);
    }
}
