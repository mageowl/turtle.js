export class TCanvas {
	#el;
	/**
	 * @type {CanvasRenderingContext}
	 */
	#ctx;

	#access = {
		canvas: null,
		ctx: null,
		style(fill, stroke, penSize) {
			this.ctx.fillStyle = fill;
			this.ctx.strokeStyle = stroke;
			this.ctx.lineWidth = penSize;
		}
	};

	constructor(id, { pixelate = true } = {}) {
		this.#el = document.getElementById(id);
		this.#ctx = this.#el.getContext("2d");
		this.#access.canvas = this;
		this.#access.ctx = this.#ctx;
		if (pixelate) {
			this.#el.style.imageRendering = "pixelated";
		}
	}

	_connectTurtle(turtle, accessCode) {
		turtle._setPrivate("canvas", this, accessCode);
		turtle._setPrivate("canvasAccess", this.#access, accessCode);
		turtle._closeAccessCode(accessCode);
	}
}
