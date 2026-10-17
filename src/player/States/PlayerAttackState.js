
import BaseState from '../../stateMachine/BaseState.js';
import Projectile from '../Projectile.js';

export default class PlayerAttackState extends BaseState {

    enter(player) {
        this.wasAirborne = !player.isGrounded();

        // Conservar la velocidad horizontal durante el salto
        this.velocityX = player.body.velocity.x;

        if (!this.wasAirborne) {
            player.setVelocity(0, 0);
        }

        const pointer = player.scene.input.activePointer;

        this.apuntando = true;

        this.posicionInicial = {
            x: pointer.worldX,
            y: pointer.worldY
        };

        this.posicionActual = {
            x: pointer.worldX,
            y: pointer.worldY
        };

        // Crear la línea de apuntado
        this.linea = player.scene.add.graphics();
        this.linea.setDepth(100);

        // Actualizar la posición del cursor
        this.pointerMove = (pointer) => {
            if (!this.apuntando) return;

            this.posicionActual = {
                x: pointer.worldX,
                y: pointer.worldY
            };
        };

        // Disparar al soltar el botón derecho
        this.pointerUp = (pointer) => {
            if (!this.apuntando || pointer.button !== 2) return;

            this.disparar(player);
        };

        player.scene.input.on('pointermove', this.pointerMove);
        player.scene.input.on('pointerup', this.pointerUp);
    }

    execute(player, time, delta) {
        // En el suelo, permanecer quieto.
        // En el aire, mantener velocidad horizontal y
        // dejar que la gravedad gestione la velocidad vertical.
        if (this.wasAirborne) {
            player.setVelocityX(this.velocityX);
        } else {
            player.setVelocity(0, 0);
        }

        if (!this.apuntando) return;

        const dx = this.posicionInicial.x - this.posicionActual.x;
        const dy = this.posicionInicial.y - this.posicionActual.y;

        this.linea.clear();
        this.linea.lineStyle(3, 0xffffff, 0.8);
        this.linea.beginPath();
        this.linea.moveTo(player.x, player.y);
        this.linea.lineTo(
            player.x + dx,
            player.y + dy
        );
        this.linea.strokePath();
    }

    disparar(player) {
        if (!this.apuntando) return;

        this.apuntando = false;

        const scene = player.scene;

        const dx = this.posicionInicial.x - this.posicionActual.x;
        const dy = this.posicionInicial.y - this.posicionActual.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < 10) {
            this.terminarAtaque(player);
            return;
        }

        const direccionX = dx / distancia;
        const direccionY = dy / distancia;
        const potencia = Math.min(distancia * 5, 600);

        const projectile = new Projectile(
            scene,
            player.x + direccionX * 30,
            player.y + direccionY * 30
        );

        projectile.shoot(
            direccionX * potencia,
            direccionY * potencia
        );

        this.terminarAtaque(player);
    }

    terminarAtaque(player) {
        this.apuntando = false;

        // Limpiar antes de cambiar de estado
        this.limpiarEventos(player);

        if (!player.isGrounded()) {
            player.stateMachine.setState('jump');
        } else {
            player.stateMachine.setState(
                player.wantsToMove() ? 'move' : 'idle'
            );
        }
    }

    limpiarEventos(player) {
        if (this.pointerMove) {
            player.scene.input.off('pointermove', this.pointerMove);
            this.pointerMove = null;
        }

        if (this.pointerUp) {
            player.scene.input.off('pointerup', this.pointerUp);
            this.pointerUp = null;
        }

        if (this.linea) {
            this.linea.destroy();
            this.linea = null;
        }
    }

    exit(player) {
        // Limpiar recursos, sin cambiar de estado aquí
        this.limpiarEventos(player);
    }
}
