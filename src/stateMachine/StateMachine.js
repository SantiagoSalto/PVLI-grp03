export default class StateMachine {

    constructor(context) {
        this.context = context;               // objeto dueno de la maquina
        this.states = new Map();              // mapa de estados registrados
        this.currentState = null;             // estado activo actual
    }

    addState(name, state) {
        this.states.set(name, state);         // guardar en el mapa
        return this;                          // permite encadenar llamadas
    }

    setState(name) {

        // salir del estado anterior
        if (this.currentState) {
            this.currentState.exit(this.context);
        }

        this.currentState = this.states.get(name); // actualizar estado activo

        // entrar en el nuevo estado
        this.currentState.enter(this.context);
    }

    step(time, delta) {
        this.currentState.execute(this.context, time, delta);
    }
}
