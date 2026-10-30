export default class PauseScene extends Phaser.Scene {

    constructor(){
        super({ key: 'PauseScene'});
    }


    create(){
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //Creamos manualmente rectangulo negro que ocupe toda la pantalla
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena

        this.background = this.add.image(ancho/2, alto/2, 'greenSquare');
        this.background.setScale(3);

        // var star = this.add.image(ancho/2, alto/2, 'star');
        // var nostar = this.add.image(ancho/2-100, alto/2.8, 'nostar');
        // var nostar1 = this.add.image(ancho/2, alto/2.8, 'nostar');
        // var nostar2 = this.add.image(ancho/2 + 100, alto/2.8, 'nostar');
        
        //Boton resume nivel
        var resume = this.add.image(ancho/2, alto/2-100, 'button');
        resume.setScale(0.5);
        resume.setInteractive();

        //texto
        var resetTexto = this.add.text(ancho/2, alto/2-100, 'RESUME', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000ff',
            fontStyle: 'bold'
        });
        resetTexto.setOrigin(0.5);

        resume.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('PlayScene'); 
        });

        //boton reset nivel 
        var reset = this.add.image(ancho/2, alto/2, 'button');
        reset.setScale(0.5);
        reset.setInteractive();


        //texto
        var resetTexto = this.add.text(ancho/2, alto/2, 'RESET', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000ff',
            fontStyle: 'bold'
        });
        resetTexto.setOrigin(0.5);

        reset.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('PlayScene'); 
        });
    }
};