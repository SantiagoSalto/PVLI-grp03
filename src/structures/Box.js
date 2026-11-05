/**
 * Clase que representa una caja (por ahora solo es indestructible, pero añadiremos ajustes nuevos para la caja en el futuro)
 */
export default class Box extends Phaser.Physics.Arcade.Sprite {
	/**
	 * Constructor de Enemy
	 * @param {Scene} scene Escena en la que aparecera el enemigo
	 * 
	 * @param {number} x - posicion X
	 * @param {number} y - posicion Y
	 * 
	 * @param {number} speedX - anchura de la caja
	 * @param {number} height - altura de la caja

	 *      * 
	 */
	constructor(scene, x, y, width, height) {

        super(scene, x, y, 'box');

		scene.add.existing(this);                              // agregar sprite
        scene.physics.add.existing(this);                      // activar fisicas
		this.body.setDragX(150); 							   // Así se hace la fricción de la caja sobre el suelo.

        this.setGravityY(1000);                                // gravedad
        this.body.setMaxVelocityY(900);                        // velocidad maxima de caida (si es mayor atraviesa el suelo de Tiled)
        this.body.setMaxVelocityX(50);                        
		
        this.setScale(width/10, height/10);                     	// tamaño en pantalla
        this.body.setSize(width*447 /width, height*447 /height);	// hitbox ajustada
        this.scene.physics.add.collider(this.scene.player, this);	// Colisión entre el jugador y la caja
        this.scene.physics.add.collider(this, this.scene.boxes);	// Colisión entre cajas

    }
    preUpdate(time,delta)
    {
		// Al chocar deja de poder empujarse, y sigue asi mientras el jugador la toque
		if (this.body.blocked.left || this.body.blocked.right) this.setPushable(false);
		else if (!this.body.touching.left && !this.body.touching.right) this.setPushable(true);
	}
}
