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
	constructor(scene, x, y, width, height) {
		super(scene, x, y, 'platform1');


		this.scene.add.existing(this);
		this.setScale(width*0.007, height*0.01)
		this.scene.physics.add.existing(this, true);
        this.body.setSize(width*4.5, height*4.23);                    
	    //this.body.setOffset(width*3, height*3);                           



	}
}