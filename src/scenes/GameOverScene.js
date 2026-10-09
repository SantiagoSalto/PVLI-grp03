export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' }); 
    }

    create() {
        this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'lose');
        
        var play = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 1.25, 'play');
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