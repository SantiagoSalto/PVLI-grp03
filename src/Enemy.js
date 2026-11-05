import { SCALE } from './Measures.js';

/**
 * Clase que representa un enemigo
 */
export default class Enemy extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de Enemy
	 * @param {Scene} scene Escena en la que aparecera el enemigo
	 * 
	 * @param {number} x - posicion X
	 * @param {number} y - posicion Y
	 * 
	 * @param {number} speedX - velocidad de movimiento X
	 * @param {number} speedY - velocidad de movimiento Y

	 *      * 
     * @param {string} range - rango limite hasta que el enemigo cambie de direccion
	 */
	constructor(scene, x, y, speedX, speedY, range) {

        super(scene, x, y, 'enemy');
		this.speedX = speedX;
		this.speedY = speedY;

		this.originX = x;
		this.originY = y;

	    this.range = range;

        scene.add.existing(this);                              // agregar sprite
        scene.physics.add.existing(this);                      // activar fisicas

        this.setScale(0.1 * SCALE);                                   // tamaño en pantalla
        this.body.setSize(320, 650);                           // hitbox ajustada
        this.body.setOffset(150, 50);                          // colocar hitbox


		//this.body.setVelocity(speedX, speedY);
		
    }
	preUpdate (t, dt) {
    super.preUpdate(t, dt)
    dt = dt * this.scene.gameSpeed; // bullet time: mas lento si el juego va lento
    // la lógica particular de `FallingMartian`, aquí
    this.x += this.speedX * dt / 1000; // 2 unidades por segundo
	if (this.x > this.originX + this.range || this.x < this.originX - this.range)
	{
		this.speedX = -this.speedX; // Este enemigo da la vuelta en el eje X si supera el rango límite de movimiento
	}
	this.y += this.speedY * dt / 1000; // 2 unidades por segundo

	if (this.y > this.originY + this.range || this.y < this.originY - this.range)
	{
		this.speedY = -this.speedY; // Este enemigo da la vuelta en el eje Y si supera el rango límite de movimiento
	}
  }
}