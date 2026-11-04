export default class DestructibleBlock extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, width, height) {
		super(scene, x, y, 'box');                             // imagen provisional, hasta tener la suya

		scene.add.existing(this);                              // agregar sprite

		this.setDisplaySize(width, height);                    // tamaño en pantalla
		this.setTint(0x88ddff);                                // azul claro para distinguirlo de la caja
		this.setTintMode(Phaser.TintModes.HARD_LIGHT);         // con el tinte normal el marron de la imagen sale verde

		scene.physics.add.existing(this, true);                // fisicas estaticas: no cae ni se empuja
	}
}
