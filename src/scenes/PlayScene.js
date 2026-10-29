import Player from '../player/Player.js';
import Enemy from '../Enemy.js';
import Platform from '../Platform.js';
import InputManager from '../managers/InputManager.js';
import { toPx } from '../Measures.js';

export default class PlayScene extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayScene' });
	}

	init(data) {
        this.level = data.level || 1;   //Si no llega nivel, cargamos el 1
	}

	create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //this.background = this.add.image(ancho / 2, alto / 2, 'background2');

        this.inputManager = new InputManager(this);                      

        // plataforma provisional para probar el movimiento
        //this.platform = this.add.rectangle(ancho/ 2, alto - 20, ancho, 40, 0x6b4f2a);
        //this.physics.add.existing(this.platform, true);

        // plataformas provisionales en el aire para probar el salto
        // this.platform2 = this.add.rectangle(300, 450, 150, 20, 0x6b4f2a);
        // this.physics.add.existing(this.platform2, true);

        // this.platform3 = this.add.rectangle(550, 330, 150, 20, 0x6b4f2a);
        // this.physics.add.existing(this.platform3, true);


        // CARGA DEL TILEMAP (Tiled)
        const map = this.make.tilemap({ key: 'level' + this.level });
        let tileset;
        if (this.level === 1) tileset = map.addTilesetImage('Pipoya_Grass1', 'tilesGrass1');   //nombre en Tiled, clave en Preload
        else tileset = map.addTilesetImage('Pipoya_Dirt1', 'tilesDirt1');
        const ground = map.createLayer('Ground', tileset, 0, 0);
        ground.setCollisionByProperty({ Collision: true });

        //Mundo de fisicas del tamaño del mapa (si no el jugador choca a los 1024 px)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


        // PERSONAJES
        this.enemies = this.add.group();
        map.getObjectLayer('Characters').objects.forEach((object) => {
            switch (object.name) {
                case 'player':
                    this.player = new Player(this, object.x, object.y);
                    break;
                case 'enemy':
                    this.enemies.add(new Enemy(this, object.x, object.y,
                        this.getProperty(object, 'speedX'),
                        this.getProperty(object, 'speedY'),
                        toPx(this.getProperty(object, 'range'))));   //range en bloques
                    break;
            }
        });

        // PLATAFORMAS
        map.getObjectLayer('Platforms').objects.forEach((object) => {
            if (object.name === 'platform') {
                new Platform(this, object.x, object.y,
                    this.getProperty(object, 'width'),
                    this.getProperty(object, 'height'), this.player);
            }
        });

        // ESTRUCTURAS 
        map.getObjectLayer('Structures').objects.forEach((object) => {
            if (object.name === 'meta') {
                //En Tiled x,y es la esquina superior izquierda; la zona va centrada
                let goal = this.add.zone(object.x + object.width / 2, object.y + object.height / 2, object.width, object.height);
                this.physics.add.existing(goal, true);
                this.physics.add.overlap(this.player, goal, () => {
                    this.scene.pause();
                    this.scene.launch('WinScene');
                });
            }
        });

        // COLISIONES
        this.physics.add.collider(this.player, ground);

        // Ahora el jugador y las plataformas se crean desde el mapa de Tiled
        // this.player = new Player(this, 100, alto - 100);

        // Plataformas con su propio constructor para componer el nivel de prueba.
        // this.Platform = new Platform(this, 300, 580, 250, 10, this.player);
        // this.Platform2 = new Platform(this, 300, 450, 33, 6, this.player);
        // this.Platform3 = new Platform(this, 550, 329, 33, 6, this.player);



        // this.physics.add.collider(this.player, this.platform);
        // this.physics.add.collider(this.player, this.platform2);
        // this.physics.add.collider(this.player, this.platform3);

        // NOTA de Alejandro: Hay que hacer que la colisión con el jugador se aplique en el mismo constructor si es posible. Por ahora las colisiones se administrarán aquí hasta que
        // encontremos una solución. 

        // this.physics.add.collider(this.player, this.Platform);
        // this.physics.add.collider(this.player, this.Platform2);
        // this.physics.add.collider(this.player, this.Platform3);





        // Ahora los enemigos se crean desde el mapa de Tiled
        // this.Enemy1 = new Enemy(this, 550, 500, 75, 0, 100);
        // this.Enemy2 = new Enemy(this, 400, 200, 0, 50, 50);


        //Iconos Interaccionables UI
        var play = this.add.image(ancho - 10, 10, 'play');
        play.setOrigin(1, 0);
        play.setScale(0.3);
        play.setInteractive();
        play.setScrollFactor(0);
        play.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('GameOverScene');
        });

        //Icono menu de pausa
        var pausa = this.add.image(100, 100, 'pausa');
        pausa.setInteractive();
        pausa.setScrollFactor(0);
        pausa.on('pointerdown', () =>{
            this.scene.pause()
            this.scene.launch('PauseScene');
        })

        //Provisioales para visualización
            //Win scene
            // var win = this.add.image(ancho -200, 70, 'win');
            // play.setOrigin(1, 0);
            // win.setScale(0.10);
            // win.setInteractive();
            // win.on('pointerdown', () =>{
            //     this.scene.pause();
            //     this.scene.launch('WinScene');
            // });

            // //Lose scene
            // var death = this.add.image(ancho -300, 70, 'death');
            // play.setOrigin(1, 0);
            // death.setScale(0.10);
            // death.setInteractive();
            // death.on('pointerdown', () =>{
            //     this.scene.pause();
            //     this.scene.launch('LoseScene');
            // });

        //Cámara:     
        //Metodo propio de camara para que siga un objeto, en este caso al jugador
        this.cameras.main.startFollow(this.player);
        //Limites a la camara,  poisiciones, & ancho y alto
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);         //si quitamos esta linea se ve totalmente distinto el juego 

        //Evitar que se note borrosos los pixeles
        this.cameras.main.setRoundPixels(true);
	}

    update(time, delta) {
        this.player.update(time, delta);
    }

    //Devuelve el valor de una propiedad personalizada de un objeto de Tiled
    getProperty(object, name) {
        const property = object.properties.find(p => p.name === name);
        return property.value;
    }

}
