// Represents rectangle in 2D space.
class Span {
  color: string;
  constructor (public xmin: number, public xmax: number,
               public ymin: number, public ymax: number) {
  }
}

// Represents point in 2D space.
class Point {
  constructor(public x: number, public y: number) {
  }
}
