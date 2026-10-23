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

        //----------TITULO----------
        var titleTexto = this.add.text(ancho/2, 50, 'Créditos', {
            fontFamily: 'Arial',
            fontSize: '48px',
            color: '#ffffffff',
            fontStyle: 'bold'
        });
        titleTexto.setOrigin(0.5);

        const estilo1 = {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#3f2929ff',
            fontStyle: 'bold'
        }

        const estilo2 = {
            fontFamily: 'Arial',
            fontSize: '30px',
            color: '#ffffffff',
            fontStyle: 'bold'
        }

        //------------STUDIO----------
        const margenIzquierdo = this.background.x - (this.background.displayWidth/2) + 100;
        let studio = this.add.text(50, 150, 'Realizado por KOSA studios: ', estilo1);
        studio.setFill('green');
        //--------------------BLOQUES DE CREDITOS--------------

        let assets = this.add.text(ancho/2 - 100,200, 'Assets utilizados ', estilo2);

        let sonido = this.add.image(150, alto/1.45, 'yellowSquare');
        sonido.setScale(1.5);
        sonido.scaleX = 1.5;
        sonido.scaleY = 2.5;

        let music = this.add.image(ancho/2, alto/1.45, 'yellowSquare');
        // music.setScale(1.5);
        music.scaleX = 1.5;
        music.scaleY = 2.5;

        let visuales = this.add.image(ancho-150, alto/1.45, 'yellowSquare');
        // visuales.setScale(1.5);
        visuales.scaleX = 1.5;
        visuales.scaleY = 2.5;

        const margenSonido = sonido.x - (sonido.displayWidth/2);
        const margenMusic = music.x - (music.displayWidth/2);
        const margenVisual = visuales.x - (visuales.displayWidth/2);
                         //Y                                        //margen
        const bloquesY = (alto / 1.45) - (sonido.displayHeight / 2) + 20;

        let titlesonido = this.add.text(margenSonido + 100, bloquesY, "Sonido:", estilo1)
        let titlemusic = this.add.text(margenMusic + 100, bloquesY, "Music:", estilo1)
        let titlevisuales = this.add.text(margenVisual + 100, bloquesY, "Visuales:", estilo1)

        //alineado centro horzontal (0.5) y arriba vertical (0)
        titlesonido.setOrigin(0.5, 0)
        titlemusic.setOrigin(0.5, 0)
        titlevisuales.setOrigin(0.5, 0)




        //Boton exit
        var exit = this.add.image(ancho-50, 50, 'exit');
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene');
        });
    }

}