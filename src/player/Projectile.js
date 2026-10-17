export default class Projectile extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'projectile');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(true);
        this.setVisible(true);

        this.body.setAllowGravity(true);
        this.setCollideWorldBounds(false);
        this.setGravityY(1000);
    }

    shoot(velocityX, velocityY) {
        this.setVelocity(velocityX, velocityY);
    }
}