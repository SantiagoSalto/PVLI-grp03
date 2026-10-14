import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerMoveState extends BaseState {

    execute(player) {

        // si suelta el clic o el cursor esta encima idle
        if (!player.wantsToMove()) {
            player.stateMachine.setState('idle');
            return;
        }

        let distance = player.mouse.getX() - player.x;

        // mirar hacia el cursor
        let direction = Math.sign(distance);
        player.setFlipX(direction < 0);

        // cursor lejos corre, cerca anda
        let speed = player.walkSpeed;
        if (Math.abs(distance) > player.runDistance) speed = player.runSpeed;

        // aplicar velocidad horizontal
        player.setVelocityX(direction * speed);
    }

    exit(player) {
        player.setVelocityX(0);
    }
}
