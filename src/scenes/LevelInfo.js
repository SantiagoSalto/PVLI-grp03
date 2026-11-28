import TimersScoreManager from '../managers/TimersScoreManager.js';

export default class LevelInfo extends Phaser.Scene {

    constructor(){
        super({ key: 'LevelInfo'});
    }

    init(data) {
        this.level = data.level;   //nivel elegido en LevelSelector
    }

    create(){
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.timescoreManager = new TimersScoreManager(this);

        if (!localStorage.getItem('recordpuntos')) localStorage.setItem('recordpuntos', JSON.stringify(this.timescoreManager.mejorpuntos))
        if (!localStorage.getItem('recordtiempo')) localStorage.setItem('recordtiempo', JSON.stringify(this.timescoreManager.mejortiempo))

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
        
        const mejorpuntos = JSON.parse(localStorage.getItem('recordpuntos'));
        const mejortiempo = JSON.parse(localStorage.getItem('recordtiempo')); 
 

        let nostar = this.add.image(estrellaX, estrellaY, 'nostar');
        nostar.setScale(1.2)

        let puntuacion = this.add.text(estrellaX,estrellaY, this.getStarScore(this.level, 1),estiloPuntuacion);
        puntuacion.setOrigin(0.5);

        if (this.checkStar(this.level, 1, mejorpuntos[this.level-1])) nostar.setTexture('star');


        let nostar1 = this.add.image(estrellaX+ 100, estrellaY, 'nostar');
        nostar1.setScale(1.2)
        let puntuacion1 = this.add.text(estrellaX + 100,estrellaY, this.getStarScore(this.level, 2), estiloPuntuacion);
        puntuacion1.setOrigin(0.5);

        if (this.checkStar(this.level, 2, mejorpuntos[this.level-1])) nostar1.setTexture('star');


        let nostar2 = this.add.image(estrellaX + 200, estrellaY, 'nostar');
        nostar2.setScale(1.2)
        let puntuacion2 = this.add.text(estrellaX + 200,estrellaY, this.getStarScore(this.level, 3), estiloPuntuacion);
        puntuacion2.setOrigin(0.5);

        if (this.checkStar(this.level, 3, mejorpuntos[this.level-1])) nostar2.setTexture('star');


        //-----------------TEXTOS PUNTUACION Y TIEMPO--------------
        //cogemos la poscion donde esta el bloque y le restamos la mitad de su ancho = BORDE IZQUIERDO BLOQUE AZUL
        //  + un margen
        const margenIzquierdo = this.background.x - (this.background.displayWidth/2) + 100;
        const puntuacionY = alto/2 -15;
        const tiempoY = alto/2 + 20;
        const margenX = this.background.x + this.background.displayWidth/2;


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
        this.valorBestScore = this.add.text(margenIzquierdo + bestScore.displayWidth + 10, puntuacionY, mejorpuntos[this.level - 1], estiloPuntos);

        // Mejor tiempo
        let bestTime = this.add.text(margenIzquierdo, tiempoY, "Mejor tiempo: ", estiloTitulos);

        this.valorBestTime = this.add.text(margenIzquierdo + bestTime.displayWidth + 10, tiempoY, this.timeevaluate(mejortiempo[this.level-1]), estiloPuntos);

        let TimeObjective = this.add.text(margenIzquierdo - 20, tiempoY - 70, "Tiempo objetivo: ", estiloTitulos);

        this.valorTimeObjective = this.add.text(margenIzquierdo + bestTime.displayWidth + 20, tiempoY - 70, this.timeevaluate(this.objectivetime()), estiloPuntos);

        //--------------------BOTONES JUGAR Y SALIR--------------
        //Boton play
        var play = this.add.image(ancho/2, alto/1.5, 'play');
        play.setScale(0.5);
        play.setInteractive();
        play.on('pointerdown', () => {
            this.scene.stop('LevelSelector'); //Paramos escena padre
            this.scene.stop(); //Paramos escena pop-up
            this.scene.start("PlayScene", { level: this.level }); //Iniciamos nivel
        });

        
        //Boton exit
        var exit = this.add.image(margenX, 120, 'exit_button');
        exit.setScale(1.5);
        exit.setInteractive();

        exit.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('LevelSelector'); 
        });

        // USADA. DÉJARE ESTO AQUÍ POR SI ACASO
        //Funcion a futuro:
        // mostrarResultado(nuevaPuntuacion, nuevoTiempo){
        // if (nuevaPuntuacion > bestScore) this.bestScore.setText(nuevaPuntuacion);
        // if (nuevoTiempo > bestTime) this.bestTime.setText(nuevoTiempo);

        //Si puntuacion > valor estrella 1 
        //nostar.setTexture('star');
        // };
        
    }
    timeevaluate(seconds)
    {
        var str1 = Math.floor(seconds/60);
        var str2 = Math.floor(seconds%60);
        var str3 = Math.floor((seconds*1000)%1000);

        if (str1 < 10 && str2 < 10) return "0" + str1 + ":0" + str2 + "," + str3;
        else if (str1 < 10) return "0" + str1 + ":" + str2 + "," + str3;
        else if (str2 < 10) return str1 + ":0" + str2 + "," + str3;
        else return str1 + ":" + str2 + "," + str3;
    }
    objectivetime()
    {
        return this.timescoreManager.objetivo[this.level - 1];
    }
    checkStar(level, star, puntos)
    {
        return puntos >= this.timescoreManager.estrellas[level-1][star-1];
    }
    getStarScore(level, star)
    {
        return this.timescoreManager.estrellas[level-1][star-1];
    }
};