export function range(length, offset = 0) {
	return Array(length).map((i) => offset + i);
}

function randomAccessCode() {
	let alphabet = "abcdefghijklmnopqurstuvwxyz".split("");
	let code = "";
	for (const i of range(4)) code += alphabet[Math.floor(Math.random() * 26)];
	return code;
}

export class TCanvas {
	#el;
	/**
	 * @type {CanvasRenderingContext}
	 */
	#ctx;

	#access = {
		canvas: null,
		ctx: null,
		// style(style) {
		// 	this.ctx.strokeStyle = style.lineColor;
		// 	this.ctx.lineWidth = style.lineWidth;
		// 	this.ctx.lineCap = style.lineCap;
		// 	this.ctx.fillStyle = style.fillColor;
		// }
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

/**
 * Turtle API
 *
 * @export
 * @class Turtle
 */
export class Turtle {
	#x = 0;
	#y = 0;

	#direction = 0;
	#pen = "up";
	#fillColor = "black";
	#strokeColor = "black";
	#penSize = 1;

	#privateData = {
		/** @type {TCanvas} */
		canvas: null,
		canvasAccess: null
	};
	#activeAccessCodes = [];

	#path = new Path2D();

	#paths = [];

	/**
	 * @param {TCanvas} canvas Canvas object from which to draw on.
	 */
	constructor(canvas) {
		let accessCode = randomAccessCode();
		this.#activeAccessCodes.push(accessCode);
		canvas._connectTurtle(this, accessCode);
		this.#path.moveTo(0, 0);
	}

	forward(distance) {
		let x = this.#x + Math.sin(this.#direction + 1.5707963267948966) * distance;
		let y = this.#y + Math.cos(this.#direction + 1.5707963267948966) * distance;

		if (this.#pen != "up") {
			this.#path.lineTo(x, y);
		} else {
			this.#path.moveTo(x, y);
		}

		this.#x = x;
		this.#y = y;
	}

	backward(distance) {
		this.forward(-distance);
	}

	right(degrees) {
		this.#direction -= degrees * (Math.PI / 180);
	}

	left(degrees) {
		this.#direction += degrees * (Math.PI / 180);
	}

	goto(x, y) {
		if (this.#pen != "up") {
			this.#path.lineTo(x, y);
		} else {
			this.#path.moveTo(x, y);
		}

		this.#x = x;
		this.#y = y;
	}

	penSize(size) {
		this.#penSize = size;
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	get canvas() {
		return this.#privateData.canvas;
	}

	color(stroke, fill = "transparent") {
		this.#fillColor = fill;
		this.#strokeColor = stroke;
	}

	beginStroke() {
		this.#pen = "stroke";
	}

	beginFill() {
		this.#pen = "fill";
	}

	end() {
		this.#privateData.canvasAccess.style(
			this.#fillColor,
			this.#strokeColor,
			this.#penSize
		);
		if (this.#pen == "stroke")
			this.#privateData.canvasAccess.ctx.stroke(this.#path);
		else if (this.#pen == "fill") {
			this.#privateData.canvasAccess.ctx.fill(this.#path);
			this.#privateData.canvasAccess.ctx.stroke(this.#path);
		}

		this.#pen = "up";
		this.#paths.push(this.#path);
		this.#path = new Path2D();
	}

	home() {
		this.goto(0, 0);
		this.#direction = 0;
	}

	_setPrivate(name, value, accessCode) {
		if (this.#activeAccessCodes.includes(accessCode)) {
			this.#privateData[name] = value;
		}
	}

	_closeAccessCode(accessCode) {
		if (this.#activeAccessCodes.includes(accessCode)) {
			this.#activeAccessCodes.splice(
				this.#activeAccessCodes.indexOf(accessCode),
				1
			);
		}
	}
}
