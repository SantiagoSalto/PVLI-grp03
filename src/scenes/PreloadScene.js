export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' }); 
    }

    preload() {
        //Fondos de Pantalla
        this.load.image('background1', './assets/Mapa/space.png');
        this.load.image('background2', './assets/Mapa/village.png');
        this.load.image('background3', './assets/Mapa/boreal.png');
        this.load.image('background4', './assets/Mapa/levelselector.jpg');
        //Provisionales
        this.load.image('play', './assets/Menu/playProvisional.png');
        this.load.image('lose', './assets/Menu/lose.png');
        //Jugador
        this.load.image('squirrel', './assets/Personajes/squirrel.png');

        //Iconos
        this.load.image('ajustes', './assets/Menu/gear.png');
        this.load.image('greenSquare', './assets/Menu/ajustesSquare.png');
        this.load.image('exit', './assets/Menu/exitLeft.png');
        this.load.image('exit_button', './assets/Menu/x_button.png');
        this.load.image('credits', './assets/Menu/credits.png');
        this.load.image('button', './assets/Menu/button.png');
        this.load.image('iconLevel', './assets/Menu/iconLevel.png');
        this.load.image('pausa', './assets/Menu/pause.png');
        //Info PreNivel
        this.load.image('blueSquare', './assets/Menu/levelSquare.png');
        this.load.image('star', './assets/Menu/star.png');
        this.load.image('nostar', '/assets/Menu/star_outline.png');
    }

    create() {
        this.scene.stop();          
        this.scene.start('MainMenuScene'); 
    }
}