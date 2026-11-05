export default class Piece extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, size, stroke) {
		super(scene, x, y, stroke);                            // cada pieza es un trazo de la letra del nivel

		scene.add.existing(this);                              // agregar sprite

		this.setDisplaySize(size, size);                       // tamaño en pantalla

		scene.physics.add.existing(this, true);                // fisicas estaticas: no cae ni se empuja
	}
}
