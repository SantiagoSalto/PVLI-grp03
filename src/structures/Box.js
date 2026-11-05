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
    preUpdate(time,delta) // Así se hace la fricción de la caja sobre el suelo.
    {
		if (this.body.blocked.left || this.body.blocked.right) // Esto es necesario para que el jugador no termine atravesando la caja estando en una pared.
															   // body.blocked es una booleana que se activa si una fuerza está empujando un objeto pero no se puede
															   // mover en la dirección de la fuerza porque está siendo bloqueada por algo inamovible.
		{
			this.setPushable(false); // Deja de empujar la caja si hay algún bloqueo a la izquierda o la derecha.
		} 
		else this.setPushable(true); // Cuando ya no haga falta evaluar si la caja está bloqueada, vuelve a hacerla
									 // empujable para cuando el jugador necesite moverla hacia el otro lado.
	}
}
