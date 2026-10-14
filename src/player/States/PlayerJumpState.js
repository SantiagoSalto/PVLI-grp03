import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerJumpState extends BaseState {

    enter(player) {

        // la altura del salto siempre es la misma
        player.setVelocityY(-player.jumpSpeed);

        // saltar hacia el lado del cursor
        this.moveTowardsCursor(player);
    }

    execute(player) {

        // si toca el suelo (bajando) volver a move o idle
        if (player.isGrounded() && player.body.velocity.y >= 0) {
            if (player.wantsToMove()) player.stateMachine.setState('move');
            else player.stateMachine.setState('idle');
            return;
        }

        // si se suelta el clic mantiene la inercia, si se mantiene puede cambiar de direccion
        this.moveTowardsCursor(player);
    }

    moveTowardsCursor(player) {
        if (!player.wantsToMove()) return;

        let distance = player.mouse.getX() - player.x;

        // direccion hacia el cursor: 1 derecha, -1 izquierda
        let direction = 1;
        if (distance < 0) direction = -1;

        // mirar hacia el cursor
        player.setFlipX(direction < 0);

        // aplicar velocidad horizontal
        player.setVelocityX(direction * player.getSpeed(distance));
    }
}
