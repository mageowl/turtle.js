import { Turtle, TCanvas, util } from "../main.js";
const { range } = util;

let canvas = new TCanvas("c");
let turtle = new Turtle(canvas);

turtle.color("orange", "yellow");
turtle.penSize(3);

turtle.goto(150, 50);

turtle.beginFill();
for (let i of range(5)) {
	turtle.forward(100);
	turtle.right(144);
}
turtle.end();
