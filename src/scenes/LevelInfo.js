export default class LevelInfo extends Phaser.Scene {

    constructor(){
        super({ key: 'LevelInfo'});
    }


    create(){
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //Creamos manualmente rectangulo negro que ocupe toda la pantalla
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena

        this.background = this.add.image(ancho/2, alto/2, 'blueSquare');
        this.background.setScale(3);

        // var star = this.add.image(ancho/2, alto/2, 'star');
        var nostar = this.add.image(ancho/2-100, alto/2.8, 'nostar');
        var nostar1 = this.add.image(ancho/2, alto/2.8, 'nostar');
        var nostar2 = this.add.image(ancho/2 + 100, alto/2.8, 'nostar');
        
        //boton Start
        var play = this.add.image(ancho/2, alto/1.5, 'play');
        play.setScale(0.5);
        play.setInteractive();
        play.on('pointerdown', () => {
            this.scene.stop('LevelSelector'); //Paramos escena padre
            this.scene.stop(); //Paramos escena pop-up
            this.scene.start("PlayScene"); //Iniciamos nivel
        });

        
        //Boton exit
        var exit = this.add.image(580, 120, 'exit_button');
        exit.setScale(1.5);
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('LevelSelector'); 
        });
    }
};