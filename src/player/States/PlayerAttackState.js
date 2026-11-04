
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

        // Coordenadas de pantalla: el arrastre no depende de la camara
        const pointer = player.mouse.pointer;

        this.posicionInicial = {
            x: pointer.x,
            y: pointer.y
        };

        this.posicionActual = {
            x: pointer.x,
            y: pointer.y
        };

        // Crear la línea de apuntado
        this.linea = player.scene.add.graphics();
        this.linea.setDepth(100);
    }

    execute(player, time, delta) {
        // Al aterrizar deja de conservar la velocidad del salto
        if (player.isGrounded()) {
            this.wasAirborne = false;
        }

        // En el suelo, permanecer quieto.
        // En el aire, mantener velocidad horizontal y
        // dejar que la gravedad gestione la velocidad vertical.
        if (this.wasAirborne) {
            player.setVelocityX(this.velocityX);
        } else {
            player.setVelocity(0, 0);
        }

        // Al soltar dispara con la ultima posicion apuntada
        // (se comprueba cada frame, asi funciona aunque se suelte fuera del juego)
        if (!player.mouse.isRightDown()) {
            this.disparar(player);
            return;
        }

        // Actualizar la posición del cursor
        const pointer = player.mouse.pointer;

        this.posicionActual = {
            x: pointer.x,
            y: pointer.y
        };

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
        const scene = player.scene;

        const dx = this.posicionInicial.x - this.posicionActual.x;
        const dy = this.posicionInicial.y - this.posicionActual.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // Sin arrastre: lanzamiento fallido, sale sin fuerza delante del player y cae
        if (distancia < 10) {
            let lado = 1;
            if (player.flipX) lado = -1;

            new Projectile(scene, player.x + lado * 30, player.y);

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
        if (!player.isGrounded()) {
            player.stateMachine.setState('jump');
        } else {
            player.stateMachine.setState(
                player.wantsToMove() ? 'move' : 'idle'
            );
        }
    }

    exit(player) {
        // Borrar la línea de apuntado
        this.linea.destroy();
        this.linea = null;
    }
}
