export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' }); 
    }

    create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho / 2, alto / 2, 'lose');
        
        var play = this.add.image(ancho / 2, alto / 1.25, 'play');
        play.setInteractive();

        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene'); 
        });
    }

    update(time, delta) {
        // EMPTY de momento
    }
}