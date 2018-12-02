/* eslint no-param-reassign: off */
import { MAZE_CELL, MOVE } from './Constants';
import Point from './models/Point';
import PlayerState from './models/PlayerState';

export default class Util {
  /**
   * Returns true if p is a valid point within the maze boundaries, false otherwise
   * @param {Point} p
   * @param {Array<Array<string>>} maze
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

  static isIterable(obj) {
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

  /**
   * Deep copies an object by serializing and deserializing it
   * @param {Object} obj
   */
  static deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Whether p is free
   * @param {Point} p
   * @param {Array<Array<string>>} maze
   */
  static isFree(p, maze) {
    if (Util.isOutOfBounds(p, maze)) {
      return false;
    }
    return maze[p.x][p.y] === MAZE_CELL.FREE || maze[p.x][p.y] === MAZE_CELL.PATH;
  }

  /**
   * Whether p is a wall or not
   * @param {Point} p
   * @param {Array<Array<string>>} maze
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
   * @param {Array<Array<string>>} maze
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
   * @param {Array<Array<string>>} maze
   */
  static isPlayer(p, maze) {
    if (Util.isOutOfBounds(p, maze)) {
      return false;
    }
    return !Util.isFree(p, maze) && !Util.isWall(p, maze);
  }

  /**
   * Returns the player's state in the maze (PlayerState object)
   * @param {Array<Array<string>>} maze A two-dimensional array representing the maze
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

  /**
   * Returns a new maze with the updated player state
   * @param {Array<Array<string>>} maze
   * @param {PlayerState} oldPlayerState
   * @param {PlayerState} newPlayerState
   * @returns {Array<Array<string>>} A new maze
   */
  static mazeWithUpdatedPlayerState(maze, oldPlayerState, newPlayerState) {
    const mazeCopy = Util.deepCopy(maze);
    mazeCopy[oldPlayerState.location.x][oldPlayerState.location.y] = MAZE_CELL.FREE;
    mazeCopy[newPlayerState.location.x][newPlayerState.location.y] = newPlayerState.direction;
    return mazeCopy;
  }

  /**
   * Gets the path to the exit point.
   * @param {Array<Array<string>>} maze The solved maze
   * @param {Point} exit The exit point
   * @returns {Array<Point>} The path to the exit, as an array of cells
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

  /**
   * Gets the readable directions for the path
   * @param {Array<Point>} path
   * @param {PlayerState} playerState
   */
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

  /**
   * Gets compact pact directions, eg replacing FFF with F(3)
   * @param {Array<Point>} path
   * @param {PlayerState} playerState
   */
  static compactPathDirections(path, playerState) {
    const pathDirections = Util.pathDirections(path, playerState);
    const compact = [];
    for (const step of pathDirections) {
      if (compact.length > 0 && compact[compact.length - 1].value === step) {
        compact[compact.length - 1].count += 1;
      } else {
        compact.push({ value: step, count: 1 });
      }
    }
    return compact;
  }

  /**
   * Sets all the cells on a path to a certain value
   * @param {Array<Array<string>>} maze
   * @param {Array<Point>} path
   * @param {String} value A MAZE_CELL value
   * @returns {Array<Array<string>>} A new maze
   */
  static _mazeWithValueOnPath(maze, path, value) {
    const _maze = Util.deepCopy(maze);
    for (const step of path) {
      _maze[step.x][step.y] = value;
    }
    return _maze;
  }

  /**
   * Sets all the cells on a path to be highlights
   * @param {Array<Array<string>>} maze
   * @param {Array<Point>} path
   */
  static mazeWithHighlightedPath(maze, path) {
    return this._mazeWithValueOnPath(maze, path, MAZE_CELL.PATH);
  }

  /**
   * Sets all the cells on a path to FREE
   * @param {Array<Array<string>>} maze
   * @param {Array<Point>} path
   */
  static mazeWithClearedHighlightedPath(maze, path) {
    return this._mazeWithValueOnPath(maze, path, MAZE_CELL.FREE);
  }
}
