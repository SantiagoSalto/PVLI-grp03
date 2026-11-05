export default class ArrowCursor extends Phaser.GameObjects.Sprite {

    constructor(scene, player) {
        super(scene, 0, 0, 'arrow');

        this.player = player;
        this.mouse = player.mouse;
        this.gameInput = scene.game.input;                     // al salir del nivel this.scene ya no existe
        this.insideGame = true;                                // false si el raton sale del juego
        this.jumpColor = 0xff3030;                             // color al saltar (al andar y correr se queda amarilla)

        scene.add.existing(this);                              // agregar imagen

        this.setOrigin(1, 0.5);                                // la punta marca la posicion del raton
        this.setDisplaySize(36, 36);                           // tamaño en pantalla
        this.setScrollFactor(0);                               // va con la pantalla, no con el mundo
        this.setDepth(200);                                    // por encima de todo

        scene.input.on('gameout', () => { this.insideGame = false; });
        scene.input.on('gameover', () => { this.insideGame = true; });

        // en los menus de pausa, victoria y derrota vuelve el raton normal
        const onPause = () => this.showMouse();
        const onResume = () => this.hideMouse();
        scene.events.on('pause', onPause);
        scene.events.on('resume', onResume);

        // al salir del nivel se quitan, si no se acumularian al reiniciarlo
        scene.events.once('shutdown', () => {
            scene.events.off('pause', onPause);
            scene.events.off('resume', onResume);
            this.gameInput.setDefaultCursor('default');
        });

        this.hideMouse();
    }

    // la flecha hace de puntero
    hideMouse() {
        this.gameInput.setDefaultCursor('none');
        this.setVisible(true);
    }

    // vuelve el raton normal y se quita la flecha
    showMouse() {
        this.gameInput.setDefaultCursor('default');
        this.setVisible(false);
    }

    update() {
        const pointer = this.mouse.pointer;

        // encima de un boton se usa el raton normal
        if (this.scene.input.hitTestPointer(pointer).length > 0) {
            this.showMouse();
            return;
        }

        this.hideMouse();

        // fuera del juego no hace falta, y al apuntar ya se ve la parabola
        if (!this.insideGame || this.mouse.isRightDown()) {
            this.setVisible(false);
            return;
        }

        this.setPosition(pointer.x, pointer.y);

        const distanceX = this.mouse.getX() - this.player.x;
        const distanceY = this.mouse.getY() - this.player.y;

        // por encima de la cabeza salta: apunta hacia el cursor
        // a la altura de la ardilla anda: apunta a izquierda o derecha
        if (this.mouse.getY() < this.player.body.top) this.setRotation(Math.atan2(distanceY, distanceX));
        else if (distanceX < 0) this.setRotation(Math.PI);
        else this.setRotation(0);

        // cambia de color si al hacer clic va a saltar (en el aire no se puede)
        if (this.mouse.getY() < this.player.body.top && this.player.isGrounded()) this.setTint(this.jumpColor);
        else this.clearTint();

        // encima de la ardilla no se mueve: flecha casi transparente
        const stopped = this.mouse.getY() >= this.player.body.top && Math.abs(distanceX) <= this.player.stopDistance;
        if (stopped) this.setAlpha(0.4);
        else this.setAlpha(1);
    }
}
