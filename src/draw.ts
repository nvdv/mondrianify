import { Span, Tree2D } from './canvas_objects';

const FRAME_LINE_WIDTH = 3;
const FRAME_LINE_COLOR = 'black';

function drawFrame(context, picture) {
  context.lineWidth = FRAME_LINE_WIDTH;
  context.stokeStyle = FRAME_LINE_COLOR;
  context.strokeRect(
    picture.canvasSpan.xmin,
    picture.canvasSpan.ymin,
    picture.canvasSpan.xmax - picture.canvasSpan.xmin,
    picture.canvasSpan.ymax - picture.canvasSpan.ymin);
}

function draw() {
  let canvas = <HTMLCanvasElement> document.getElementById('currCanvas');
  canvas.width = 0.5 * document.body.clientWidth;
  canvas.height = 0.5 * document.body.clientWidth;
  let context = canvas.getContext('2d');
  let canvasSpan = new Span(0, canvas.width, 0, canvas.height);
  let picture = new Tree2D(canvasSpan);

  drawFrame(context, picture);
}

draw();
