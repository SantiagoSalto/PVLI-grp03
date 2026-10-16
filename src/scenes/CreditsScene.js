export default class CreditsScene extends Phaser.Scene {

constructor() {
    super({ key: 'CreditsScene' }); 
}

create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho/2, alto/2, 'background3');

        //fondo negro titulo
        let overlay = this.add.rectangle(ancho / 2, 60, ancho/2-35, alto/6-5, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu

        //Borde titulo
        var title= this.add.image(ancho/2, 60, 'border');
        title.setDisplaySize(ancho/2, alto/6);
        
        //texto titulo
        var titleTexto = this.add.text(ancho/2, 50, 'Créditos', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffffff',
            fontStyle: 'bold'
        });
        titleTexto.setOrigin(0.5);


        //Boton exit
        var exit = this.add.image(ancho-50, 50, 'exit');
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene'); 
        });
    }

}