import Enemy from './Enemy.js';

/**
 * Clase que representa un enemigo orco
 * @extends Enemy
 */
export default class Orc extends Enemy {
	/**
	 * Constructor de Orc
	 * @param {Scene} scene Escena en la que aparecerá el enemigo
	 * @param {number} x - coordenada X
	 * @param {number} y - coordenada Y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 70, 'orc'); //llamamos al constructor de Enemy con velocidad 70 e imagen 'orc'
		this.setDisplaySize(100,100); // asignamos el tamaño con el que queremos que se vea su imagen
	}
}