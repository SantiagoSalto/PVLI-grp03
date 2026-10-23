export default class LevelInfo extends Phaser.Scene {

    constructor(){
        super({ key: 'LevelInfo'});
    }


    create(){
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        //-------------RECTANGULO NEGRO OPACO FONDO------------
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena

        //---------BLOQUE AZUL MENU----------
        this.background = this.add.image(ancho/2, alto/2, 'blueSquare');
        this.background.setScale(3);

        //---------ESTRELLAS---------      
        //Hecho sin contenedores
        const estrellaX = ancho/2 -100;
        const estrellaY = alto/3.5; 

        const estiloPuntuacion = {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000000ff',
            fontStyle: 'bold'
        };

        let nostar = this.add.image(estrellaX, estrellaY, 'nostar');
        nostar.setScale(1.2)

        let puntuacion = this.add.text(estrellaX,estrellaY, '500',estiloPuntuacion);
        puntuacion.setOrigin(0.5);


        let nostar1 = this.add.image(estrellaX+ 100, estrellaY, 'nostar');
        nostar1.setScale(1.2)
        let puntuacion1 = this.add.text(estrellaX + 100,estrellaY, '1500', estiloPuntuacion);
        puntuacion1.setOrigin(0.5);


        let nostar2 = this.add.image(estrellaX + 200, estrellaY, 'nostar');
        nostar2.setScale(1.2)
        let puntuacion2 = this.add.text(estrellaX + 200,estrellaY, '2500', estiloPuntuacion);
        puntuacion2.setOrigin(0.5);

        //-----------------TEXTOS PUNTUACION Y TIEMPO--------------
        //cogemos la poscion donde esta el bloque y le restamos la mitad de su ancho = BORDE IZQUIERDO BLOQUE AZUL
        //  + un margen
        const margenIzquierdo = this.background.x - (this.background.displayWidth/2) + 100;
        const puntuacionY = alto/2 -15;
        const tiempoY = alto/2 + 20;

        const estiloTitulos = {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffffff',
            fontStyle: 'bold'
        };

        const estiloPuntos = {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#eaff02f1',
            fontStyle: 'bold'

        };
        // Mejor Puntuacion
        let bestScore =  this.add.text(margenIzquierdo, puntuacionY, "Mejor puntuación: ", estiloTitulos);

        // El texto dinámico empieza donde termina la etiqueta (usando su ancho 'displayWidth') más un pequeño espacio
        this.valorBestScore = this.add.text(margenIzquierdo + bestScore.displayWidth + 10, puntuacionY, "0", estiloPuntos);

        // Mejor tiempo
        let bestTime = this.add.text(margenIzquierdo, tiempoY, "Mejor tiempo: ", estiloTitulos);

        this.valorBestTime = this.add.text(margenIzquierdo + bestTime.displayWidth + 10, tiempoY, "00:00", estiloPuntos);

        //--------------------BOTONES JUGAR Y SALIR--------------
        //Boton play
        var play = this.add.image(ancho/2, alto/1.5, 'play');
        play.setScale(0.5);
        play.setInteractive();
        play.on('pointerdown', () => {
            this.scene.stop('LevelSelector'); //Paramos escena padre
            this.scene.stop(); //Paramos escena pop-up
            this.scene.start("PlayScene"); //Iniciamos nivel
        });

        
        //Boton exit
        var exit = this.add.image(580, 120, 'exit_button');
        exit.setScale(1.5);
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('LevelSelector'); 
        });

        //Funcion a futuro:
        // mostrarResultado(nuevaPuntuacion, nuevoTiempo){
        // if (nuevaPuntuacion > bestScore) this.bestScore.setText(nuevaPuntuacion);
        // if (nuevoTiempo > bestTime) this.bestTime.setText(nuevoTiempo);

        //Si puntuacion > valor estrella 1 
        nostar.setTexture('star');
        // };
        
    }
};