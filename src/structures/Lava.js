export default class Lava extends Phaser.GameObjects.Rectangle {

	constructor(scene, x, y, width, height, speed) {
		super(scene, x, y, width, height, 0xff4500);           // naranja provisional hasta tener imagen

		this.speed = speed;                                    // pixeles por segundo hacia arriba

		scene.add.existing(this);                              // agregar rectangulo
		this.setOrigin(0, 0);                                  // y = borde de arriba de la lava

		scene.physics.add.existing(this);                      // activar fisicas
		this.body.setAllowGravity(false);                      // no cae
	}

	preUpdate(time, delta) {
		const dt = delta * this.scene.gameSpeed;               // bullet time: sube mas lenta si el juego va lento
		this.y -= this.speed * dt / 1000;
		this.body.reset(this.x, this.y);                       // el cuerpo sigue al rectangulo
	}
}
