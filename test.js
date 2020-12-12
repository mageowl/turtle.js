import { Turtle, TCanvas } from "./main.js";

let canvas = new TCanvas("c");
let turtle = new Turtle(canvas);

turtle.color("blue", "green");

turtle.beginFill();
turtle.right(45);
turtle.forward(50);
turtle.left(45);
turtle.forward(50);
turtle.left(45);
turtle.forward(50);
turtle.home();
turtle.end();

turtle.style.lineColor = "red";
