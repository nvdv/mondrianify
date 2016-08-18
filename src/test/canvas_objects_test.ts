import { Span, Point, Tree2D } from "../canvas_objects";

function isEqual(a, b) {
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

function assertEqual(op1, op2) {
  if (!isEqual(op1, op2)) {
    throw new Error(
      JSON.stringify(op1) + " is not equal to " + JSON.stringify(op2));
  }
}

function assertTrue(op1) {
  if (!op1) {
    throw new Error(JSON.stringify(op1) + " is not true ");
  }
}

function assertArrayOfObjectsEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error(
      JSON.stringify(arr1) + " is not equal to " + JSON.stringify(arr2));
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!isEqual(arr1[i], arr2[i])) {
      throw new Error(
        JSON.stringify(arr1) + " is not equal to " + JSON.stringify(arr2));
    }
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

function getChildrenSpansTest() {
  let span = new Span(0, 100, 0, 100);
  let tree = new Tree2D(span);
  tree.insert(new Point(50, 50));
  tree.insert(new Point(20, 20));
  tree.insert(new Point(80, 80));
  tree.insert(new Point(70, 70));

  assertArrayOfObjectsEqual(tree.getChildrenSpans(),
                            [new Span(0, 50, 0, 20),
                             new Span(0, 50, 20, 100),
                             new Span(50, 70, 0, 80),
                             new Span(70, 100, 0, 80),
                             new Span(50, 100, 80, 100)]);
}

function getNeighborTest() {
  let span = new Span(0, 100, 0, 100);
  let tree = new Tree2D(span);
  tree.insert(new Point(50, 50));
  tree.insert(new Point(20, 20));
  tree.insert(new Point(80, 80));
  tree.insert(new Point(70, 70));

  assertArrayOfObjectsEqual(
    tree.getNeighborSpans(new Span(0, 50, 0, 20)),
    [new Span(0, 50, 20, 100),
     new Span(50, 70, 0, 80)]
  );

  assertArrayOfObjectsEqual(
    tree.getNeighborSpans(new Span(0, 50, 20, 100)),
    [new Span(0, 50, 0, 20),
     new Span(50, 70, 0, 80),
     new Span(50, 100, 80, 100)]
  );

  assertArrayOfObjectsEqual(
    tree.getNeighborSpans(new Span(50, 70, 0, 80)),
    [new Span(0, 50, 0, 20),
     new Span(0, 50, 20, 100),
     new Span(70, 100, 0, 80),
     new Span(50, 100, 80, 100)]
  );

  assertArrayOfObjectsEqual(
    tree.getNeighborSpans(new Span(70, 100, 0, 80)),
    [new Span(50, 70, 0, 80),
     new Span(50, 100, 80, 100)]
  );

  assertArrayOfObjectsEqual(
    tree.getNeighborSpans(new Span(50, 100, 80, 100)),
    [new Span(0, 50, 20, 100),
     new Span(50, 70, 0, 80),
     new Span(70, 100, 0, 80)]
  );
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
  spanIsNeighborTest();
  getChildrenSpansTest();
  getNeighborTest();
}

runTests();
