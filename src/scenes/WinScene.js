export default class WinScene extends Phaser.Scene{

constructor() {
    super({ key: 'WinScene' }); 
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
        
        //Boton continuar ->level selector
        var resume = this.add.image(ancho/2, alto/2-100, 'bluebutton');
        resume.setScale(0.5);
        resume.setInteractive();

        //texto
        var resetTexto = this.add.text(ancho/2, alto/2-100, 'CONTINUE', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000ff',
            fontStyle: 'bold'
        });
        resetTexto.setOrigin(0.5);

        resume.on('pointerdown', () => {
            this.scene.stop('PlayScene');
            this.scene.stop();
            this.scene.start('LevelSelector'); 
        });

        //boton reset nivel 
        var reset = this.add.image(ancho/2, alto/2, 'bluebutton');
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

