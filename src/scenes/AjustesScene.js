export default class AjustesScene extends Phaser.Scene{

constructor() {
    super({ key: 'AjustesScene' }); 
}

create() {
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //---------FONDO NEGRO OPACO---------
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena

        //-----------BLOQUE VERDE---------------
        this.background = this.add.image(ancho/2, alto/2, 'greenSquare');
        this.background.setScale(3);

        //-----------TEXTOS--------------
        const estiloTitulos = {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#000000ff',
            fontStyle: 'bold'
        };
        const margenIzquierdo = this.background.x - (this.background.displayWidth/2)+30;
        const sfxY = alto/3;
        const musicY = alto/3 + 100;
        const sensY = alto/3 + 200;

        let sfxTexto = this.add.text(margenIzquierdo, sfxY, "SFX:", estiloTitulos);
        let musicaTexto = this.add.text(margenIzquierdo, musicY, "MUSICA:", estiloTitulos);
        let sensTexto = this.add.text(margenIzquierdo, sensY, "SENS:", estiloTitulos);

        //----------------BARRAS-----------
        var bar1 = this.add.image(margenIzquierdo+175 , sfxY, 'barra');
        bar1.setScale(0.30)
        var bar2 = this.add.image(margenIzquierdo + 175, musicY, 'barra');
        bar2.setScale(0.30)
        var bar3 = this.add.image(margenIzquierdo + 175, sensY, 'barra');
        bar3.setScale(0.30)


        //------------VALORES---------------
        let sfxValor = this.add.text(margenIzquierdo+ 300, sfxY, "50'", estiloTitulos);
        let musicaValor = this.add.text(margenIzquierdo+300, musicY, "50", estiloTitulos);
        let sensValor = this.add.text(margenIzquierdo+300, sensY, "50", estiloTitulos);

        //------------BOLITAS INTERACTIVAS PARA CADA BARRA------------
        // Calculamos los límites izquierdos y derechos usando las barras ya creadas
        const minX = bar1.x - (bar1.displayWidth / 2);
        const maxX = bar1.x + (bar1.displayWidth / 2);
        const anchoBarra = bar1.displayWidth;

        // Círculo 1 (SFX) - Color Rosa Oscuro (0xd946ef)
        let bolita1 = this.add.circle(bar1.x, sfxY, 10, 0xEDF71E).setInteractive({ useHandCursor: true });
        this.input.setDraggable(bolita1);
        //El setData se trata de para leer valores necesarios, en este caso, de los limites y ancho de barra con 
        // el valor de que tendra cada ajuste. Esto se hace asi para que la variable pueda ser leida dentro de otra funcion
        //distinta en la que se crea: Solo estaria "disponible" en el metodo create()
        bolita1.setData({ minX: minX, maxX: maxX, anchoBarra: anchoBarra, textoValor: sfxValor });

        // Círculo 2 (MUSICA)
        let bolita2 = this.add.circle(bar2.x, musicY, 10, 0xEDF71E).setInteractive({ useHandCursor: true });
        this.input.setDraggable(bolita2);
        bolita2.setData({ minX: minX, maxX: maxX, anchoBarra: anchoBarra, textoValor: musicaValor });

        // Círculo 3 (SENS)
        let bolita3 = this.add.circle(bar3.x, sensY, 10, 0xEDF71E).setInteractive({ useHandCursor: true });
        this.input.setDraggable(bolita3);
        bolita3.setData({ minX: minX, maxX: maxX, anchoBarra: anchoBarra, textoValor: sensValor });


        //------------LOGICA ARRASTRE--------------
        //this.input.on(evento, funcionCallBack, contexto)
        //'drag' = Es un evento. Se activa constantemente mientras mantegamos presionado el click
        //Parametros de evento 'drag':
        // pointer = Phaser.Input.Pointer (raton o dedo tactil)
        // gameObject = Phaser.GameObjetcs.GameObject
        // dragX = number. posicion  x 
        // dragY = number. posicion y 
        this.input.on('drag', (pointer, gameObject, dragX) => {
            // Recuperamos los datos específicos que guardamos en la bolita que se está moviendo
            const limites = gameObject.getData('minX');
            const maximo = gameObject.getData('maxX');
            const totalAncho = gameObject.getData('anchoBarra');
            const texto = gameObject.getData('textoValor');

            // Restringimos el movimiento horizontal para que no se salga de la barra
            if (dragX < limites) dragX = limites;
            if (dragX > maximo) dragX = maximo;

            // Movemos la bolita en X, la Y se queda fija
            gameObject.x = dragX;

            // Calculamos el porcentaje recorrido y lo convertimos a un valor de 0 a 100
            const distancia = dragX - limites;
            const porcentaje = distancia / totalAncho;
            const valorFinal = Math.round(porcentaje * 100);

            // Actualizamos el texto correspondiente en tiempo real, transformando el valor numerico en texto
            texto.setText(valorFinal.toString());
        });

        //----------BOTON EXIT-------------
        var exit = this.add.image(580, 120, 'exit_button');
        exit.setScale(1.5);
        exit.setInteractive();

        

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene'); 
        });
    }

}