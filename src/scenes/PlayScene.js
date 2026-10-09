export default class Village extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayScene' }); 
	}
	
	create() {
        this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background2');

        this.character = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 3, 'squirrel');
        this.character.setScale(0.5, 0.5);
        
        var play = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 1.25, 'play');
        play.setInteractive();

        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('GameOverScene'); 
        });
	}

    update(time, delta) {
        // Empty de momento
    }

}