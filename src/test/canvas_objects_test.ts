import { Span, Point, Tree2D, findSuitableColor } from "../canvas_objects";

function isEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

function assertEqual(op1, op2) {
  if (!isEqual(op1, op2)) {
    throw new Error(
      JSON.stringify(op1) + ' is not equal to ' + JSON.stringify(op2));
  }
}

function assertTrue(op1) {
  if (!op1) {
    throw new Error(JSON.stringify(op1) + ' is not true ');
  }
}

function spanIsNeighborTest() {
  let span = new Span(10, 50, 20, 60);
  assertTrue(span.isNeighbor(new Span(0, 10, 30, 50)));
  assertTrue(span.isNeighbor(new Span(0, 10, 10, 70)));
  assertTrue(!span.isNeighbor(new Span(0, 10, 100, 120)));

  assertTrue(span.isNeighbor(new Span(20, 40, 60, 70)));
  assertTrue(span.isNeighbor(new Span(0, 100, 60, 70)));
  assertTrue(!span.isNeighbor(new Span(100, 120, 60, 70)));

  assertTrue(span.isNeighbor(new Span(50, 60, 30, 50)));
  assertTrue(span.isNeighbor(new Span(50, 60, 10, 100)));
  assertTrue(!span.isNeighbor(new Span(50, 60, 100, 120)));

  assertTrue(span.isNeighbor(new Span(20, 40, 10, 20)));
  assertTrue(span.isNeighbor(new Span(0, 100, 10, 20)));
  assertTrue(!span.isNeighbor(new Span(100, 120, 10, 20)));

  assertTrue(!span.isNeighbor(new Span(70, 90, 50, 80)));
}

function getLargestSpanTest() {
  let span = new Span(0, 100, 0, 100);
  let tree = new Tree2D(span);
  tree.insert(new Point(75, 75));
  assertEqual(tree.getLargestChildSpan(), new Span(0, 75, 0, 100));
  tree.insert(new Point(30, 30));
  assertEqual(tree.getLargestChildSpan(), new Span(0, 75, 30, 100));
  tree.insert(new Point(50, 10));
  assertEqual(tree.getLargestChildSpan(), new Span(0, 75, 30, 100));
  tree.insert(new Point(30, 60));
  assertEqual(tree.getLargestChildSpan(), new Span(30, 75, 30, 100));
  tree.insert(new Point(80, 50));
  assertEqual(tree.getLargestChildSpan(), new Span(30, 75, 30, 100));
  tree.insert(new Point(60, 60));
  assertEqual(tree.getLargestChildSpan(), new Span(0, 30, 30, 100));
}

function findSuitableColorTest() {
  let availableColors = ['black', 'blue', 'white', 'white', 'yellow', 'red'];

  var neighborColors = ['red'];
  assertTrue(findSuitableColor(availableColors, neighborColors) !== 'red');

  neighborColors = ['blue', 'white'];
  assertTrue(findSuitableColor(availableColors, neighborColors) !== 'blue');
  assertTrue(findSuitableColor(availableColors, neighborColors) !== 'white');

  neighborColors = ['black', 'yellow', 'red'];
  assertTrue(findSuitableColor(availableColors, neighborColors) !== 'black');
  assertTrue(findSuitableColor(availableColors, neighborColors) !== 'yellow');
  assertTrue(findSuitableColor(availableColors, neighborColors) !== 'red');

  neighborColors = ['black', 'yellow', 'red', 'blue'];
  assertTrue(findSuitableColor(availableColors, neighborColors) === 'white');
}


function runTests() {
  getLargestSpanTest();
  spanIsNeighborTest();
  findSuitableColorTest();
}

runTests();
