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
        this.scene.physics.add.collider(this, this.scene.boxes)
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
    update(time,delta)
    {
        if (this.physics.collider(this, this.scene.boxes))
        {
            this.destroy;
        }
    }
    shoot(directionX, directionY, speed, gravity) {
        this.setGravityY(gravity);                             // cada disparo tiene su propia curva
        this.setVelocity(directionX * speed, directionY * speed);
    }
       impactar() {
        this.destroy();
    }
}