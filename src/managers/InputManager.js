export default class InputManager {

    constructor(scene) {
        this.pointer = scene.input.activePointer;        // raton
        this.leftDown = false;                           // clic valido para el player

        // el clic es valido solo si empieza en esta escena y no encima de un boton
        scene.input.on('pointerdown', (pointer, currentlyOver) => {
            this.leftDown = currentlyOver.length === 0; // No hay nada interactivo debajo del cursor
        });
    }

    isLeftDown() {
        // ademas del clic valido, el boton tiene que seguir pulsado
        return this.leftDown && this.pointer.leftButtonDown();
    }

    getX() {
        return this.pointer.x;
    }

    getY() {
        return this.pointer.y;
    }
}
