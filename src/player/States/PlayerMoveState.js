import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerMoveState extends BaseState {

    execute(player) {

        // si suelta el clic o el cursor esta encima idle
        if (!player.wantsToMove()) {
            player.stateMachine.setState('idle');
            return;
        }

        // mirar hacia el cursor
        let direction = Math.sign(player.mouse.getX() - player.x);
        player.setFlipX(direction < 0);

        // aplicar velocidad horizontal
        player.setVelocityX(direction * player.walkSpeed);
    }

    exit(player) {
        player.setVelocityX(0);
    }
}
