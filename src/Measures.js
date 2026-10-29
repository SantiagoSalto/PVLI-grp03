// Sistema de medidas del juego: 1 bloque = 1 tile de Tiled
// Todas las medidas del mundo se pueden pensar en bloques 

// Tamaño de un bloque en pixeles (debe coincidir con el tamaño de tile en Tiled)
export const BLOCK = 32;

// Tamaño de la pantalla 16:9
export const SCREEN_WIDTH = 1024;
export const SCREEN_HEIGHT = 576;

// Bloques a pixeles (esquina del bloque)
export function toPx(blocks) {
    return blocks * BLOCK;
}

// Pixeles a bloques (en que bloque esta una posicion)
export function toBlocks(px) {
    return Math.floor(px / BLOCK);
}

// Centro de un bloque en pixeles (util para sprites con origen centrado)
export function blockCenter(blocks) {
    return blocks * BLOCK + BLOCK / 2;
}
