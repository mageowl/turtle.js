import util from "./util.js";
const { range } = util;

function randomAccessCode() {
	let alphabet = "abcdefghijklmnopqurstuvwxyz".split("");
	let code = "";
	for (const i of range(4)) code += alphabet[Math.floor(Math.random() * 26)];
	return code;
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

	/**
	 * Move turtle forward in current direction.
	 *
	 * @param {number} distance How far to move (in pixels)
	 * @memberof Turtle
	 */
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

	/**
	 * Move turtle forward in current direction.
	 *
	 * @param {number} distance How far to move (in pixels)
	 * @memberof Turtle
	 */
	backward(distance) {
		this.forward(-distance);
	}

	/**
	 * Turns turtle right.
	 *
	 * @param {number} degrees How far to turn (in degrees)
	 * @memberof Turtle
	 */
	right(degrees) {
		this.#direction -= degrees * (Math.PI / 180);
	}

	/**
	 * Turns turtle left.
	 *
	 * @param {number} degrees How far to turn (in degrees)
	 * @memberof Turtle
	 */
	left(degrees) {
		this.#direction += degrees * (Math.PI / 180);
	}

	/**
	 * Move turtle to specified position.
	 *
	 * @param {number} x X position
	 * @param {number} y Y position
	 * @memberof Turtle
	 */
	goto(x, y) {
		if (this.#pen != "up") {
			this.#path.lineTo(x, y);
		} else {
			this.#path.moveTo(x, y);
		}

		this.#x = x;
		this.#y = y;
	}

	/**
	 * Set pen size.
	 *
	 * @param {number} size Pen size (in pixels)
	 * @memberof Turtle
	 */
	penSize(size) {
		this.#penSize = size;
	}

	/**
	 * X postion of turtle
	 *
	 * @readonly
	 * @memberof Turtle
	 */
	get x() {
		return this.#x;
	}

	/**
	 * Y postion of turtle
	 *
	 * @readonly
	 * @memberof Turtle
	 */
	get y() {
		return this.#y;
	}

	get canvas() {
		return this.#privateData.canvas;
	}

	/**
	 * Set colors of turtle
	 *
	 * @param {string} [stroke="black"] Stroke color
	 * @param {string} [fill="transparent"] Fill color
	 * @memberof Turtle
	 */
	color(stroke = "black", fill = "transparent") {
		this.#fillColor = fill;
		this.#strokeColor = stroke;
	}

	/**
	 * Starts stroked path.
	 *
	 * @memberof Turtle
	 */
	beginStroke() {
		this.#pen = "stroke";
	}

	/**
	 * Starts filled path.
	 *
	 * @memberof Turtle
	 */
	beginFill() {
		this.#pen = "fill";
	}

	/**
	 * End path.
	 *
	 * @memberof Turtle
	 */
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

	/**
	 * Moves turtle to origin and resets direction.
	 *
	 * @memberof Turtle
	 */
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
