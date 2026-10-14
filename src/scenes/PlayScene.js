import Player from '../player/Player.js';
import InputManager from '../managers/InputManager.js';

export default class Village extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayScene' });
	}

	create() {
        this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background2');

        this.inputManager = new InputManager(this);                      

        // plataforma provisional para probar el movimiento
        this.platform = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height - 20, this.cameras.main.width, 40, 0x6b4f2a);
        this.physics.add.existing(this.platform, true);                  

        this.player = new Player(this, 100, this.cameras.main.height - 100);
        this.physics.add.collider(this.player, this.platform);

        var play = this.add.image(this.cameras.main.width - 10, 10, 'play');
        play.setOrigin(1, 0);
        play.setScale(0.3);
        play.setInteractive();

        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('GameOverScene');
        });
	}

    update(time, delta) {
        this.player.update(time, delta);
    }

}
