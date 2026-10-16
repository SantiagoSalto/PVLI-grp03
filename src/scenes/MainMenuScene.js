export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' }); 
    }

    create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho/ 2, alto / 2, 'background1');
        var play = this.add.image(ancho/ 2, alto/ 1.25, 'play');

        var credits = this.add.image(100, 500, 'credits');
        credits.setScale(0.15);
        var ajustes = this.add.image(700, 500, 'ajustes');

        play.setInteractive();
        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('LevelSelector'); 
        });

        ajustes.setInteractive();
        ajustes.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('AjustesScene');
        });

        credits.setInteractive();
        credits.on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.start('CreditsScene');
        });
    }

    update(time, delta) {
        // EMPTY de momento
    }
}