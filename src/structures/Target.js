export default class Target extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, size, speedY, range, group) {
		super(scene, x, y, 'target');

		this.speedY = speedY;
		this.originY = y;
		this.range = range;
		this.group = group;

		scene.add.existing(this);                              // agregar sprite

		this.setDisplaySize(size, size);                       // tamaño en pantalla

		scene.physics.add.existing(this);                      // activar fisicas
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		const dt = delta * this.scene.gameSpeed;               // bullet time: mas lenta si el juego va lento
		this.y += this.speedY * dt / 1000;

		// cambia de sentido al llegar al limite de su recorrido
		if (this.y > this.originY + this.range) this.speedY = -Math.abs(this.speedY);
		if (this.y < this.originY - this.range) this.speedY = Math.abs(this.speedY);
	}
}
