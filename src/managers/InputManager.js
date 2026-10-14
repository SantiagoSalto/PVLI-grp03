export default class InputManager {

    constructor(scene) {
        this.pointer = scene.input.activePointer;        // raton
    }

    isLeftDown() {
        return this.pointer.leftButtonDown();
    }

    getX() {
        return this.pointer.x;
    }

    getY() {
        return this.pointer.y;
    }
}
