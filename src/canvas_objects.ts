/**
 * Picture representation and related functions..
 */

 /**
  * Checks whether segments intersect.
  * @param s1 - Start of 1st segment
  * @param e1 - End of 1st segment
  * @param s2 - Start of 2nd segment
  * @param e2 - End of 2nd segment
  */
function segmentsIntersect(s1: number,
                           e1: number,
                           s2: number,
                           e2: number): boolean {
  if (s2 >= s1 && s2 <= e1 || e2 >= s1 && e2 <= e1) {
    return true;
  }
  if (s1 >= s2 && s1 <= e2 || e1 >= s2 && e1 <= e2) {
    return true;
  }
  return false;
}

/**
 * Represents single tile on picture.
 */
class Span {
  color: string;
  area: number;
  constructor (public xmin: number, public xmax: number,
               public ymin: number, public ymax: number) {
    this.area = (xmax - xmin) * (ymax - ymin);
  }

  isNeighbor(s: Span): boolean {
    // Check whether it is sane span,
    if (this.xmin === s.xmin && this.xmax === s.xmax &&
        this.ymin === s.ymin && this.ymax === s.ymax) {
      return false;
    }
    // Check sides
    if (this.xmin === s.xmax &&
        segmentsIntersect(this.ymin, this.ymax, s.ymin, s.ymax)) {
      return true;
    }
    if (this.ymax === s.ymin &&
        segmentsIntersect(this.xmin, this.xmax, s.xmin, s.xmax)) {
      return true;
    }
    if (this.xmax === s.xmin &&
        segmentsIntersect(this.ymin, this.ymax, s.ymin, s.ymax)) {
      return true;
    }
    if (this.ymin === s.ymax &&
        segmentsIntersect(this.xmin, this.xmax, s.xmin, s.xmax)) {
      return true;
    }
    return false;
  }
}

/**
 * Represents point in 2D space.
 */
class Point {
  constructor(public x: number, public y: number) {
  }
}

/**
 * Represents axis.
 */
enum Axis { X, Y }

/**
 * Represents 2d tree node.
 */
class TreeNode {
  leftChild: TreeNode;
  rightChild: TreeNode;
  constructor(public point: Point, public axis: Axis,
              public rightSpan: Span, public leftSpan: Span) {
  }
}

/**
 * Represents 2D tree.
 */
class Tree2D {
  private root: TreeNode;
  constructor(public canvasSpan: Span) {
  }

  /**
   * Handles tree node insertion.
   */
  private insertNode(p: Point, currNode: TreeNode, axis: Axis, nodeSpan: Span) {
    if (!currNode) {
      let leftSpan: Span, rightSpan: Span;
      if (axis === Axis.X) {
        leftSpan = new Span(nodeSpan.xmin, p.x, nodeSpan.ymin, nodeSpan.ymax);
        rightSpan = new Span(p.x, nodeSpan.xmax, nodeSpan.ymin, nodeSpan.ymax);
      } else {
        leftSpan = new Span(nodeSpan.xmin, nodeSpan.xmax, nodeSpan.ymin, p.y);
        rightSpan = new Span(nodeSpan.xmin, nodeSpan.xmax, p.y, nodeSpan.ymax);
      }
      return new TreeNode(p, axis, rightSpan, leftSpan);
    }
    if (axis === Axis.X) {
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

  /**
   * Inserts point into the tree.
   */
  insert(p: Point) {
    this.root = this.insertNode(p, this.root, Axis.X, this.canvasSpan);
  }

  /**
   * Returns all leaf-level spans.
   */
  getChildrenSpans(): Array<Span> {
    let result: Span[] = [];
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

  /**
   * Returns largest leaf-level span.
   */
  getLargestChildSpan(): Span {
    return this.getChildrenSpans().reduce((a, b) => a.area > b.area ? a : b);
  }

  /**
   * Returns neighbor spans for specified span.
   */
  getNeighborSpans(span: Span): Array<Span> {
    return this.getChildrenSpans().filter(s => s.isNeighbor(span));
  }
}

/**
 * Generates 2D tree on canvas specified by canvasSpan.
 * @param canvasSpan - Span that specifies canvas size
 * @param numPoints - Number of bisecting points in 2D tree.
 * @param scaleK - Scale coefficient.
 */
function createTree(canvasSpan: Span,
                    numPoints: number,
                    scaleK: number): Tree2D {
  let getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + Math.floor(min);
  };

  let canvas = new Tree2D(canvasSpan);
  let xRand = getRandomInt(canvasSpan.xmin, canvasSpan.xmax);
  let yRand = getRandomInt(canvasSpan.ymin, canvasSpan.ymax);
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

const WHITE_COLOR = "#FFFFFF";
const RED_COLOR = "#C80815";
const YELLOW_COLOR = "#FFF700";
const BLUE_COLOR = "#0038A8";
const BLACK_COLOR = "#000000";

const RED_TILE_RATIO = 0.08;
const BLUE_TILE_RATIO = 0.07;
const YELLOW_TILE_RATIO = 0.08;
const BLACK_TILE_RATIO = 0.03;

const MIN_WHITE_NEIGHBORS = 4;
const MAX_ATTEMPTS = 2;

/**
 * Assigns colors to tiles
 * @param tree - 2D tree that representing picture.
 */
function colorizeTree(tree: Tree2D) {
  let childrenSpans = tree.getChildrenSpans();
  let numTiles = childrenSpans.length;
  let numRedTiles = Math.ceil(RED_TILE_RATIO * numTiles);
  let numBlueTiles = Math.ceil(BLUE_TILE_RATIO * numTiles);
  let numYellowTiles = Math.ceil(YELLOW_TILE_RATIO * numTiles);
  let numBlackTiles = Math.ceil(BLACK_TILE_RATIO * numTiles);
  let numWhiteTiles = (
    numTiles - numRedTiles - numBlueTiles - numYellowTiles - numBlackTiles);

  let arrayRepeat = (e, times) => {
    let output = [];
    for (let i = 0; i < times; i++) {
      output.push(e);
    }
    return output;
  };

  let availableColors = [].concat(arrayRepeat(WHITE_COLOR, numWhiteTiles))
    .concat(arrayRepeat(RED_COLOR, numRedTiles))
    .concat(arrayRepeat(BLUE_COLOR, numBlueTiles))
    .concat(arrayRepeat(YELLOW_COLOR, numYellowTiles))
    .concat(arrayRepeat(BLACK_COLOR, numBlackTiles));

  let shuffleArray = (arr) => {
    for (let i = arr.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      let x = arr[i - 1];
      arr[i - 1] = arr[j];
      arr[j] = x;
     }
  };

  let count = (arr, el) => {
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === el) {
        counter++;
      }
    }
    return counter;
  };

  let isColoringGood = (span: Span, color: string): boolean => {
    let neighborColors = tree.getNeighborSpans(span).map(s => s.color);
    // Since there are more white tiles, we want special handling for white.
    return (color === WHITE_COLOR &&
            count(neighborColors, WHITE_COLOR) < MIN_WHITE_NEIGHBORS) ||
           neighborColors.indexOf(color) === -1;
  };

  shuffleArray(availableColors);
  for (let span of childrenSpans) {
    for (let n = 0; n < MAX_ATTEMPTS; n++) {
      if (isColoringGood(span, availableColors[0])) {
        span.color = availableColors[0];
        break;
      } else {
        shuffleArray(availableColors);
      }
    }
    availableColors.shift();
  }
}

export { Span, Point, Tree2D, createTree, colorizeTree };
