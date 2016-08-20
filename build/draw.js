(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Picture representation and related functions..
 */
"use strict";
/**
 * Checks whether segments intersect.
 * @param s1 - Start of 1st segment
 * @param e1 - End of 1st segment
 * @param s2 - Start of 2nd segment
 * @param e2 - End of 2nd segment
 */
function segmentsIntersect(s1, e1, s2, e2) {
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
var Span = (function () {
    function Span(xmin, xmax, ymin, ymax) {
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
        this.area = (xmax - xmin) * (ymax - ymin);
    }
    Span.prototype.isNeighbor = function (s) {
        // Check whether it is sane span,
        if (this.xmin === s.xmin && this.xmax === s.xmax &&
            this.ymin === s.ymin && this.ymax === s.ymax) {
            return false;
        }
        // Do side checking,
        if (this.xmin === s.xmax && segmentsIntersect(this.ymin, this.ymax, s.ymin, s.ymax)) {
            return true;
        }
        if (this.ymax === s.ymin && segmentsIntersect(this.xmin, this.xmax, s.xmin, s.xmax)) {
            return true;
        }
        if (this.xmax === s.xmin && segmentsIntersect(this.ymin, this.ymax, s.ymin, s.ymax)) {
            return true;
        }
        if (this.ymin === s.ymax && segmentsIntersect(this.xmin, this.xmax, s.xmin, s.xmax)) {
            return true;
        }
        return false;
    };
    return Span;
}());
exports.Span = Span;
/**
 * Represents point in 2D space.
 */
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
exports.Point = Point;
/**
 * Represents axis.
 */
var Axis;
(function (Axis) {
    Axis[Axis["X"] = 0] = "X";
    Axis[Axis["Y"] = 1] = "Y";
})(Axis || (Axis = {}));
/**
 * Represents 2d tree node.
 */
var TreeNode = (function () {
    function TreeNode(point, axis, rightSpan, leftSpan) {
        this.point = point;
        this.axis = axis;
        this.rightSpan = rightSpan;
        this.leftSpan = leftSpan;
    }
    return TreeNode;
}());
/**
 * Represents 2D tree.
 */
var Tree2D = (function () {
    function Tree2D(canvasSpan) {
        this.canvasSpan = canvasSpan;
    }
    /**
     * Handles tree node insertion.
     */
    Tree2D.prototype.insertNode = function (p, currNode, axis, nodeSpan) {
        if (!currNode) {
            var leftSpan = void 0, rightSpan = void 0;
            if (axis === Axis.X) {
                leftSpan = new Span(nodeSpan.xmin, p.x, nodeSpan.ymin, nodeSpan.ymax);
                rightSpan = new Span(p.x, nodeSpan.xmax, nodeSpan.ymin, nodeSpan.ymax);
            }
            else {
                leftSpan = new Span(nodeSpan.xmin, nodeSpan.xmax, nodeSpan.ymin, p.y);
                rightSpan = new Span(nodeSpan.xmin, nodeSpan.xmax, p.y, nodeSpan.ymax);
            }
            return new TreeNode(p, axis, rightSpan, leftSpan);
        }
        if (axis === Axis.X) {
            if (p.x < currNode.point.x) {
                currNode.leftChild = this.insertNode(p, currNode.leftChild, Axis.Y, currNode.leftSpan);
            }
            else {
                currNode.rightChild = this.insertNode(p, currNode.rightChild, Axis.Y, currNode.rightSpan);
            }
        }
        else {
            if (p.y < currNode.point.y) {
                currNode.leftChild = this.insertNode(p, currNode.leftChild, Axis.X, currNode.leftSpan);
            }
            else {
                currNode.rightChild = this.insertNode(p, currNode.rightChild, Axis.X, currNode.rightSpan);
            }
        }
        return currNode;
    };
    /**
     * Inserts point into the tree.
     */
    Tree2D.prototype.insert = function (p) {
        this.root = this.insertNode(p, this.root, Axis.X, this.canvasSpan);
    };
    /**
     * Returns all leaf-level spans.
     */
    Tree2D.prototype.getChildrenSpans = function () {
        var result = [];
        var spansInOrder = function (node) {
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
    };
    /**
     * Returns largest leaf-level span.
     */
    Tree2D.prototype.getLargestChildSpan = function () {
        return this.getChildrenSpans().reduce(function (a, b) { return a.area > b.area ? a : b; });
    };
    /**
     * Returns neighbor spans for specified span.
     */
    Tree2D.prototype.getNeighborSpans = function (span) {
        return this.getChildrenSpans().filter(function (s) { return s.isNeighbor(span); });
    };
    return Tree2D;
}());
exports.Tree2D = Tree2D;
/**
 * Generates 2D tree on canvas specified by canvasSpan.
 * @param canvasSpan - Span that specifies canvas size
 * @param numPoints - Number of bisecting points in 2D tree.
 * @param scaleK - Scale coefficient.
 */
function createTree(canvasSpan, numPoints, scaleK) {
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    var canvas = new Tree2D(canvasSpan);
    var xRand = getRandomInt(canvasSpan.xmin, canvasSpan.xmax);
    var yRand = getRandomInt(canvasSpan.ymin, canvasSpan.ymax);
    canvas.insert(new Point(xRand, yRand));
    for (var i = 0; i < numPoints - 1; i++) {
        var largestSpan = canvas.getLargestChildSpan();
        var dx = largestSpan.xmax - largestSpan.xmin;
        var dy = largestSpan.ymax - largestSpan.ymin;
        var rx = dx / scaleK, ry = dy / scaleK;
        xRand = getRandomInt(largestSpan.xmin + rx, largestSpan.xmax - rx);
        yRand = getRandomInt(largestSpan.ymin + ry, largestSpan.ymax - ry);
        canvas.insert(new Point(xRand, yRand));
    }
    return canvas;
}
exports.createTree = createTree;
var WHITE_COLOR = "#FFFFFF";
var RED_COLOR = "#C80815";
var YELLOW_COLOR = "#FFF700";
var BLUE_COLOR = "#0038A8";
var BLACK_COLOR = "#000000";
var RED_TILE_RATIO = 0.08;
var BLUE_TILE_RATIO = 0.07;
var YELLOW_TILE_RATIO = 0.08;
var BLACK_TILE_RATIO = 0.03;
var MIN_WHITE_NEIGHBORS = 3;
var MAX_ATTEMPTS = 2;
/**
 * Assigns colors to tiles
 * @param tree - 2D tree that representing picture.
 */
function colorizeTree(tree) {
    var childrenSpans = tree.getChildrenSpans();
    var numTiles = childrenSpans.length;
    var numRedTiles = Math.ceil(RED_TILE_RATIO * numTiles);
    var numBlueTiles = Math.ceil(BLUE_TILE_RATIO * numTiles);
    var numYellowTiles = Math.ceil(YELLOW_TILE_RATIO * numTiles);
    var numBlackTiles = Math.ceil(BLACK_TILE_RATIO * numTiles);
    var numWhiteTiles = (numTiles - numRedTiles - numBlueTiles - numYellowTiles - numBlackTiles);
    var arrayRepeat = function (e, times) {
        var output = [];
        for (var i = 0; i < times; i++) {
            output.push(e);
        }
        return output;
    };
    var availableColors = [].concat(arrayRepeat(WHITE_COLOR, numWhiteTiles))
        .concat(arrayRepeat(RED_COLOR, numRedTiles))
        .concat(arrayRepeat(BLUE_COLOR, numBlueTiles))
        .concat(arrayRepeat(YELLOW_COLOR, numYellowTiles))
        .concat(arrayRepeat(BLACK_COLOR, numBlackTiles));
    var shuffleArray = function (arr) {
        for (var i = arr.length; i; i--) {
            var j = Math.floor(Math.random() * i);
            var x = arr[i - 1];
            arr[i - 1] = arr[j];
            arr[j] = x;
        }
    };
    var count = function (arr, el) {
        var counter = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === el) {
                counter++;
            }
        }
        return counter;
    };
    var isColoringGood = function (span, color) {
        var neighborColors = tree.getNeighborSpans(span).map(function (s) { return s.color; });
        // Since there are more white tiles, we want special handling for white.
        return (color === WHITE_COLOR &&
            count(neighborColors, WHITE_COLOR) < MIN_WHITE_NEIGHBORS) ||
            neighborColors.indexOf(color) === -1;
    };
    shuffleArray(availableColors);
    for (var _i = 0, childrenSpans_1 = childrenSpans; _i < childrenSpans_1.length; _i++) {
        var span = childrenSpans_1[_i];
        for (var n = 0; n < MAX_ATTEMPTS; n++) {
            if (isColoringGood(span, availableColors[0])) {
                span.color = availableColors[0];
                break;
            }
            else {
                shuffleArray(availableColors);
            }
        }
        availableColors.shift();
    }
}
exports.colorizeTree = colorizeTree;

},{}],2:[function(require,module,exports){
"use strict";
/**
 * Various drawing functions.
 */
var canvas_objects_1 = require("./canvas_objects");
var WIDTH_SCALE = 0.95;
var HEIGHT_SCALE = 0.95;
var FRAME_LINE_WIDTH = 10;
var FRAME_LINE_COLOR = "black";
var NORMAL_LINE_WIDTH = 2;
var NUM_POINTS_RANGE = [50, 100];
var SCALE_COEFF_RANGE = [3, 5];
/**
 * Draws canvas and tile frames.
 * @param context - Drawing context.
 * @param picture - Internal picture representation.
 */
function drawFrames(context, picture) {
    context.lineWidth = FRAME_LINE_WIDTH;
    context.stokeStyle = FRAME_LINE_COLOR;
    context.strokeRect(picture.canvasSpan.xmin, picture.canvasSpan.ymin, picture.canvasSpan.xmax - picture.canvasSpan.xmin, picture.canvasSpan.ymax - picture.canvasSpan.ymin);
    context.lineWidth = NORMAL_LINE_WIDTH;
    for (var _i = 0, _a = picture.getChildrenSpans(); _i < _a.length; _i++) {
        var currSpan = _a[_i];
        context.strokeRect(currSpan.xmin, currSpan.ymin, currSpan.xmax - currSpan.xmin, currSpan.ymax - currSpan.ymin);
    }
}
/**
 * Draws color tiles.
 * @param context - Drawing context.
 * @param picture - Internal picture representation.
 */
function drawTiles(context, picture) {
    for (var _i = 0, _a = picture.getChildrenSpans(); _i < _a.length; _i++) {
        var currSpan = _a[_i];
        context.fillStyle = currSpan.color;
        context.fillRect(currSpan.xmin, currSpan.ymin, currSpan.xmax - currSpan.xmin, currSpan.ymax - currSpan.ymin);
    }
}
/**
 * Draws final picture.
 * @param canvas - Drawing canvas.
 */
function draw(canvas) {
    var context = canvas.getContext("2d");
    var canvasSpan = new canvas_objects_1.Span(0, canvas.width, 0, canvas.height);
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    var picture = canvas_objects_1.createTree(canvasSpan, getRandomInt(NUM_POINTS_RANGE[0], NUM_POINTS_RANGE[1]), getRandomInt(SCALE_COEFF_RANGE[0], SCALE_COEFF_RANGE[1]));
    canvas_objects_1.colorizeTree(picture);
    drawTiles(context, picture);
    drawFrames(context, picture);
}
/**
 * Main function.
 */
function main() {
    var canvas = document.getElementById("currCanvas");
    canvas.width = WIDTH_SCALE * document.body.clientWidth;
    canvas.height = HEIGHT_SCALE * document.body.clientHeight;
    canvas.addEventListener("click", function (_) { return draw(canvas); });
    draw(canvas);
}
;
main();

},{"./canvas_objects":1}]},{},[2]);
