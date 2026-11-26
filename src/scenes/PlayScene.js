import Player from '../player/Player.js';
import Enemy from '../Enemy.js';
import Platform from '../Platform.js';
import Box from '../structures/Box.js';
import DestructibleBlock from '../structures/DestructibleBlock.js';
import Spike from '../structures/Spike.js';
import Lava from '../structures/Lava.js';
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
        
        //Mascara efecto slowmotion de pantalla
        this.createSlowAttackEffect(ancho,alto);

        this.inputManager = new InputManager(this);

        // ---------------CARGA DEL TILEMAP (Tiled)---------------
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


        // Cronómetro del nivel
        this.timeonlevel = 0;

        this.timeonlevelText = this.add.text(ancho - 600, ancho - 1000, 'Tiempo: segundos', { // Uso un texto para indicar el tiempo en el nivel.
            fontFamily: 'Arial',
            fontSize: '32px',
            fill: '#ffffff'
        });
        this.timeonlevelText.setScrollFactor(0); // El texto se queda quieto en la pantalla
        this.timeonlevelText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 4, true, true); // Añado una sombra para que el
                                                                                  // texto siempre sea legible.
        this.timeonlevelText.setDepth(2);
        // ---------------PERSONAJES---------------
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

        // ---------------ESTRUCTURAS---------------
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
                this.tweens.add({
                    targets: this.portal,
                    y: this.portal.y-5,
                    duration: 400,
                    repeat: -1,
                    yoyo: true,
                    ease: 'Sine.easeInOut'

                });
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
                        toPx(this.getProperty(object, 'height')),
                        this.getProperty(object, 'mortal')));         //bool en Tiled, solo en Infierno
                    break;
                case 'lava':
                    //Lava que sube desde (x, y) y cubre hasta el fondo del mapa; speed en bloques por segundo
                    this.lava = new Lava(this, object.x, object.y, object.width,
                        map.heightInPixels * SCALE, toPx(this.getProperty(object, 'speed')));
                    break;
            }
        });

        // ---------------PLATAFORMAS---------------
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
        //La lava tapa las plataformas que se traga (la UI se crea despues y queda encima)
        if (this.lava) this.children.bringToTop(this.lava);

        // ---------------COLISIONES---------------
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

        //---------------ICONOS UI---------------
        // Vidas del jugador en el UI
        this.heart1 = this.add.image(ancho - 900, 10, 'life').setDepth(2);
        this.heart1.setOrigin(1, 0);
        this.heart1.setScale(0.017);
        this.heart1.setScrollFactor(0);
        

        this.heart2 = this.add.image(ancho - 800, 10, 'life');
        this.heart2.setOrigin(1, 0);
        this.heart2.setScale(0.017);
        this.heart2.setScrollFactor(0);
        this.heart2.setDepth(2);

        this.heart3 = this.add.image(ancho - 700, 10, 'life');
        this.heart3.setOrigin(1, 0);
        this.heart3.setScale(0.017);
        this.heart3.setScrollFactor(0);
        this.heart3.setDepth(2);



        this.tweens.add({
            targets: this.heart1,
            x: {from: ancho-900, to: ancho-900-10},
            duration: 1800, 
            repeat:-1,
            yoyo: true, 
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.heart2,
            x: {from: ancho-800, to: ancho-800-10},
            duration: 1800, 
            repeat:-1,
            yoyo: true, 
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.heart3,
            x: {from: ancho-700, to: ancho-700-10},
            duration: 1800, 
            repeat:-1,
            yoyo: true, 
            ease: 'Sine.easeInOut'
        });

        //Si el nivel tiene piezas, el portal esta cerrado y la letra por completar sale sobre el portal y junto a las vidas
        if (this.pieces.getLength() > 0) {
            const strokes = this.pieces.getChildren().map((piece) => piece.texture.key);
            const size = toPx(2);
            this.portalSymbol = new PortalSymbol(this, this.portal.x, this.portal.getTopCenter().y - size / 2 - 10, size, strokes);
            this.uiSymbol = new PortalSymbol(this, ancho - 650, 50, size, strokes);
            this.uiSymbol.fixToScreen();
            this.portal.setTint(0x555555);
            this.portalOpen = false;
        }

        //Icono menu de pausa
        var pausa = this.add.image(ancho-50, 50, 'pausa');
        pausa.setInteractive();
        pausa.setScrollFactor(0);
        pausa.setDepth(200);
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

        //Ponerle aura a la ardilla
        //Contenedor
	}
    update(time, delta) {
        this.player.update(time, delta);
        this.arrowCursor.update();

        this.timeonlevel += delta / 1000 * this.gameSpeed; // El tiempo del nivel se actualiza cada instante de update, dividido entre 1000 para
                                                           // que se exprese el tiempo en segundos y no en milisegundos.
                                                           // También haré que la velocidad del juego afecte al cronómetro
        this.timeonlevelText.setText("Tiempo: " + this.timeevaluate(this.timeonlevel)); 
    


        // enemigos y pinchos hacen el mismo daño
        // Al tocar un enemigo o pincho en el aire, overlap hace creer al jugador que esta en el suelo y podria volver a saltar
        // Por eso guardamos touching.down antes de comprobarlo y lo dejamos como estaba despues
        const touchingDown = this.player.body.touching.down;
        let touchingDanger = this.physics.overlap(this.player, this.enemies);
        let touchingMortal = false;
        this.physics.overlap(this.player, this.spikes, (player, spike) => {
            touchingDanger = true;
            if (spike.mortal) touchingMortal = true;            // pincho mortal del Infierno
        });
        if (this.lava && this.physics.overlap(this.player, this.lava)) touchingMortal = true; // la lava tambien es mortal
        this.physics.overlap(this.player, this.pieces, (player, piece) => this.collectPiece(piece));
        this.player.body.touching.down = touchingDown;
        if (touchingMortal) // Lo mortal mata de un golpe, aunque sea invencible
        {
            this.player.lives = 0;
        }
        else if (touchingDanger && !this.player.invencible)
        {
            this.player.lives -= 1; // Pierde una vida
            this.player.invencible = true; // El jugador se vuelve invencible temporalmente
        }
        if (this.player.lives <= 0) // Cuando el jugador se queda sin vidas pierde el nivel
        {
            this.scene.pause();
            this.scene.launch('LoseScene');
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
        
        //Tracking screenBorderOffset para que siga a camara
        if (this.screenBorder && this.screenBorder.visible) {
        const cam = this.cameras.main;
        const centerX = cam.scrollX + cam.width / 2;
        const centerY = cam.scrollY + cam.height / 2;

        this.screenBorder.setPosition(centerX, centerY);
        this.screenMask.setPosition(
        centerX + this.screenMaskOffset.x,
        centerY + this.screenMaskOffset.y
        );}
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
        this.uiSymbol.fill(piece.texture.key);
        piece.destroy();
        if (this.pieces.getLength() > 0) return;

        this.portalSymbol.complete();
        
        this.tweens.add({
            targets: [this.portalSymbol, this.portal, this.portalOpen],
            y: '-=20',
            // y: {from: 100, to: 140},
            duration: 2000, //2 segundos
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat:-1,
        });

        this.uiSymbol.complete();
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
    timeevaluate(seconds)
    {
        // El resultado de this.timeonlevel se
        // redondea para evitar decimales.
        const str1 = Math.floor(seconds/60);
        const str2 = Math.floor(seconds%60);
        if (str1 < 10 && str2 < 10) return "0" + str1 + ":0" + str2;
        else if (str1 < 10) return "0" + str1 + ":" + str2;
        else if (str2 < 10) return str1 + ":0" + str2;
        else return str1 + ":" + str2;
    }

    createSlowAttackEffect(ancho, alto){
        this.screenBorder = this.add.image(ancho/2, alto/2, 'fondo2')
        .setDisplaySize(ancho, alto)
        .setDepth(1)
        .setVisible(false);

        //Creacion mascara y aplicacion
        this.screenMask = this.add.image(ancho/2,alto/2,'invmask3')
        .setDisplaySize(ancho*SCALE, alto*SCALE)
        .setVisible(false);

        this.maskScaleX = this.screenMask.scaleX;
        this.maskScaleY = this.screenMask.scaleY;

        this.screenBorder.enableFilters();
        this.screenBorder.filters.external.addMask(this.screenMask);
        this.screenMaskOffset = {x: 0, y:0};
    }

    startScreenSlowEffect(){
        if(this.screenTweenSlow && this.screenTweenSlow.isPlaying()) return;

        this.screenBorder.setVisible(true);
        //Palpitacion
        const pasoLatido = (porcentaje, duracion, suavizado) => ({
            scaleX: this.maskScaleX * porcentaje,
            scaleY: this.maskScaleY * porcentaje,
            duration: duracion,
            ease: suavizado
        });

        this.screenTweenSlow = this.tweens.chain({
            targets: this.screenMask,
            repeat: -1,
            tweens: [
                pasoLatido(0.82, 180, 'Quad.easeOut'), // Primer latido
                pasoLatido(0.94, 210, 'Quad.easeIn'),  // Se abre un poco
                pasoLatido(0.86, 150, 'Quad.easeOut'), // Segundo latido
                pasoLatido(1.00, 450, 'Sine.easeOut')  // Vuelve a su tamaño normal y descansa
            ]
        });
    }

    stopScreenSlowEffect(){
        if(this.screenTweenSlow){
            this.screenTweenSlow.stop();
            this.screenTweenSlow = null;
        }
        this.screenBorder.setVisible(false);
        this.screenMask.setScale(this.maskScaleX, this.maskScaleY); //Reinciar escala o sino cada vez que ejecutemos posibildad de que empiece con una escala distinta    
    }
}
