import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerIdleState extends BaseState {

    enter(player) {
        player.setVelocityX(0);                // detener movimiento horizontal
    }

    execute(player) {

        // si el cursor esta por encima ir a jump
        if (player.wantsToJump()) {
            player.stateMachine.setState('jump');
            return;
        }

        // si se mantiene el clic ir a move
        if (player.wantsToMove()) {
            player.stateMachine.setState('move');
            return;
        }
    }
}
