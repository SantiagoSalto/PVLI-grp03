/**
 * Clase que representa un enemigo
 */
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	/**
	 * Constructor de Enemy
	 * @param {Scene} scene Escena en la que aparecera el enemigo
	 * 
	 * @param {number} x - posicion X
	 * @param {number} y - posicion Y

	 * @param {number} orX - coordenada de origen X
	 * @param {number} orY - coordenada de origen Y
	 * 
	 * @param {number} speedX - velocidad de movimiento X
	 * @param {number} speedY - velocidad de movimiento Y

	 *      * 
     * @param {string} range - rango limite hasta que el enemigo cambie de direccion
	 */
	constructor(scene, x, y, speedX, speedY) {
        super(scene, x, y, 'enemy');


        scene.add.existing(this);                              // agregar sprite
        scene.physics.add.existing(this);                      // activar fisicas

        this.setScale(0.1);                                   // tamaño en pantalla
        this.body.setSize(320, 650);                           // hitbox ajustada
        this.body.setOffset(150, 50);                          // colocar hitbox

	    this.range = 120;
		
	    this.body.setVelocityX(speedX);
	 	this.body.setVelocityY(speedY);
    }
}