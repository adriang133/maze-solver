export default class Point {
  constructor(public x: number, public y: number) {}

  public left(): Point {
    return new Point(this.x, this.y - 1);
  }

  public right(): Point {
    return new Point(this.x, this.y + 1);
  }

  public down(): Point {
    return new Point(this.x + 1, this.y);
  }

  public up(): Point {
    return new Point(this.x - 1, this.y);
  }

  public equals(other: Point): boolean {
    if (!other) {
      return false;
    }

    return this.x === other.x && this.y === other.y;
  }
}
