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

        this.setGravityY(1000);
    }
    preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.body) {
        const vx = this.body.velocity.x;
        const vy = this.body.velocity.y;

        // Girar solo si está en movimiento
        if (vx !== 0 || vy !== 0) {
           this.setRotation(Math.atan2(vy, vx) - Math.PI / 2);
        }
    }
}

    shoot(velocityX, velocityY) {
        this.setVelocity(velocityX, velocityY);
    }
       impactar() {
        this.destroy();
    }
}