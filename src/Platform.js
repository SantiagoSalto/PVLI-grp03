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
	 * @param {jugador} player - referencia del jugador para crear la colisión de la plataforma con él.

	 */
	constructor(scene, x, y, width, height, player) {
		super(scene, x, y, 'platform1');
		this.scene.add.existing(this);
		this.setScale(width*0.007, height*0.01)
		this.scene.physics.add.existing(this, true);
        this.setDisplaySize(width*4.5, height*4.8);
		// Solo el jugador atraviesa la plataforma; cajas y disparos chocan por todos los lados
		this.scene.physics.add.collider(player, this, null, () => this.canLand(player));
		this.scene.physics.add.collider(this.scene.boxes, this);
	}

	// El jugador solo choca si esta cayendo y sus pies vienen de encima de la plataforma
	canLand(player) {
		const margin = 14;                                     // ayuda: sube aunque se quede un poco corto
		const feet = player.body.prev.y + player.body.height;  // pies en el paso anterior
		return player.body.velocity.y >= 0 && feet <= this.body.top + margin;
	}
}