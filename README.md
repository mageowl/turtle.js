# turtle.js

A Python turtle-like API for JS and HTML5 Canvas.

```javascript
#! ./star.js
import { Turtle, TCanvas, range } from "../main.js";

let canvas = new TCanvas("c");
let turtle = new Turtle(canvas);

turtle.color("transparent", "yellow");

turtle.goto(150, 30);

turtle.beginFill();
for (let i of range(5)) {
	turtle.forward(100);
	turtle.right(144);
}
turtle.end();
```
