export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' }); 
    }

    preload() {
        this.load.image('play', './assets/Menu/playProvisional.png');
        this.load.image('background1', './assets/Mapa/space.png');
        this.load.image('background2', './assets/Mapa/village.png');
        this.load.image('lose', './assets/Menu/lose.png');
        this.load.image('squirrel', './assets/Personajes/squirrel.png');
    }

    create() {
        this.scene.stop();          
        this.scene.start('MainMenuScene'); 
    }
}