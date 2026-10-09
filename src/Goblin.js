import Enemy from './Enemy.js';

/**
 * Clase que representa un enemigo goblin
 * @extends Enemy
 */
export default class Goblin extends Enemy {
	/**
	 * Constructor de Goblin
	 * @param {Scene} scene Escena en la que aparecerá el enemigo
	 * @param {number} x - coordenada X
	 * @param {number} y - coordenada Y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 200, 'goblin'); //llamamos al constructor de Enemy con velocidad 200 e imagen 'goblin'
		this.setDisplaySize(50,50); // asignamos el tamaño con el que queremos que se vea su imagen
	}
}