export default class Projectile extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);

        this.body.setAllowGravity(true);
        this.setCollideWorldBounds(false);
        this.setScale(0.25);
        this.body.setSize(140, 140);                           // hitbox ajustada (la imagen tiene mucho margen transparente)

        this.setGravityY(1000);

        this.despawnDistance = 200;                            // distancia fuera de la camara a la que se destruye

        scene.projectiles.add(this);                           // las colisiones del grupo estan en PlayScene
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // destruir si se aleja de la camara
        if (this.isOutOfView()) {
            this.destroy();
            return;
        }

        const vx = this.body.velocity.x;
        const vy = this.body.velocity.y;

        // Girar solo si está en movimiento
        if (vx !== 0 || vy !== 0) {
            this.setRotation(Math.atan2(vy, vx) - Math.PI / 2);
        }
    }

    // por arriba no se comprueba: la gravedad siempre la hace volver
    isOutOfView() {
        const view = this.scene.cameras.main.worldView;

        if (this.x < view.x - this.despawnDistance) return true;
        if (this.x > view.right + this.despawnDistance) return true;
        if (this.y > view.bottom + this.despawnDistance) return true;

        return false;
    }

    shoot(directionX, directionY, speed, gravity) {
        this.setGravityY(gravity);                             // cada disparo tiene su propia curva
        this.setVelocity(directionX * speed, directionY * speed);
    }

    // al chocar desaparece
    impact() {
        this.destroy();
    }
}
