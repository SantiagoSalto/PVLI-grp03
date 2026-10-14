import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerMoveState extends BaseState {

    execute(player) {

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
        player.setVelocityX(direction * player.getSpeed(distance));
    }

    exit(player) {
        player.setVelocityX(0);
    }
}
