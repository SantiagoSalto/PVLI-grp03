/**
 * Clase que representa un enemigo
 * @extends Phaser.GameObjects.Sprite
 */
export default class Enemy extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de Enemy
	 * @param {Scene} scene Escena en la que aparecerá el enemigo
	 * @param {number} x - coordenada X
	 * @param {number} y - coordenada Y
	 * @param {number} speedX - velocidad de movimiento en el eje X
     * @param {number} speedY - velocidad de movimiento en el eje Y
     * 
     * @param {string} rangeX - rango límite del eje X hasta que el enemigo cambie de dirección
     * @param {string} rangeY - rango límite del eje Y hasta que el enemigo cambie de dirección



	 * @param {string} imgKey - nombre de la imagen que representa al enemigo

	 */
	constructor(scene, originX, originY, x, y, speedX, speedY, rangeX, rangeY, imgKey) {
		super(scene, originX, originY, x, y, speedX, speedY, rangeX, rangeY, imgKey);
		this.scene.add.existing(this);
		this.setOrigin(originX, originY);
		this.scene.physics.add.existing(this);
				
		this.body.setVelocity(speedX, speedY)
		// Escuchamos el evento en el que el sprite alcanza el rango máximo al moverse
		// Tenemos que guardar el identificador del enemigo en el body
		this.body.key = imgKey; 
		// Nos guardamos a nosotros en self para poder acceder desde el evento
		// que detecta las colisiones con el límite del mundo
		let self = this;
		this.body.world.on(function(body, up, down, left, right)
		{
			// Comprobamos si somos nosotros los que hemos llegado al final

			console.log(x+origin, y +origin)
			if(self.x > 0 && self.x + self.originX > self.x + self.rangeX || self.x < 0 && self.x + self.originX < self.x + self.rangeX){
				self.speedX = -self.speedX
			}
			if(self.y > 0 && self.y + self.originY > self.y + self.rangeY || self.y < 0 && self.y + self.originY < self.y + self.rangeY){
				self.speedY = -self.speedY;
			}
		})
	}
	
}