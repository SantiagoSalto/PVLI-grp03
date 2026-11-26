import TimersScoreManager from '../managers/TimersScoreManager.js';

export default class WinScene extends Phaser.Scene{

constructor() {
    super({ key: 'WinScene' }); 
}

    create(){
        const ancho = this.cameras.main.width;
        const alto = this.cameras.main.height;

        this.timescoreManager = new TimersScoreManager(this);

        //Creamos manualmente rectangulo negro que ocupe toda la pantalla
        let overlay = this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000);
        overlay.setAlpha(0.6); // 60% de opacidad. Oscurece Main Menu
        overlay.setInteractive(); //Bloquea Clicks a botones fuera de la escena

        this.background = this.add.image(ancho/2, alto/2, 'blueSquare');
        this.background.setScale(3);
        
        //Boton continuar ->level selector
        var resume = this.add.image(ancho/2, alto/2 + 50, 'bluebutton');
        resume.setScale(0.5);
        resume.setInteractive();

        //texto
        var resetTexto = this.add.text(ancho/2, alto/2 + 50, 'CONTINUE', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000ff',
            fontStyle: 'bold'
        });
        resetTexto.setOrigin(0.5);

        resume.on('pointerdown', () => {
            this.scene.stop('PlayScene');
            this.scene.stop();
            this.scene.start('LevelSelector'); 
        });

        //boton reset nivel 
        var reset = this.add.image(ancho/2, alto/2 + 120, 'bluebutton');
        reset.setScale(0.5);
        reset.setInteractive();


        const estrellaX = ancho/2 -100;
        const estrellaY = alto/3.5; 

        const estiloPuntuacion = {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000000ff',
            fontStyle: 'bold'
        };


        //texto
        var resetTexto = this.add.text(ancho/2, alto/2 + 120, 'RESET', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000ff',
            fontStyle: 'bold'
        });
        resetTexto.setOrigin(0.5);

        reset.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('PlayScene'); 
        });

        const playscene = this.scene.get('PlayScene');
        var puntos = 0;
        var completedpoints = 500;

        if (playscene.objectivetime() > playscene.leveltimer) 
        {
            var timepoints = (playscene.objectivetime()/playscene.leveltimer*1.5)**5 * 10;
            puntos += timepoints;
            var timepointstext = this.add.text(ancho/2,alto/2-30, "Tiempo tardado: +" + Math.floor(timepoints) + "pts", {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: 'rgb(26, 129, 0)',
                fontStyle: 'bold'
            });
        }
        else if (playscene.objectivetime() < playscene.leveltimer)
        {
            var timepenpoints = (playscene.objectivetime()/playscene.leveltimer)**2;
            completedpoints *= timepenpoints;
            var timepointstext = this.add.text(ancho/2,alto/2-30, "Tiempo tardado: x" + Phaser.Math.FloorTo(timepenpoints, -3, 10) + "pts", {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: 'rgb(177, 0, 0)',
                fontStyle: 'bold'
            });
        }

        puntos += completedpoints;

        //puntos += this.scene.timeonlevel;
        var puntostext = this.add.text(ancho/2,alto/2-70, "Puntos totales: " + Math.floor(puntos), {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: 'rgb(255, 255, 255)',
            fontStyle: 'bold'
        });
        var levelcompletedpointstext = this.add.text(ancho/2,alto/2-50, "Nivel completado: +" + Math.floor(completedpoints) + "pts", {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: 'rgb(26, 129, 0)',
            fontStyle: 'bold'
        });
        puntostext.setOrigin(0.5);
        levelcompletedpointstext.setOrigin(0.5);
        timepointstext.setOrigin(0.5);

        let nostar = this.add.image(estrellaX, estrellaY, 'nostar');
        nostar.setScale(1.2);
        
        if (this.checkStar(playscene.level, 1, puntos)) nostar.setTexture('star');

        let puntuacion = this.add.text(estrellaX,estrellaY, this.getStarScore(playscene.level, 1),estiloPuntuacion);
        puntuacion.setOrigin(0.5);

        let nostar1 = this.add.image(estrellaX + 100, estrellaY, 'nostar');
        nostar1.setScale(1.2)

        if (this.checkStar(playscene.level, 2, puntos)) nostar1.setTexture('star');

        let puntuacion1 = this.add.text(estrellaX + 100,estrellaY, this.getStarScore(playscene.level, 2), estiloPuntuacion);
        puntuacion1.setOrigin(0.5);

        let nostar2 = this.add.image(estrellaX + 200, estrellaY, 'nostar');
        nostar2.setScale(1.2)

        if (this.checkStar(playscene.level, 3, puntos)) nostar2.setTexture('star');


        let puntuacion2 = this.add.text(estrellaX + 200,estrellaY, this.getStarScore(playscene.level, 3), estiloPuntuacion);
        puntuacion2.setOrigin(0.5);

        this.checkRecords(puntos, playscene.leveltimer, playscene.level);
        
    }
    checkStar(level, star, puntos)
    {
        return puntos >= this.timescoreManager.estrellas[level-1][star-1];
    }
    getStarScore(level, star)
    {
        return this.timescoreManager.estrellas[level-1][star-1];
    }
    checkRecords(nuevaPuntuacion, nuevoTiempo, level)
    {
        if (this.registry.get('recordpuntos')) 
        { 
            const mejorpuntos = this.registry.get('recordpuntos');
            if (nuevaPuntuacion > mejorpuntos[level-1])
            {
                console.log("¡Nuevo récord de puntuación!");
                mejorpuntos[level-1] = Math.floor(nuevaPuntuacion);
                this.registry.set('recordpuntos', mejorpuntos);
            }
        }   
        else
        {
            console.log("¡Nuevo récord de puntuación!");
            this.timescoreManager.mejorpuntos[level-1] = Math.floor(nuevaPuntuacion);
            this.registry.set('recordpuntos', this.timescoreManager.mejorpuntos);
        }

        if (this.registry.get('recordtiempo'))
        {
            const mejortiempo = this.registry.get('recordtiempo');
            if (nuevoTiempo < mejortiempo[level-1] || mejortiempo[level-1] == 0)
            {
                console.log("¡Nuevo récord de tiempo!");
                mejortiempo[level-1] = nuevoTiempo;
                this.registry.set('recordtiempo', mejortiempo);
            }
        }
        else 
        {
            console.log("¡Nuevo récord de tiempo!");
            this.timescoreManager.mejortiempo[level-1] = nuevoTiempo;
            this.registry.set('recordtiempo', this.timescoreManager.mejortiempo);
        }

    }
};

