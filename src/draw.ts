/**
 * Various drawing functions.
 */
import { Span, Tree2D, createTree, colorizeTree } from './canvas_objects';

const FRAME_LINE_WIDTH = 10;
const FRAME_LINE_COLOR = 'black';
const NORMAL_LINE_WIDTH = 2;
const NUM_POINTS = 15;
const SCALE_COEFF = 3;

/**
 * Draws canvas and tile frames.
 * @param context - Drawing context.
 * @param picture - Internal picture representation.
 */
function drawFrames(context, picture) {
  context.lineWidth = FRAME_LINE_WIDTH;
  context.stokeStyle = FRAME_LINE_COLOR;
  context.strokeRect(
    picture.canvasSpan.xmin,
    picture.canvasSpan.ymin,
    picture.canvasSpan.xmax - picture.canvasSpan.xmin,
    picture.canvasSpan.ymax - picture.canvasSpan.ymin);

  context.lineWidth = NORMAL_LINE_WIDTH;
  for (let currSpan of picture.getChildrenSpans()) {
    context.strokeRect(
      currSpan.xmin,
      currSpan.ymin,
      currSpan.xmax - currSpan.xmin,
      currSpan.ymax - currSpan.ymin);
  }
}

/**
 * Draws color tiles.
 * @param context - Drawing context.
 * @param picture - Internal picture representation.
 */
function drawTiles(context, picture) {
  for (let currSpan of picture.getChildrenSpans()) {
    context.fillStyle = currSpan.color;
    context.fillRect(
      currSpan.xmin,
      currSpan.ymin,
      currSpan.xmax - currSpan.xmin,
      currSpan.ymax - currSpan.ymin);
  }
}

/**
 * Draws final picture.
 * @param canvas - Drawing canvas.
 */
function draw(canvas) {
  let context = canvas.getContext('2d');
  let canvasSpan = new Span(0, canvas.width, 0, canvas.height);
  let picture = createTree(canvasSpan, NUM_POINTS, SCALE_COEFF);

  colorizeTree(picture);
  drawTiles(context, picture);
  drawFrames(context, picture);
}

/**
 * Main function.
 */
function main() {
  let canvas = <HTMLCanvasElement> document.getElementById('currCanvas');
  canvas.width = 0.5 * document.body.clientWidth;
  canvas.height = 0.95 * document.body.clientHeight;
  canvas.addEventListener('click', (_) => draw(canvas));
  draw(canvas);
};

main();
