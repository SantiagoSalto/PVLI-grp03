import Player from '../player/Player.js';
import Enemy from '../Enemy.js';
import Platform from '../Platform.js';
import Box from '../structures/Box.js';
import DestructibleBlock from '../structures/DestructibleBlock.js';
import Spike from '../structures/Spike.js';
import Target from '../structures/Target.js';
import Piece from '../structures/Piece.js';
import PortalSymbol from '../structures/PortalSymbol.js';
import InputManager from '../managers/InputManager.js';
import ArrowCursor from '../managers/ArrowCursor.js';
import { toPx, SCALE } from '../Measures.js';

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
        this.physics.world.OVERLAP_BIAS = 16; // Esto ayudará a evaluar la colisión del jugador y la caja sin que las dos se atraviesen.

        this.setGameSpeed(1);                                  // velocidad normal al empezar

        this.background = this.add.image(ancho / 2, alto / 2, 'background3');
        this.background.setScrollFactor(0.05);

        this.inputManager = new InputManager(this);

        // CARGA DEL TILEMAP (Tiled)
        const map = this.make.tilemap({ key: 'level' + this.level });
        let tileset;
        if (this.level === 1) tileset = map.addTilesetImage('Pipoya_Grass1', 'tilesGrass1');   //nombre en Tiled, clave en Preload
        else tileset = map.addTilesetImage('Pipoya_Dirt1', 'tilesDirt1');
        const ground = map.createLayer('Ground', tileset, 0, 0);
        ground.setCollisionByProperty({ Collision: true });
        ground.setScale(SCALE);

        // Agrandar tambien las posiciones y tamaños de los objetos de Tiled
        map.objects.forEach((layer) => layer.objects.forEach((object) => {
            object.x *= SCALE;
            object.y *= SCALE;
            object.width *= SCALE;
            object.height *= SCALE;
        }));

        //Mundo de fisicas del tamaño del mapa (si no el jugador choca a los 1024 px)
        this.physics.world.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);


        // PERSONAJES
        this.enemies = this.add.group();
        map.getObjectLayer('Characters').objects.forEach((object) => {
            switch (object.name) {
                case 'player':
                    this.player = new Player(this, object.x, object.y);
                    break;
                case 'enemy':
                    this.enemies.add(new Enemy(this, object.x, object.y,
                        this.getProperty(object, 'speedX') * SCALE,
                        this.getProperty(object, 'speedY') * SCALE,
                        toPx(this.getProperty(object, 'range'))));   //range en bloques
                    break;

            }
        });

        // ESTRUCTURAS
        this.boxes = this.add.group();
        this.destructibles = this.add.group();
        this.spikes = this.add.group();
        this.targets = this.add.group();
        this.pieces = this.add.group();
        this.portalOpen = true;                                //solo se cierra si el nivel tiene piezas
        map.getObjectLayer('Structures').objects.forEach((object) => {
            switch (object.name) {
                case 'meta':
                //En Tiled x,y es la esquina superior izquierda; la zona va centrada
                let goal = this.add.zone(object.x + object.width / 2, object.y + object.height / 2, object.width, object.height);
                this.physics.add.existing(goal, true);
                this.portal = this.add.image(goal.x, goal.y, 'portal').setDisplaySize(object.width, object.height);
                this.physics.add.overlap(this.player, goal, () => {
                    this.scene.pause();
                    this.scene.launch('WinScene');
                }, () => this.portalOpen);
                break;
                case 'box':
                    this.boxes.add(new Box(this, object.x, object.y, this.getProperty(object, 'width') * SCALE, 
                    this.getProperty(object, 'height') * SCALE));
                    break;
                case 'destructible':
                    this.destructibles.add(new DestructibleBlock(this, object.x, object.y,
                        toPx(this.getProperty(object, 'width')),      //width y height en bloques
                        toPx(this.getProperty(object, 'height'))));
                    break;
                case 'target':
                    this.targets.add(new Target(this, object.x, object.y,
                        toPx(this.getProperty(object, 'size')),       //size y range en bloques
                        this.getProperty(object, 'speedY') * SCALE,
                        toPx(this.getProperty(object, 'range')),
                        this.getProperty(object, 'group')));
                    break;
                case 'piece':
                    this.pieces.add(new Piece(this, object.x, object.y,
                        toPx(this.getProperty(object, 'size')),       //size en bloques
                        this.getProperty(object, 'stroke')));         //imagen del trazo
                    break;
                case 'hint':
                    //Texto de ayuda de los niveles tutoriales
                    this.add.text(object.x, object.y, this.getProperty(object, 'text'), {
                        fontFamily: 'Georgia, serif',
                        fontSize: 20 * SCALE,
                        color: '#ffffff',
                        stroke: '#3a3326',
                        strokeThickness: 4,
                        align: 'center'
                    }).setOrigin(0.5);
                    break;
                case 'spike':
                    this.spikes.add(new Spike(this, object.x, object.y,
                        toPx(this.getProperty(object, 'width')),      //width y height en bloques
                        toPx(this.getProperty(object, 'height'))));
                    break;
            }
        });
        //Si el nivel tiene piezas, el portal esta cerrado y muestra arriba la letra por completar
        if (this.pieces.getLength() > 0) {
            const strokes = this.pieces.getChildren().map((piece) => piece.texture.key);
            const size = toPx(2);
            this.portalSymbol = new PortalSymbol(this, this.portal.x, this.portal.getTopCenter().y - size / 2 - 10, size, strokes);
            this.portal.setTint(0x555555);
            this.portalOpen = false;
        }

        // PLATAFORMAS
        this.platforms = this.add.group();
        map.getObjectLayer('Platforms').objects.forEach((object) => {
            if (object.name === 'platform') {
                this.platforms.add(new Platform(this, object.x, object.y,
                    this.getProperty(object, 'width') * SCALE,
                    this.getProperty(object, 'height') * SCALE, this.player));
            }
            if (object.name === 'movingPlatform') {
                this.platforms.add(new Platform(this, object.x, object.y,
                    this.getProperty(object, 'width') * SCALE,
                    this.getProperty(object, 'height') * SCALE, this.player,
                    this.getProperty(object, 'speedX') * SCALE,
                    this.getProperty(object, 'speedY') * SCALE,
                    toPx(this.getProperty(object, 'range'))));   //range en bloques
            }
            //Plataforma oculta hasta acertar todas las dianas de su grupo (quieta si speedX y speedY son 0)
            if (object.name === 'targetPlatform') {
                const platform = new Platform(this, object.x, object.y,
                    this.getProperty(object, 'width') * SCALE,
                    this.getProperty(object, 'height') * SCALE, this.player,
                    this.getProperty(object, 'speedX') * SCALE,
                    this.getProperty(object, 'speedY') * SCALE,
                    toPx(this.getProperty(object, 'range')));
                platform.targetGroup = this.getProperty(object, 'group');
                platform.hide();
                this.platforms.add(platform);
            }
        });




        // COLISIONES
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.player, this.boxes);
        this.physics.add.collider(this.boxes, ground);

        // el proyectil desaparece al chocar
        this.projectiles = this.add.group();
        this.physics.add.collider(this.projectiles, ground, (projectile) => projectile.impact());
        this.physics.add.collider(this.projectiles, this.platforms, (projectile) => projectile.impact());
        this.physics.add.collider(this.projectiles, this.boxes, (projectile) => projectile.impact());

        // bloques destructibles: paran al jugador y a las cajas, y se rompen con un disparo
        this.physics.add.collider(this.player, this.destructibles);
        this.physics.add.collider(this.boxes, this.destructibles);
        this.physics.add.overlap(this.projectiles, this.destructibles, (projectile, block) => {
            projectile.impact();
            block.destroy();
        });

        // el proyectil desaparece al acertar una diana: cada disparo solo vale para una
        this.physics.add.overlap(this.projectiles, this.targets, (projectile, target) => {
            const group = target.group;
            projectile.impact();
            target.destroy();
            this.checkTargets(group);
        });

        // el proyectil derrota al enemigo de un golpe (overlap para no empujarlo)
        this.physics.add.overlap(this.projectiles, this.enemies, (projectile, enemy) => {
            projectile.impact();
            enemy.destroy();
        });

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

        // Vidas del jugador en el UI
        this.heart1 = this.add.image(ancho - 900, 10, 'life');
        this.heart1.setOrigin(1, 0);
        this.heart1.setScale(0.017);
        this.heart1.setScrollFactor(0);

        this.heart2 = this.add.image(ancho - 800, 10, 'life');
        this.heart2.setOrigin(1, 0);
        this.heart2.setScale(0.017);
        this.heart2.setScrollFactor(0);

        this.heart3 = this.add.image(ancho - 700, 10, 'life');
        this.heart3.setOrigin(1, 0);
        this.heart3.setScale(0.017);
        this.heart3.setScrollFactor(0);

        //Icono menu de pausa
        var pausa = this.add.image(100, 100, 'pausa');
        pausa.setInteractive();
        pausa.setScrollFactor(0);
        pausa.on('pointerdown', () =>{
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
  
        //Metodo propio de camara para que siga un objeto, en este caso al jugador
        this.cameras.main.startFollow(this.player);
        //Limites a la camara,  poisiciones, & ancho y alto
        this.cameras.main.setBounds(0, 0, map.widthInPixels * SCALE, map.heightInPixels * SCALE);         //si quitamos esta linea se ve totalmente distinto el juego 

        //Evitar que se note borrosos los pixeles
        this.cameras.main.setRoundPixels(true);

        //Flecha que hace de puntero del raton
        this.arrowCursor = new ArrowCursor(this, this.player);
	}
    update(time, delta) {
        this.player.update(time, delta);
        this.arrowCursor.update();
        
        // enemigos y pinchos hacen el mismo daño
        // Al tocar un enemigo o pincho en el aire, overlap hace creer al jugador que esta en el suelo y podria volver a saltar
        // Por eso guardamos touching.down antes de comprobarlo y lo dejamos como estaba despues
        const touchingDown = this.player.body.touching.down;
        const touchingDanger = this.physics.overlap(this.player, this.enemies) || this.physics.overlap(this.player, this.spikes);
        this.physics.overlap(this.player, this.pieces, (player, piece) => this.collectPiece(piece));
        this.player.body.touching.down = touchingDown;
        if (touchingDanger && !this.player.invencible)
        {
            this.player.lives -= 1; // Pierde una vida
            this.player.invencible = true; // El jugador se vuelve invencible temporalmente
            if (this.player.lives <= 0) // Cuando el jugador se queda sin vidas pierde el nivel
            {
                this.scene.pause();
                this.scene.launch('LoseScene');
            }
        }
        if (this.player.lives == 3) // 3 vidas
        {
            this.heart1.setAlpha(1);
            this.heart2.setAlpha(1);
            this.heart3.setAlpha(1);
        }
        else if (this.player.lives == 2) // 2 vidas
        {
            this.heart1.setAlpha(1);
            this.heart2.setAlpha(1);
            this.heart3.setAlpha(0);
        }
        else if (this.player.lives == 1) // 1 vida
        {
            this.heart1.setAlpha(1);
            this.heart2.setAlpha(0);
            this.heart3.setAlpha(0);
        }
        else if (this.player.lives == 0) // Sin vidas
        {
            this.heart1.setAlpha(0);
            this.heart2.setAlpha(0);
            this.heart3.setAlpha(0);
        }
    }

    // Velocidad de todo el juego (1 = normal, 0.1 = diez veces mas lento) para el bullet time
    // se mantienen 60 pasos de fisica por segundo, cada uno mas pequeño, para que no vaya a tirones
    setGameSpeed(speed) {
        this.gameSpeed = speed;
        this.physics.world.setFPS(60 / speed);
        this.physics.world.timeScale = 1 / speed;
    }

    //Rellena el trazo en la letra del portal; con la letra completa el portal se abre
    collectPiece(piece) {
        this.portalSymbol.fill(piece.texture.key);
        piece.destroy();
        if (this.pieces.getLength() > 0) return;

        this.portalSymbol.complete();
        this.portal.clearTint();
        this.portalOpen = true;
    }

    //Si ya no quedan dianas del grupo aparece su plataforma
    checkTargets(group) {
        const remaining = this.targets.getChildren().some((target) => target.group === group);
        if (remaining) return;

        this.platforms.getChildren().forEach((platform) => {
            if (platform.targetGroup === group) platform.show();
        });
    }

    //Devuelve el valor de una propiedad personalizada de un objeto de Tiled
    getProperty(object, name) {
        const property = object.properties.find(p => p.name === name);
        return property.value;
    }

}
