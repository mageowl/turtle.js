import { Turtle, TCanvas, util } from "../main.js";
const { range } = util;

let canvas = new TCanvas("c");
let tStars = new Turtle(canvas);
let tLines = new Turtle(canvas);

tLines.color("gold");
tLines.penSize(5);

let finish = document.getElementById("f");
let finished = false;

function drawStars() {
	tStars.color("orange", "gold");
	for (const star of stars) {
		tStars.goto(star[0], star[1]);

		tStars.rotation(-72);

		tStars.beginFill();
		for (let i of range(5)) {
			tStars.forward(50);
			tStars.right(144);
		}
		tStars.end();
	}
}

let stars = [];

tStars.penSize(3);
tStars.penCap("round", "round");

canvas.el.addEventListener("mousemove", (e) => {
	if (finished) return;

	canvas.clearScreen();

	drawStars();

	tStars.color("orange", "#FFD700a5");
	tStars.goto(e.clientX - 8, e.clientY - 8);

	tStars.rotation(-72);

	tStars.beginFill();
	for (let i of range(5)) {
		tStars.forward(50);
		tStars.right(144);
	}
	tStars.end();
});

canvas.el.addEventListener("mouseup", (e) => {
	if (finished) return;
	stars.push([e.clientX - 8, e.clientY - 8]);
});

finish.addEventListener("click", () => {
	finished = true;

	canvas.clearScreen();

	tLines.goto(stars[0][0], stars[0][1] + 25);

	tLines.beginStroke();
	let last = null;
	for (const star of stars) {
		if (last != null) {
			let angle =
				-(Math.atan((star[1] - last[1]) / (star[0] - last[0])) * 180) / Math.PI;
			let distance = Math.sqrt(
				(star[0] - last[0]) ** 2 + (star[1] - last[1]) ** 2
			);
			tLines.rotation(angle);
			tLines.forward(star[0] < last[0] ? -distance : distance);
		}

		last = star;
	}
	tLines.end();

	drawStars();
});
