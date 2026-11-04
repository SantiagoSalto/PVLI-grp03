export default class InputManager {

    constructor(scene) {
        this.pointer = scene.input.activePointer;        // raton
        this.camera = scene.cameras.main;                // camara (para pasar el raton a coordenadas del mundo)
        this.leftDown = false;                           // clic izquierdo valido para el player
        this.rightDown = false;                          // clic derecho valido para el player

        // el clic es valido solo si empieza en esta escena y no encima de un boton
        scene.input.on('pointerdown', (pointer, currentlyOver) => {
            if (pointer.button === 0) this.leftDown = currentlyOver.length === 0;  // No hay nada interactivo debajo del cursor
            if (pointer.button === 2) this.rightDown = currentlyOver.length === 0;
        });
    }

    isLeftDown() {
        // ademas del clic valido, el boton tiene que seguir pulsado
        return this.leftDown && this.pointer.leftButtonDown();
    }

    isRightDown() {
        // ademas del clic valido, el boton tiene que seguir pulsado
        return this.rightDown && this.pointer.rightButtonDown();
    }

    // posicion del raton en el mundo (pantalla + desplazamiento de la camara)
    getX() {
        return this.pointer.x + this.camera.scrollX;
    }

    getY() {
        return this.pointer.y + this.camera.scrollY;
    }
}
