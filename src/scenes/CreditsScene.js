export default class CreditsScene extends Phaser.Scene {

constructor() {
    super({ key: 'CreditsScene' }); 
}

create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho/2, alto/2, 'background3');

        //Boton exit
        var exit = this.add.image(ancho-50, 50, 'exit');
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene'); 
        });
    }

}