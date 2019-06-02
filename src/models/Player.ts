import Point from './Point';

export enum Direction {
  Up,
  Down,
  Left,
  Right
}

class Player {
  public location: Point;

  public direction: Direction;

  public constructor(location: Point, direction: Direction) {
    this.location = location;
    this.direction = direction;
  }
}

export default Player;
