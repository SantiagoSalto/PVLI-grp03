import Player from '../player/Player.js';
import Enemy from '../Enemy.js';
import Platform from '../Platform.js';
import InputManager from '../managers/InputManager.js';

export default class PlayScene extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayScene' });
	}

	create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho / 2, alto / 2, 'background2');

        this.inputManager = new InputManager(this);

        this.player = new Player(this, 100, alto - 100);

        // Plataformas con su propio constructor para componer el nivel de prueba.
        this.Platform = new Platform(this, 300, 580, 250, 10, this.player);
        this.Platform2 = new Platform(this, 300, 450, 33, 6, this.player);
        this.Platform3 = new Platform(this, 550, 329, 33, 6, this.player);

        this.enemies = this.physics.add.group();

        this.Enemy1 = new Enemy(this, 550, 500, 75, 0, 100);
        this.Enemy2 = new Enemy(this, 400, 200, 0, 50, 50);

        this.enemies.add(this.Enemy1);
        this.enemies.add(this.Enemy2);

        this.physics.add.overlap(this.player, this.enemies);
        //this.physics.add.overlap(this.player, this.Enemy1);


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

        //Provisioales para visualización
            //Win scene
            var win = this.add.image(ancho -200, 70, 'win');
            play.setOrigin(1, 0);
            win.setScale(0.10);
            win.setInteractive();
            win.on('pointerdown', () =>{
                this.scene.pause();
                this.scene.launch('WinScene');
            });

            //Lose scene
            var death = this.add.image(ancho -300, 70, 'death');
            play.setOrigin(1, 0);
            death.setScale(0.10);
            death.setInteractive();
            death.on('pointerdown', () =>{
                this.scene.pause();
                this.scene.launch('LoseScene');
            });
	}

    update(time, delta) {
        this.player.update(time, delta);
        if (this.physics.overlap(this.player, this.enemies) && this.player.invencible == 0)
        {
            this.player.lives -= 1;
            this.player.invencible = 1;
            console.log("Enemigo tocado. Vidas restantes: " + this.player.lives)
        }
    }

}
