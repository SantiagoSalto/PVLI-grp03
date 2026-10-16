import Player from '../player/Player.js';
import InputManager from '../managers/InputManager.js';

export default class Village extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayScene' });
	}

	create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho / 2, alto / 2, 'background2');

        this.inputManager = new InputManager(this);                      

        // plataforma provisional para probar el movimiento
        this.platform = this.add.rectangle(ancho/ 2, alto - 20, ancho, 40, 0x6b4f2a);
        this.physics.add.existing(this.platform, true);

        // plataformas provisionales en el aire para probar el salto
        this.platform2 = this.add.rectangle(300, 450, 150, 20, 0x6b4f2a);
        this.physics.add.existing(this.platform2, true);

        this.platform3 = this.add.rectangle(550, 330, 150, 20, 0x6b4f2a);
        this.physics.add.existing(this.platform3, true);

        this.player = new Player(this, 100, alto - 100);
        this.physics.add.collider(this.player, this.platform);
        this.physics.add.collider(this.player, this.platform2);
        this.physics.add.collider(this.player, this.platform3);

        //Iconos Interaccionables UI
        var play = this.add.image(ancho - 10, 10, 'play');
        play.setOrigin(1, 0);
        play.setScale(0.3);
        play.setInteractive();

        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('GameOverScene');
        });

        //Icono menu de pausa
        var pausa = this.add.image(100, 100, 'pausa');
        pausa.setInteractive();
        pausa.on('pointerdown', () =>{
            this.scene.pause()
            this.scene.launch('PauseScene');
        })
	}

    update(time, delta) {
        this.player.update(time, delta);
    }

}
