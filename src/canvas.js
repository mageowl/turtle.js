const _ = Symbol("_");

export class TCanvas {
	el = null;

	[_] = {
		ctx: null,
		pen(fill, stroke, size, cap, join) {
			this.ctx.fillStyle = fill;
			this.ctx.strokeStyle = stroke;
			this.ctx.lineWidth = size;
			this.ctx.lineCap = cap;
			this.ctx.lineJoin = join;
		}
	};

	constructor(id, { pixelate = true } = {}) {
		this.el = document.getElementById(id);
		this[_].ctx = this.el.getContext("2d");
		if (pixelate) {
			this.el.style.imageRendering = "pixelated";
		}
	}

	_connectTurtle(turtle, symbol) {
		turtle[symbol].canvas = this;
		turtle[symbol].canvasAccess = this[_];
	}

	clearScreen() {
		this[_].ctx.clearRect(0, 0, this.el.width, this.el.height);
	}
}
