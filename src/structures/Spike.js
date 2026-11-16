export default class Spike extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, width, height, mortal) {
		super(scene, x, y, 'trap');

		this.mortal = mortal;                                  // true: mata de un golpe; si no, quita 1 vida

		scene.add.existing(this);                              // agregar sprite

		this.setDisplaySize(width, height);                    // tamaño en pantalla

		scene.physics.add.existing(this, true);                // fisicas estaticas: no cae ni se empuja
	}
}
