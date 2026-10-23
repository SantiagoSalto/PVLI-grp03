export default class LoseScene extends Phaser.Scene{

constructor() {
    super({ key: 'LoseScene' }); 
}

    create(){
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //Creamos manualmente rectangulo negro que ocupe toda la pantalla
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena
        
        //Bloque Rojo Menu
        this.background = this.add.image(ancho/2, alto/2, 'redSquare');
        this.background.setScale(3);
        
        //Boton exit ->level selector
        var resume = this.add.image(ancho/2, alto/2-100, 'redbutton');
        resume.setScale(0.5);
        resume.setInteractive();

        //texto
        var resetTexto = this.add.text(ancho/2, alto/2-100, 'EXIT', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000ff',
            fontStyle: 'bold'
        });
        resetTexto.setOrigin(0.5);

        resume.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('LevelSelector'); 
        });

        //boton reset nivel 
        var reset = this.add.image(ancho/2, alto/2, 'redbutton');
        reset.setScale(0.5);
        reset.setInteractive();


        //texto
        var resetTexto = this.add.text(ancho/2, alto/2, 'RETRY', {
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
