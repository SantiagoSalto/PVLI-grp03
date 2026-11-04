
import BaseState from '../../stateMachine/BaseState.js';
import Projectile from '../Projectile.js';

export default class PlayerAttackState extends BaseState {

    enter(player) {
        this.wasAirborne = !player.isGrounded();

        // Conservar la velocidad horizontal durante el salto
        this.velocityX = player.body.velocity.x;

        if (!this.wasAirborne) {
            player.setVelocity(0, 0);
        } else {
            // Bullet time: apuntando en el aire todo el juego va lento
            player.scene.setGameSpeed(player.bulletTimeSpeed);
        }

        // Coordenadas de pantalla: el arrastre no depende de la camara
        const pointer = player.mouse.pointer;

        this.startPosition = {
            x: pointer.x,
            y: pointer.y
        };

        this.currentPosition = {
            x: pointer.x,
            y: pointer.y
        };

        // Crear la línea de apuntado
        this.aimLine = player.scene.add.graphics();
        this.aimLine.setDepth(100);
    }

    execute(player, time, delta) {
        // Al aterrizar deja de conservar la velocidad del salto y acaba el bullet time
        if (this.wasAirborne && player.isGrounded()) {
            this.wasAirborne = false;
            player.scene.setGameSpeed(1);
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
            this.shoot(player);
            return;
        }

        // Actualizar la posición del cursor
        const pointer = player.mouse.pointer;

        this.currentPosition = {
            x: pointer.x,
            y: pointer.y
        };

        this.drawParabola(player);
    }

    // Puntos de la parabola: misma formula que sigue el proyectil
    drawParabola(player) {
        this.aimLine.clear();

        const shot = this.getShot(player);

        // Sin arrastre no hay curva: el proyectil solo caera
        if (!shot) return;

        // mirar hacia donde apunta
        player.setFlipX(shot.directionX < 0);

        const speedX = shot.directionX * shot.speed;
        const speedY = shot.directionY * shot.speed;

        this.aimLine.fillStyle(0xffffff, 0.8);

        for (let i = 1; i <= 30; i++) {
            const t = i * 0.05;
            const x = shot.startX + speedX * t;
            const y = shot.startY + speedY * t + 0.5 * shot.gravity * t * t;

            this.aimLine.fillCircle(x, y, 3);
        }
    }

    // Datos del disparo segun el arrastre (null si no hay arrastre suficiente)
    getShot(player) {
        const dx = this.startPosition.x - this.currentPosition.x;
        const dy = this.startPosition.y - this.currentPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) return null;

        const directionX = dx / distance;
        const directionY = dy / distance;

        // La fuerza (de 0 a 1) decide la velocidad y el alcance por separado:
        // la velocidad sube poco, y el alcance (la forma de la curva) sube sobre todo al final del arrastre
        const force = Math.min(distance / player.maxDrag, 1);
        const speed = player.minShotSpeed + (player.maxShotSpeed - player.minShotSpeed) * force;
        const range = player.minRange + (player.maxRange - player.minRange) * force * force * force;

        // Gravedad necesaria para que esa velocidad llegue a ese alcance
        const gravity = speed * speed / range;

        return {
            directionX: directionX,
            directionY: directionY,
            speed: speed,
            gravity: gravity,
            startX: player.x + directionX * 30,
            startY: player.y + directionY * 30
        };
    }

    shoot(player) {
        const scene = player.scene;
        const shot = this.getShot(player);

        // Sin arrastre: lanzamiento fallido, sale sin fuerza delante del player y cae
        if (!shot) {
            let side = 1;
            if (player.flipX) side = -1;

            new Projectile(scene, player.x + side * 30, player.y);

            this.endAttack(player);
            return;
        }

        const projectile = new Projectile(scene, shot.startX, shot.startY);

        projectile.shoot(
            shot.directionX,
            shot.directionY,
            shot.speed,
            shot.gravity
        );

        this.endAttack(player);
    }

    endAttack(player) {
        if (!player.isGrounded()) {
            player.stateMachine.setState('jump');
        } else {
            player.stateMachine.setState(
                player.wantsToMove() ? 'move' : 'idle'
            );
        }
    }

    exit(player) {
        // Volver a la velocidad normal
        player.scene.setGameSpeed(1);

        // Borrar la línea de apuntado
        this.aimLine.destroy();
        this.aimLine = null;
    }
}
