export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' }); 
    }

    create() {
        this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background1');
        
        var play = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 1.25, 'play');
        play.setInteractive();

        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('PlayScene'); 
        });
    }

    update(time, delta) {
        // EMPTY de momento
    }
}