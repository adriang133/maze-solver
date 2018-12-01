import { MAZE_CELL, MOVE } from '../Constants';
import Point from './Point'; // eslint-disable-line no-unused-vars

export default class PlayerState {
  /**
   * Represents a player state
   * @param {Point} location
   * @param {String} direction
   */
  constructor(location, direction) {
    this.location = location;
    this.direction = direction;
  }

  forwardLocation() {
    switch (this.direction) {
      case MAZE_CELL.PLAYER.UP:
        return this.location.up();
      case MAZE_CELL.PLAYER.DOWN:
        return this.location.down();
      case MAZE_CELL.PLAYER.LEFT:
        return this.location.left();
      case MAZE_CELL.PLAYER.RIGHT:
        return this.location.right();
      default:
        throw new Error('Invalid player direction');
    }
  }

  moveForward() {
    return new PlayerState(this.forwardLocation(), this.direction);
  }

  rotateRight() {
    let newDirection;
    switch (this.direction) {
      case MAZE_CELL.PLAYER.UP:
        newDirection = MAZE_CELL.PLAYER.RIGHT;
        break;
      case MAZE_CELL.PLAYER.DOWN:
        newDirection = MAZE_CELL.PLAYER.LEFT;
        break;
      case MAZE_CELL.PLAYER.RIGHT:
        newDirection = MAZE_CELL.PLAYER.DOWN;
        break;
      case MAZE_CELL.PLAYER.LEFT:
        newDirection = MAZE_CELL.PLAYER.UP;
        break;
      default:
        break;
    }
    return new PlayerState(this.location, newDirection);
  }

  rotateLeft() {
    let newDirection;
    switch (this.direction) {
      case MAZE_CELL.PLAYER.UP:
        newDirection = MAZE_CELL.PLAYER.LEFT;
        break;
      case MAZE_CELL.PLAYER.DOWN:
        newDirection = MAZE_CELL.PLAYER.RIGHT;
        break;
      case MAZE_CELL.PLAYER.RIGHT:
        newDirection = MAZE_CELL.PLAYER.UP;
        break;
      case MAZE_CELL.PLAYER.LEFT:
        newDirection = MAZE_CELL.PLAYER.DOWN;
        break;
      default:
        break;
    }
    return new PlayerState(this.location, newDirection);
  }

  rotateBack() {
    return this.rotateLeft().rotateLeft();
  }

  /**
   * Returns the position after moving to the destination, and the required rotation to do so
   * @param {Point} destination
   */
  getMoveTo(destination) {
    let rotation;
    let newDirection = this.direction;

    if (destination.equals(this.location.left())) {
      newDirection = MAZE_CELL.PLAYER.LEFT;
      switch (this.direction) {
        case MAZE_CELL.PLAYER.RIGHT:
          rotation = MOVE.ROTATE_BACK;
          break;
        case MAZE_CELL.PLAYER.DOWN:
          rotation = MOVE.ROTATE_RIGHT;
          break;
        case MAZE_CELL.PLAYER.UP:
          rotation = MOVE.ROTATE_LEFT;
          break;
        default:
          break;
      }
    } else if (destination.equals(this.location.right())) {
      newDirection = MAZE_CELL.PLAYER.RIGHT;
      switch (this.direction) {
        case MAZE_CELL.PLAYER.LEFT:
          rotation = MOVE.ROTATE_BACK;
          break;
        case MAZE_CELL.PLAYER.DOWN:
          rotation = MOVE.ROTATE_LEFT;
          break;
        case MAZE_CELL.PLAYER.UP:
          rotation = MOVE.ROTATE_RIGHT;
          break;
        default:
          break;
      }
    } else if (destination.equals(this.location.up())) {
      newDirection = MAZE_CELL.PLAYER.UP;
      switch (this.direction) {
        case MAZE_CELL.PLAYER.LEFT:
          rotation = MOVE.ROTATE_RIGHT;
          break;
        case MAZE_CELL.PLAYER.DOWN:
          rotation = MOVE.ROTATE_BACK;
          break;
        case MAZE_CELL.PLAYER.RIGHT:
          rotation = MOVE.ROTATE_LEFT;
          break;
        default:
          break;
      }
    } else if (destination.equals(this.location.down())) {
      newDirection = MAZE_CELL.PLAYER.DOWN;
      switch (this.direction) {
        case MAZE_CELL.PLAYER.LEFT:
          rotation = MOVE.ROTATE_LEFT;
          break;
        case MAZE_CELL.PLAYER.UP:
          rotation = MOVE.ROTATE_BACK;
          break;
        case MAZE_CELL.PLAYER.RIGHT:
          rotation = MOVE.ROTATE_RIGHT;
          break;
        default:
          break;
      }
    }

    return {
      rotation,
      newState: new PlayerState(destination, newDirection),
    };
  }
}
