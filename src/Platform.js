/**
 * Clase que representa una plataforma
 * @extends Phaser.GameObjects.Sprite
 */
export default class Platform extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de Platform
	 * @param {Scene} scene - Escena en la que aparecerá la plataforma
	 * @param {number} x - coordenada X
	 * @param {number} y - coordenada Y
	 * @param {number} width - anchura de la plataforma
     * @param {number} height - altura de la plataforma
	 */
	constructor(scene, x, y, width, height, imgKey) {
		super(scene, x, y, width, height, imgKey);
		this.scene.add.existing(this);
		this.setOrigin(x, y);
		this.scene.physics.add.existing(this);
    	this.setSize(width, height),
	}
}