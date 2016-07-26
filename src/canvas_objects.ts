// Represents rectangle in 2D space.
class Span {
  color: string;
  area: number;
  constructor (public xmin: number, public xmax: number,
               public ymin: number, public ymax: number) {
    this.area = (xmax - xmin) * (ymax - ymin);
  }
}

// Represents point in 2D space.
class Point {
  constructor(public x: number, public y: number) {
  }
}

enum Axis { X, Y }

// Represents 2D tree node.
class TreeNode{
  leftChild: TreeNode;
  rightChild: TreeNode;
  constructor(public point: Point, public axis: Axis,
              public rightSpan: Span, public leftSpan: Span) {
  }
}

// Represents 2D tree on canvas.
class Tree2D {
  private root: TreeNode;
  constructor(public canvasSpan: Span) {
  }

  private insertNode(p: Point, currNode: TreeNode, axis: Axis, nodeSpan: Span) {
    if (!currNode) {
      let leftSpan: Span, rightSpan: Span;
      if (axis == Axis.X) {
        leftSpan = new Span(nodeSpan.xmin, p.x, nodeSpan.ymin, nodeSpan.ymax);
        rightSpan = new Span(p.x, nodeSpan.xmax, nodeSpan.ymin, nodeSpan.ymax);
      } else {
        leftSpan = new Span(nodeSpan.xmin, nodeSpan.xmax, nodeSpan.ymin, p.y);
        rightSpan = new Span(nodeSpan.xmin, nodeSpan.xmax, p.y, nodeSpan.ymax);
      }
      return new TreeNode(p, axis, rightSpan, leftSpan);
    }
    if (axis == Axis.X) {
      if (p.x < currNode.point.x) {
        currNode.leftChild = this.insertNode(
            p, currNode.leftChild, Axis.Y, currNode.leftSpan);
      } else {
        currNode.rightChild = this.insertNode(
          p, currNode.rightChild, Axis.Y, currNode.rightSpan);
      }
    } else {
      if (p.y < currNode.point.y) {
        currNode.leftChild = this.insertNode(
            p, currNode.leftChild, Axis.X, currNode.leftSpan);
      } else {
        currNode.rightChild = this.insertNode(
            p, currNode.rightChild, Axis.X, currNode.rightSpan);
      }
    }
    return currNode;
  }

  insert(p: Point) {
    this.root = this.insertNode(p, this.root, Axis.X, this.canvasSpan);
  }

  getChildrenSpans(): Array<Span> {
    var result: Span[] = [];
    let spansInOrder = (node: TreeNode) => {
      if (node) {
        spansInOrder(node.leftChild);
        if (!node.leftChild) {
          result.push(node.leftSpan);
        }
        if (!node.rightChild) {
          result.push(node.rightSpan);
        }
        spansInOrder(node.rightChild);
      }
    };
    spansInOrder(this.root);
    return result;
  }

  getLargestChildSpan(): Span {
    return this.getChildrenSpans().reduce((a, b) => a.area > b.area ? a : b);
  }
}

function createTree(canvasSpan: Span, numPoints: number, scaleK: number): Tree2D {
  let getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let canvas = new Tree2D(canvasSpan);
  var xRand = getRandomInt(canvasSpan.xmin, canvasSpan.xmax);
  var yRand = getRandomInt(canvasSpan.ymin, canvasSpan.ymax);
  canvas.insert(new Point(xRand, yRand));
  for (let i = 0; i < numPoints - 1; i++) {
    let largestSpan = canvas.getLargestChildSpan();
    let dx = largestSpan.xmax - largestSpan.xmin;
    let dy = largestSpan.ymax - largestSpan.ymin;
    let rx = dx / scaleK, ry = dy / scaleK;
    xRand = getRandomInt(largestSpan.xmin + rx , largestSpan.xmax - rx);
    yRand = getRandomInt(largestSpan.ymin + ry , largestSpan.ymax - ry);
    canvas.insert(new Point(xRand, yRand));
  }
  return canvas;
}

export { Span, Point, Tree2D, createTree };
