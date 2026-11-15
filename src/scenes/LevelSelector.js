export default class LevelSelector extends Phaser.Scene{

constructor() {
    super({ key: 'LevelSelector' }); 
}

create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.background = this.add.image(width/2, height/2, 'background4');
        this.background.setScale(1.9);

        // Copia del fondo a la derecha (volteada para que el borde encaje)
        this.background2 = this.add.image(width + width/2, height/2, 'background4');
        this.background2.setScale(1.9);
        this.background2.setFlipX(true);

        // Camara scroll
        //el mapa mide 2 pantallas de ancho
        this.cameras.main.setBounds(0, 0, width * 2, height);

        this.edgeMargin = 240;       //px desde el borde donde empieza a contar
        this.edgeDelay = 300;       //ms que hay que estar en el borde antes de moverse
        this.scrollSpeed = 600;   //px por segundo
        this.edgeTime = 0;

        //boton nivel1: 
        var iconLevel = this.add.image(width/2-372, height/2-80, 'iconLevel'); 
        iconLevel.setScale(0.5);
        iconLevel.setInteractive();
        iconLevel.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 1 });
        });

        //boton nivel2:
        var iconLevel2 = this.add.image(width/2-186, height/2+80, 'iconLevel'); 
        iconLevel2.setScale(0.5);
        iconLevel2.setInteractive();
        iconLevel2.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 2 });
        });

        //boton nivel3:
        var iconLevel3 = this.add.image(width/2, height/2-80, 'iconLevel');
        iconLevel3.setScale(0.5);
        iconLevel3.setInteractive();
        iconLevel3.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 3 });
        });

        //boton nivel4:
        var iconLevel4 = this.add.image(width/2+186, height/2+80, 'iconLevel');
        iconLevel4.setScale(0.5);
        iconLevel4.setInteractive();
        iconLevel4.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 4 });
        });

        //boton nivel5:
        var iconLevel5 = this.add.image(width/2+372, height/2-80, 'iconLevel');
        iconLevel5.setScale(0.5);
        iconLevel5.setInteractive();
        iconLevel5.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 5 });
        });

        // Niveles jugables
        var iconLevel6 = this.add.image(width + width/2-372, height/2-80, 'iconLevel');
        iconLevel6.setScale(0.5);
        iconLevel6.setInteractive();
        iconLevel6.on('pointerdown', () =>{
            this.scene.launch('LevelInfo', { level: 6 });
        });

        var iconLevel7 = this.add.image(width + width/2-186, height/2+80, 'iconLevel');
        iconLevel7.setScale(0.5);
        iconLevel7.setInteractive();
        iconLevel7.on('pointerdown', () =>{
            this.scene.launch('LevelInfo', { level: 7 });
        });

        var iconLevel8 = this.add.image(width + width/2, height/2-80, 'iconLevel');
        iconLevel8.setScale(0.5);
        iconLevel8.setInteractive();
        iconLevel8.on('pointerdown', () =>{
            this.scene.launch('LevelInfo', { level: 8 });
        });

        var iconLevel9 = this.add.image(width + width/2+186, height/2+80, 'iconLevel');
        iconLevel9.setScale(0.5);
        iconLevel9.setInteractive();
        iconLevel9.on('pointerdown', () =>{
            this.scene.launch('LevelInfo', { level: 9 });
        });

        var iconLevel10 = this.add.image(width + width/2+372, height/2-80, 'iconLevel');
        iconLevel10.setScale(0.5);


        //Boton retorno
        var exit = this.add.image(width-50, 50, 'exit');
        exit.setScrollFactor(0); //se queda fijo en pantalla aunque se mueva la camara
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene');
        });
    }

    update(time, delta) {
        //si esta abierta la ventana de info del nivel, no se mueve la camara
        if (this.scene.isActive('LevelInfo')) {
            this.edgeTime = 0;
            return;
        }

        const pointer = this.input.activePointer;
        const width = this.cameras.main.width;

        //-1 izquierda, 1 derecha, 0 nada
        let direction = 0;
        if (pointer.x < this.edgeMargin) {
            direction = -1;
        }
        else if (pointer.x > width - this.edgeMargin) {
            direction = 1;
        }

        if (direction != 0) {
            this.edgeTime += delta;
            //solo se mueve si lleva un rato en el borde
            if (this.edgeTime > this.edgeDelay) {
                //setBounds ya impide que se salga del mapa
                this.cameras.main.scrollX += direction * this.scrollSpeed * delta / 1000;
            }
        }
        else {
            this.edgeTime = 0;
        }
    }

};