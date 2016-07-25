import { Span, Point, Tree2D } from "../canvas_objects";

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


function runTests() {
  getLargestSpanTest();
}

runTests();
