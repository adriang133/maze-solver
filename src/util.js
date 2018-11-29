/* eslint no-param-reassign: off */
import { MAZE_CELL, MOVE } from './constants';
import Point from './models/Point';
import PlayerState from './models/PlayerState';

export default class Util {
  /**
   * Returns true if p is a valid point within the maze boundaries, false otherwise
   * @param {Point} p
   * @param {Array} maze
   */
  static isOutOfBounds(p, maze) {
    return p.x < 0 || p.x >= maze.length || p.y < 0 || p.y >= maze[0].length;
  }

  /**
   * Swaps the values of two objects
   * @param {Object} a
   * @param {Object} b
   */
  static swap(a, b) {
    const tmp = b;
    b = a;
    a = tmp;
  }

  static deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Whether p is free
   * @param {Point} p
   * @param {Array} maze
   */
  static isFree(p, maze) {
    if (Util.isOutOfBounds(p, maze)) {
      return false;
    }
    return maze[p.x][p.y] === MAZE_CELL.FREE;
  }

  /**
   * Whether p is a wall or not
   * @param {Point} p
   * @param {Array} maze
   */
  static isWall(p, maze) {
    if (Util.isOutOfBounds(p, maze)) {
      return false;
    }
    return maze[p.x][p.y] === MAZE_CELL.WALL;
  }

  /**
   * Returns true if p is an exit point in the maze
   * @param {Point} p
   * @param {Array} maze
   */
  static isExit(p, maze) {
    if (Util.isOutOfBounds(p, maze)) {
      return false;
    }
    return p.x === 0 || p.y === 0 || p.x === maze.length - 1 || p.y === maze[0].length - 1;
  }

  /**
   * Returns true if the current player position is at p
   * @param {Point} p
   * @param {Array} maze
   */
  static isPlayer(p, maze) {
    if (Util.isOutOfBounds(p, maze)) {
      return false;
    }
    return !Util.isFree(p, maze) && !Util.isWall(p, maze);
  }

  /**
   * Returns the player's state in the maze (PlayerState object)
   * @param {[][]} maze A two-dimensional array representing the maze
   */
  static getPlayerState(maze) {
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        const currentCell = new Point(i, j);
        if (Util.isPlayer(currentCell, maze)) {
          return new PlayerState(currentCell, maze[i][j]);
        }
      }
    }

    throw new Error('Invalid maze');
  }

  static mazeWithUpdatedPlayerState(maze, oldPlayerState, newPlayerState) {
    const mazeCopy = Util.deepCopy(maze);
    mazeCopy[oldPlayerState.location.x][oldPlayerState.location.y] = MAZE_CELL.FREE;
    mazeCopy[newPlayerState.location.x][newPlayerState.location.y] = newPlayerState.direction;
    return mazeCopy;
  }

  /**
   * Gets the path to the exit point.
   * @param maze The solved maze
   * @param exit The exit point
   */
  static getPath(maze, exit) {
    const steps = [p => p.left(), p => p.right(), p => p.up(), p => p.down()];
    const path = [exit.pos];

    let currentState = exit.pos;
    let distance = exit.dist;

    while (distance > 1) {
      for (const step of steps) {
        const posAfter = step(currentState);
        if (!Util.isOutOfBounds(posAfter, maze) && maze[posAfter.x][posAfter.y] === distance - 1) {
          path.push(posAfter);
          currentState = posAfter;
          distance--;
          break;
        }
      }
    }

    return path.reverse();
  }

  static pathDirections(path, playerState) {
    const result = [];
    let currentState = playerState;

    for (let i = 0; i < path.length; i++) {
      const move = currentState.getMoveTo(path[i]);
      if (move.rotation) {
        result.push(move.rotation);
      }
      result.push(MOVE.FORWARD);
      currentState = move.newState;
    }

    return result;
  }
}
