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
	 * @param {number} speedX - velocidad de movimiento X (0 si no se mueve en horizontal)
	 * @param {number} speedY - velocidad de movimiento Y (0 si no se mueve en vertical)
	 * @param {number} range - rango limite hasta que la plataforma cambie de sentido
	 */
	constructor(scene, x, y, width, height, player, speedX = 0, speedY = 0, range = 0) {
		super(scene, x, y, 'platform1');
		this.scene.add.existing(this);
		this.setScale(width*0.007, height*0.01)

		// Sin velocidad es estatica; con velocidad, dinamica para poder moverse
		this.moving = speedX !== 0 || speedY !== 0;
		this.scene.physics.add.existing(this, !this.moving);

        this.setDisplaySize(width*4.5, height*4.8);

		if (this.moving) {
			this.originX = x;
			this.originY = y;
			this.range = range;
			this.speedX = speedX;
			this.speedY = speedY;
			this.body.setImmovable(true);                      // ni el jugador ni las cajas la empujan
			this.body.setAllowGravity(false);
			this.body.setVelocity(speedX, speedY);
		}

		// Solo el jugador atraviesa la plataforma; cajas y disparos chocan por todos los lados
		this.scene.physics.add.collider(player, this, null, () => this.canLand(player));
		this.scene.physics.add.collider(this.scene.boxes, this);
	}

	// Cambia de sentido al llegar al limite de su recorrido
	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (!this.moving) return;

		// Si algo la frena (una caja), vuelve hacia atras para no quedarse atascada
		if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
			this.speedX = -this.speedX;
			this.speedY = -this.speedY;
		}

		// Cambio de dirección de movimiento cuando supera el rango límite.
		if (this.x > this.originX + this.range) this.speedX = -Math.abs(this.speedX);
		if (this.x < this.originX - this.range) this.speedX = Math.abs(this.speedX);
		if (this.y > this.originY + this.range) this.speedY = -Math.abs(this.speedY);
		if (this.y < this.originY - this.range) this.speedY = Math.abs(this.speedY);

		this.body.setVelocity(this.speedX, this.speedY);

		// El jugador que va encima baja con ella en vez de despegarse (si acaba de saltar no se le toca)
		const player = this.scene.player;
		if (this.body.touching.up && player.body.velocity.y > -player.jumpSpeed / 2) player.body.velocity.y = this.speedY;
	}

	// Oculta la plataforma: no se ve ni choca con nada hasta que se acierten sus dianas
	hide() {
		this.setVisible(false);
		this.body.enable = false;
	}

	// Hace aparecer la plataforma
	show() {
		this.setVisible(true);
		this.body.enable = true;
	}

	// El jugador solo choca si baja respecto a la plataforma y sus pies vienen de encima de ella
	canLand(player) {
		const margin = 14;                                     // ayuda: sube aunque se quede un poco corto
		const feet = player.body.prev.y + player.body.height;  // pies en el paso anterior
		return player.body.velocity.y >= this.body.velocity.y && feet <= this.body.top + margin;
	}
}