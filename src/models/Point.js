export default class Point {
  /**
   * Creates a new point
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  left() {
    return new Point(this.x, this.y - 1);
  }

  right() {
    return new Point(this.x, this.y + 1);
  }

  down() {
    return new Point(this.x + 1, this.y);
  }

  up() {
    return new Point(this.x - 1, this.y);
  }

  equals(other) {
    if (!other) {
      return false;
    }
    return this.x === other.x && this.y === other.y;
  }
}
