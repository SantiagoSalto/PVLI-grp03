export default class LevelSelector extends Phaser.Scene{

constructor() {
    super({ key: 'LevelSelector' }); 
}

create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.background = this.add.image(ancho/2, alto/2, 'background4');
        this.background.setScale(1.9);

        //boton nivel1: 
        var iconLevel = this.add.image(ancho/4, alto/2, 'iconLevel'); 
        iconLevel.setScale(0.5);
        iconLevel.setInteractive();
        iconLevel.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 1 });
        });

        //boton nivel2:
        var iconLevel2 = this.add.image(ancho/4+200, alto/2-100, 'iconLevel'); 
        iconLevel2.setScale(0.5);
        iconLevel2.setInteractive();
        iconLevel2.on('pointerdown', () =>{
            //Clave para que se ejecuten las 2 escenas "al mismo tiempo"
            this.scene.launch('LevelInfo', { level: 2 });
        });




        //Boton retorno
        var exit = this.add.image(ancho-50, 50, 'exit');
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene'); 
        });
    }

};