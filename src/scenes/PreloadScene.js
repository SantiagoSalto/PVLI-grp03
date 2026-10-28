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
        //Enemigo
        this.load.image('enemy', './assets/Personajes/parrot.png');
        //Plataforma
        this.load.image('platform1', './assets/Suelos/hierba-1.png');

        //Iconos
        this.load.image('ajustes', './assets/Menu/gear.png');
        this.load.image('greenSquare', './assets/Menu/ajustesSquare.png');
        this.load.image('exit', './assets/Menu/exitLeft.png');
        this.load.image('exit_button', './assets/Menu/x_button.png');
        this.load.image('credits', './assets/Menu/credits.png');
        this.load.image('button', './assets/Menu/button.png');
        this.load.image('iconLevel', './assets/Menu/iconLevel.png');
        this.load.image('pausa', './assets/Menu/pause.png');
        this.load.image('life', './assets/Menu/Heart.png');

        //Info PreNivel
        this.load.image('blueSquare', './assets/Menu/levelSquare.png');
        this.load.image('star', './assets/Menu/star.png');
        this.load.image('nostar', './assets/Menu/star_outline.png');
        //Win scene
        this.load.image('bluebutton', './assets/Menu/button3.png')
        this.load.image('win', './assets/Menu/win.png');

        //Lose Scene
        this.load.image('redSquare', './assets/Menu/loseSquare.png');
        this.load.image('redbutton', './assets/Menu/button2.png')
        this.load.image('death', './assets/Menu/death.png');

        //Ajustes barras
        this.load.image('barra', './assets/Menu/barra.png');
        this.load.image('pinkBar', './assets/Menu/settingsbar.png');
        this.load.image('blueBar', './assets/Menu/settingsbar2.png')
        //Credits
        this.load.image('border', './assets/Menu/border.png');
        this.load.image('yellowSquare', './assets/Menu/creditsSquare.png')
    }

    create() {
        this.scene.stop();          
        this.scene.start('MainMenuScene'); 
    }
}