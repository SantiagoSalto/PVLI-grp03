import BaseState from '../../stateMachine/BaseState.js';

export default class PlayerJumpState extends BaseState {

    enter(player) {

        // booleano para comprobar si player ha llegado al cursor
        this.reachedCursor = false;

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

        // en el aire sigue al cursor aunque no se mantenga el clic (como poptropica)
        this.moveTowardsCursor(player);
    }

    moveTowardsCursor(player) {

        // Si ha llegado al cursor, sigue con la inercia (línea parabólica)
        if (this.reachedCursor) return;

        let distance = player.mouse.getX() - player.x;

        // direccion hacia el cursor: 1 derecha, -1 izquierda
        let direction = 1;
        if (distance < 0) direction = -1;

        // Arreglar bug de fix cursor y player junto
        if (Math.abs(distance) <= player.stopDistance) {
            this.reachedCursor = true;
            return;
        }

        // mirar hacia el cursor
        player.setFlipX(direction < 0);

        // aplicar velocidad horizontal
        player.setVelocityX(direction * player.getSpeed(distance));
    }
}
