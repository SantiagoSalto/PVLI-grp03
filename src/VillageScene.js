import Goblin from './Goblin.js';
import Orc from './Orc.js';
/**
 * Escena principal.
 * @extends Phaser.Scene
 */
export default class Village extends Phaser.Scene {
	constructor() {
		super({ key: 'village' }); //seteamos el nobmre de la escena para el SceneManager
	}
	
	/**
	* Carga de los recursos que vamos a necesitar en la escena
	*/
	preload(){
		this.load.image('village', 'assets/village.webp');
		this.load.image('orc', 'assets/orc.png');
		this.load.image('goblin', 'assets/goblin.png');
	}
	
	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {
		//Imagen de fondo
		this.add.image(0, 0, 'village').setOrigin(0, 0);
		
		//Creamos nuestros Personajes que heredan 
		//de Enemy, que a su vez hereda de Sprite
		let orc = new Orc(this, 20, 100);
		let goblin = new Goblin(this, 50, 500)
	}

}
