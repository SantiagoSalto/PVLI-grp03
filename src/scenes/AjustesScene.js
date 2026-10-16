export default class AjustesScene extends Phaser.Scene{

constructor() {
    super({ key: 'AjustesScene' }); 
}

create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //Creamos manualmente rectangulo negro que ocupe toda la pantalla
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena

        this.background = this.add.image(ancho/2, alto/2, 'greenSquare');
        this.background.setScale(3);

        //Boton exit
        var exit = this.add.image(580, 120, 'exit_button');
        exit.setScale(1.5);
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene'); 
        });
    }

}