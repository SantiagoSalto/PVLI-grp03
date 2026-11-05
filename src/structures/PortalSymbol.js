const EMPTY_COLOR = 0x555555;                                  // trazo que falta por recoger
const COMPLETE_COLOR = 0xffd23f;                               // letra completa

// Letra que se ve sobre el portal: un trazo encima de otro, que se rellenan al recoger cada pieza
export default class PortalSymbol {

	constructor(scene, x, y, size, strokes) {
		this.images = strokes.map((stroke) => {
			return scene.add.image(x, y, stroke).setDisplaySize(size, size).setTint(EMPTY_COLOR);
		});
	}

	// Rellena el trazo de la pieza recogida
	fill(stroke) {
		this.images.find((image) => image.texture.key === stroke).clearTint();
	}

	// Cambia de color toda la letra al completarla
	complete() {
		this.images.forEach((image) => image.setTint(COMPLETE_COLOR));
	}
}
