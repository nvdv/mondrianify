/**
 * Various drawing functions.
 */
import { Span, createTree, colorizeTree } from "./canvas_objects.js";
const WIDTH_SCALE = 2;
const HEIGHT_SCALE = 2;
const FRAME_LINE_WIDTH = 10;
const FRAME_LINE_COLOR = "#1A1A1A";
const NORMAL_LINE_WIDTH = 8;
const NUM_POINTS_RANGE = [40, 80];
const SCALE_COEFF_RANGE = [3, 5];
/**
 * Draws canvas and tile frames.
 * @param context - Drawing context.
 * @param picture - Internal picture representation.
 */
function drawFrames(context, picture) {
    context.lineWidth = FRAME_LINE_WIDTH;
    context.strokeStyle = FRAME_LINE_COLOR;
    context.strokeRect(picture.canvasSpan.xmin, picture.canvasSpan.ymin, picture.canvasSpan.xmax - picture.canvasSpan.xmin, picture.canvasSpan.ymax - picture.canvasSpan.ymin);
    context.lineWidth = NORMAL_LINE_WIDTH;
    for (let currSpan of picture.getChildrenSpans()) {
        context.strokeRect(currSpan.xmin, currSpan.ymin, currSpan.xmax - currSpan.xmin, currSpan.ymax - currSpan.ymin);
    }
}
/**
 * Draws color tiles.
 * @param context - Drawing context.
 * @param picture - Internal picture representation.
 */
function drawTiles(context, picture) {
    for (let currSpan of picture.getChildrenSpans()) {
        if (currSpan.color) {
            context.fillStyle = currSpan.color;
        }
        context.fillRect(currSpan.xmin, currSpan.ymin, currSpan.xmax - currSpan.xmin, currSpan.ymax - currSpan.ymin);
    }
}
/**
 * Draws final picture.
 * @param canvas - Drawing canvas.
 */
function draw(canvas) {
    let context = canvas.getContext("2d");
    if (!context) {
        return;
    }
    let canvasSpan = new Span(0, canvas.width, 0, canvas.height);
    let getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    let picture = createTree(canvasSpan, getRandomInt(NUM_POINTS_RANGE[0], NUM_POINTS_RANGE[1]), getRandomInt(SCALE_COEFF_RANGE[0], SCALE_COEFF_RANGE[1]));
    colorizeTree(picture);
    drawTiles(context, picture);
    drawFrames(context, picture);
}
/**
 * Main function.
 */
function main() {
    let canvas = document.getElementById("currCanvas");
    if (!canvas) {
        return;
    }
    canvas.width = WIDTH_SCALE * document.body.clientWidth;
    canvas.height = HEIGHT_SCALE * document.body.clientHeight;
    canvas.addEventListener("click", () => draw(canvas));
    draw(canvas);
}
main();
