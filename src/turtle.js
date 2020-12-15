import util from "./util.js";
const { range } = util;

function randomAccessCode() {
	let alphabet = "abcdefghijklmnopqurstuvwxyz".split("");
	let code = "";
	for (const i of range(4)) code += alphabet[Math.floor(Math.random() * 26)];
	return code;
}

const _ = Symbol("_");

/**
 * Turtle API
 *
 * @export
 * @class Turtle
 */
export class Turtle {
	[_] = {
		x: 0,
		y: 0,

		direction: 0,
		pen: "none",
		strokeColor: "black",
		fillColor: "black",
		penSize: 1,
		penCap: "butt",
		penJoin: "milter",

		/** @type {TCanvas} */
		canvas: null,
		canvasAccess: null,

		path: new Path2D(),
		paths: []
	};

	/**
	 * @param {TCanvas} canvas Canvas object from which to draw on.
	 */
	constructor(canvas) {
		canvas._connectTurtle(this, _);
	}

	/**
	 * Move turtle forward in current direction.
	 *
	 * @param {number} distance How far to move (in pixels)
	 * @memberof Turtle
	 */
	forward(distance) {
		let x =
			this[_].x + Math.sin(this[_].direction + 1.5707963267948966) * distance;
		let y =
			this[_].y + Math.cos(this[_].direction + 1.5707963267948966) * distance;

		if (this[_].pen != "none") {
			this[_].path.lineTo(x, y);
		} else {
			this[_].path.moveTo(x, y);
		}

		this[_].x = x;
		this[_].y = y;
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
		this[_].direction -= (degrees % 360) * (Math.PI / 180);
	}

	/**
	 * Turns turtle left.
	 *
	 * @param {number} degrees How far to turn (in degrees)
	 * @memberof Turtle
	 */
	left(degrees) {
		this[_].direction += (degrees % 360) * (Math.PI / 180);
	}

	rotation(degrees) {
		this[_].direction = (degrees % 360) * (Math.PI / 180);
	}

	/**
	 * Move turtle to specified position.
	 *
	 * @param {number} x X position
	 * @param {number} y Y position
	 * @memberof Turtle
	 */
	goto(x, y) {
		if (this[_].pen != "none") {
			this[_].path.lineTo(x, y);
		} else {
			this[_].path.moveTo(x, y);
		}

		this[_].x = x;
		this[_].y = y;
	}

	/**
	 * X postion of turtle
	 *
	 * @readonly
	 * @memberof Turtle
	 */
	get x() {
		return this[_].x;
	}

	/**
	 * Y postion of turtle
	 *
	 * @readonly
	 * @memberof Turtle
	 */
	get y() {
		return this[_].y;
	}

	get canvas() {
		return this[_].privateData.canvas;
	}

	/**
	 * Set colors of turtle.
	 *
	 * @param {string} stroke Stroke color
	 * @param {string} [fill="transparent"] Fill color
	 * @memberof Turtle
	 */
	color(stroke, fill = "transparent") {
		this[_].strokeColor = stroke;
		this[_].fillColor = fill;
	}

	/**
	 * Set fill color of turtle.
	 *
	 * @param {string} fill Fill color
	 * @memberof Turtle
	 */
	fillColor(fill) {
		this[_].fillColor = fill;
	}

	/**
	 * Set pen size.
	 *
	 * @param {number} size Pen size (in pixels)
	 * @memberof Turtle
	 */
	penSize(size) {
		this[_].penSize = size;
	}

	/**
	 * Set pen cap and join method.
	 *
	 * @param {("butt"|"square"|"round")} cap Pen cap
	 * @param {("milter"|"bevel"|"round")} [join] Join type
	 * @memberof Turtle
	 */
	penCap(cap, join) {
		this[_].penCap = cap;
		if (join) this[_].penJoin = join;
	}

	/**
	 * Starts stroked path.
	 *
	 * @memberof Turtle
	 */
	beginStroke() {
		this[_].pen = "stroke";
	}

	/**
	 * Starts filled path.
	 *
	 * @memberof Turtle
	 */
	beginFill() {
		this[_].pen = "fill";
	}

	/**
	 * End path.
	 *
	 * @memberof Turtle
	 */
	end() {
		this[_].canvasAccess.pen(
			this[_].fillColor,
			this[_].strokeColor,
			this[_].penSize,
			this[_].penCap,
			this[_].penJoin
		);
		if (this[_].pen == "stroke") this[_].canvasAccess.ctx.stroke(this[_].path);
		else if (this[_].pen == "fill") {
			this[_].canvasAccess.ctx.fill(this[_].path);
			this[_].canvasAccess.ctx.stroke(this[_].path);
		}

		this[_].pen = "none";
		this[_].paths.push(this[_].path);
		this[_].path = new Path2D();
	}

	/**
	 * Moves turtle to origin and resets direction.
	 *
	 * @memberof Turtle
	 */
	home() {
		this.goto(0, 0);
		this[_].direction = 0;
	}

	_setPrivate(name, value, accessCode) {
		if (this[_].activeAccessCodes.includes(accessCode)) {
			this[_].privateData[name] = value;
		}
	}

	_closeAccessCode(accessCode) {
		if (this[_].activeAccessCodes.includes(accessCode)) {
			this[_].activeAccessCodes.splice(
				this[_].activeAccessCodes.indexOf(accessCode),
				1
			);
		}
	}
}
