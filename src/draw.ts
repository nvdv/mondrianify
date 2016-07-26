import { Span, Tree2D, createTree } from './canvas_objects';

const FRAME_LINE_WIDTH = 9;
const FRAME_LINE_COLOR = 'black';
const NORMAL_LINE_WIDTH = 1;
const NUM_POINTS = 12;
const SCALE_COEFF = 3;

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

function draw() {
  let canvas = <HTMLCanvasElement> document.getElementById('currCanvas');
  canvas.width = 0.5 * document.body.clientWidth;
  canvas.height = 0.9 * document.body.clientHeight;
  let context = canvas.getContext('2d');
  let canvasSpan = new Span(0, canvas.width, 0, canvas.height);
  let picture = createTree(canvasSpan, NUM_POINTS, SCALE_COEFF);

  drawFrames(context, picture);
}

draw();
