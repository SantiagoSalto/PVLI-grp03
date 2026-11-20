export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' }); 
    }

    preload() {
        //Fondos de Pantalla
        this.load.image('background1', './assets/Mapa/space.png');
        this.load.image('background2', './assets/Mapa/village.png');
        this.load.image('background3', './assets/Mapa/boreal.png');
        this.load.image('background4', './assets/Mapa/islandfirst.png');
        this.load.image('background5', './assets/Mapa/asia.jpg');
        this.load.image('background6', './assets/Mapa/hell.png');

        //Provisionales
        this.load.image('play', './assets/Menu/playProvisional.png');
        this.load.image('lose', './assets/Menu/lose.png');
        //Jugador
        this.load.image('squirrel', './assets/Personajes/squirrel.png');
        //Enemigo
        this.load.image('enemy', './assets/Personajes/parrot.png');
        //Plataforma
        this.load.image('platform1', './assets/Suelos/hierba-1.png');

        //OBJETOS INTERACTUABLES

        //Caja
        this.load.image('box', './assets/Objetos/Box.png');
        //Pincho
        this.load.image('trap', './assets/Objetos/trap.png');
        //Meta
        this.load.image('portal', './assets/Objetos/portal.png');
        //Flecha del cursor
        this.load.image('arrow', './assets/Objetos/arrow.png');
        this.load.image('arrowblank', './assets/Objetos/arrowblank.png');
        //Diana
        this.load.image('target', './assets/Objetos/target.png');
        //Trazos de las letras
        this.load.image('person1', './assets/Objetos/Simbolos/person1.png');
        this.load.image('person2', './assets/Objetos/Simbolos/person2.png');
        this.load.image('earth1', './assets/Objetos/Simbolos/earth1.png');
        this.load.image('earth2', './assets/Objetos/Simbolos/earth2.png');
        this.load.image('earth3', './assets/Objetos/Simbolos/earth3.png');
        this.load.image('wood1', './assets/Objetos/Simbolos/wood1.png');
        this.load.image('wood2', './assets/Objetos/Simbolos/wood2.png');
        this.load.image('wood3', './assets/Objetos/Simbolos/wood3.png');
        this.load.image('wood4', './assets/Objetos/Simbolos/wood4.png');
        this.load.image('water1', './assets/Objetos/Simbolos/water1.png');
        this.load.image('water2', './assets/Objetos/Simbolos/water2.png');
        this.load.image('water3', './assets/Objetos/Simbolos/water3.png');
        this.load.image('water4', './assets/Objetos/Simbolos/water4.png');
        this.load.image('fire1', './assets/Objetos/Simbolos/fire1.png');
        this.load.image('fire2', './assets/Objetos/Simbolos/fire2.png');
        this.load.image('fire3', './assets/Objetos/Simbolos/fire3.png');
        this.load.image('fire4', './assets/Objetos/Simbolos/fire4.png');
        this.load.image('metal1', './assets/Objetos/Simbolos/metal1.png');
        this.load.image('metal2', './assets/Objetos/Simbolos/metal2.png');
        this.load.image('metal3', './assets/Objetos/Simbolos/metal3.png');
        this.load.image('metal4', './assets/Objetos/Simbolos/metal4.png');
        this.load.image('metal5', './assets/Objetos/Simbolos/metal5.png');
        this.load.image('metal6', './assets/Objetos/Simbolos/metal6.png');
        this.load.image('metal7', './assets/Objetos/Simbolos/metal7.png');
        this.load.image('metal8', './assets/Objetos/Simbolos/metal8.png');
        this.load.image('trident1', './assets/Objetos/Simbolos/trident1.png');
        this.load.image('trident2', './assets/Objetos/Simbolos/trident2.png');
        this.load.image('trident3', './assets/Objetos/Simbolos/trident3.png');
        this.load.image('trident4', './assets/Objetos/Simbolos/trident4.png');
        this.load.image('cross1', './assets/Objetos/Simbolos/cross1.png');
        this.load.image('cross2', './assets/Objetos/Simbolos/cross2.png');
        this.load.image('cross3', './assets/Objetos/Simbolos/cross3.png');
        this.load.image('leviathan1', './assets/Objetos/Simbolos/leviathan1.png');
        this.load.image('leviathan2', './assets/Objetos/Simbolos/leviathan2.png');
        this.load.image('leviathan3', './assets/Objetos/Simbolos/leviathan3.png');
        this.load.image('leviathan4', './assets/Objetos/Simbolos/leviathan4.png');
        this.load.image('pentagram1', './assets/Objetos/Simbolos/pentagram1.png');
        this.load.image('pentagram2', './assets/Objetos/Simbolos/pentagram2.png');
        this.load.image('pentagram3', './assets/Objetos/Simbolos/pentagram3.png');
        this.load.image('pentagram4', './assets/Objetos/Simbolos/pentagram4.png');
        this.load.image('pentagram5', './assets/Objetos/Simbolos/pentagram5.png');
        this.load.image('pentacle1', './assets/Objetos/Simbolos/pentacle1.png');
        this.load.image('pentacle2', './assets/Objetos/Simbolos/pentacle2.png');
        this.load.image('pentacle3', './assets/Objetos/Simbolos/pentacle3.png');
        this.load.image('pentacle4', './assets/Objetos/Simbolos/pentacle4.png');
        this.load.image('pentacle5', './assets/Objetos/Simbolos/pentacle5.png');
        this.load.image('pentacle6', './assets/Objetos/Simbolos/pentacle6.png');
        //Tiled
        this.load.image('tilesGrass1', './assets/Tiled/Pipoya RPG Tileset 32x32/Pipoya RPG Tileset 32x32/[A]_type1/[A]Grass1_pipo.png');
        this.load.tilemapTiledJSON('level1', './assets/Niveles_Tiled/nivel1.json');
        this.load.image('tilesDirt1', './assets/Tiled/Pipoya RPG Tileset 32x32/Pipoya RPG Tileset 32x32/[A]_type1/[A]Dirt2_pipo.png');
        this.load.tilemapTiledJSON('level2', './assets/Niveles_Tiled/nivel2.json');
        this.load.tilemapTiledJSON('level3', './assets/Niveles_Tiled/nivel3.json');
        this.load.tilemapTiledJSON('level4', './assets/Niveles_Tiled/nivel4.json');
        this.load.tilemapTiledJSON('level5', './assets/Niveles_Tiled/nivel5.json');
        this.load.tilemapTiledJSON('level6', './assets/Niveles_Tiled/nivel6.json');
        this.load.tilemapTiledJSON('level7', './assets/Niveles_Tiled/nivel7.json');
        this.load.tilemapTiledJSON('level8', './assets/Niveles_Tiled/nivel8.json');
        this.load.tilemapTiledJSON('level9', './assets/Niveles_Tiled/nivel9.json');
        this.load.tilemapTiledJSON('level10', './assets/Niveles_Tiled/nivel10.json');
        this.load.tilemapTiledJSON('level11', './assets/Niveles_Tiled/nivel11.json');
        this.load.tilemapTiledJSON('level12', './assets/Niveles_Tiled/nivel12.json');
        this.load.tilemapTiledJSON('level13', './assets/Niveles_Tiled/nivel13.json');
        this.load.tilemapTiledJSON('level14', './assets/Niveles_Tiled/nivel14.json');
        this.load.tilemapTiledJSON('level15', './assets/Niveles_Tiled/nivel15.json');

        //Iconos
        this.load.image('ajustes', './assets/Menu/gear.png');
        this.load.image('greenSquare', './assets/Menu/ajustesSquare.png');
        this.load.image('exit', './assets/Menu/exitLeft.png');
        this.load.image('exit_button', './assets/Menu/x_button.png');
        this.load.image('credits', './assets/Menu/credits.png');
        this.load.image('button', './assets/Menu/button.png');
        this.load.image('iconLevel', './assets/Menu/iconLevel.png');
        this.load.image('pausa', './assets/Menu/pause.png');
        this.load.image('life', './assets/Menu/Heart.png');

        //Info PreNivel
        this.load.image('blueSquare', './assets/Menu/levelSquare.png');
        this.load.image('star', './assets/Menu/star.png');
        this.load.image('nostar', './assets/Menu/star_outline.png');
        //Win scene
        this.load.image('bluebutton', './assets/Menu/button3.png')
        this.load.image('win', './assets/Menu/win.png');

        //Lose Scene
        this.load.image('redSquare', './assets/Menu/loseSquare.png');
        this.load.image('redbutton', './assets/Menu/button2.png')
        this.load.image('death', './assets/Menu/death.png');

        //Ajustes barras
        this.load.image('barra', './assets/Menu/barra.png');
        this.load.image('pinkBar', './assets/Menu/settingsbar.png');
        this.load.image('blueBar', './assets/Menu/settingsbar2.png')
        //Credits
        this.load.image('border', './assets/Menu/border.png');
        this.load.image('yellowSquare', './assets/Menu/creditsSquare.png')
        
        this.load.image('projectile', './assets/Personajes/projectile.png')
    }

    create() {
        this.scene.stop();          
        this.scene.start('MainMenuScene'); 
        
    }
}