import IMazeSolver from '../interfaces/IMazeSolver';
import { MazeCell, Move } from '../constants';
import Point from '../models/Point';
import Player, { Direction } from '../models/Player';

export default class BreadthFirstSolver implements IMazeSolver {
  private maze: MazeCell[][];
  private player: Player;

  public constructor(maze: MazeCell[][], player: Player) {
    this.maze = maze;
    this.player = player;
  }

  private orderedSteps() {
    const steps: { (p: Point): Point }[] = [
      p => p.up(),
      p => p.down(),
      p => p.left(),
      p => p.right()
    ];

    switch (this.player.direction) {
      case Direction.Down: {
        [steps[0], steps[1]] = [steps[1], steps[0]];
        break;
      }
      case Direction.Left: {
        [steps[0], steps[2]] = [steps[2], steps[0]];
        break;
      }
      case Direction.Right: {
        [steps[0], steps[3]] = [steps[3], steps[0]];
        break;
      }
      case Direction.Up:
        break;
    }

    return steps;
  }

  private buildDistances(): number[][] {
    const steps = this.orderedSteps();
    const dist: number[][] = this.maze.map(mazeRow =>
      mazeRow.map(cell => Infinity)
    );
    const stack = [new StackItem(this.player.location, 0)];
    dist[this.player.location.x][this.player.location.y] = 0;

    while (stack.length > 0) {
      const { pos, dist: prevDist } = stack.pop();
      for (let step of steps) {
        const nextPos = step(pos);
        if (dist[nextPos.x][nextPos.y] > prevDist + 1) {
          dist[nextPos.x][nextPos.y] = prevDist + 1;
          stack.push(new StackItem(nextPos, prevDist + 1));
        }
      }
    }

    return dist;
  }

  private getExitPoint(distances: number[][]): Point {
    const [numRows, numCols] = [distances.length, distances[0].length];
    let minDistToExit = Infinity;
    let exitPoint: Point = null;

    for (let col = 0; col < numCols; col++) {
      if (distances[0][col] < minDistToExit) {
        minDistToExit = distances[0][col];
        exitPoint = new Point(0, col);
      }
      if (distances[numRows - 1][col] < minDistToExit) {
        minDistToExit = distances[numRows - 1][col];
        exitPoint = new Point(numRows - 1, col);
      }
    }

    for (let row = 0; row < numRows; row++) {
      if (distances[row][0] < minDistToExit) {
        minDistToExit = distances[row][0];
        exitPoint = new Point(row, 0);
      }
      if (distances[row][numCols - 1] < minDistToExit) {
        minDistToExit = distances[row][numCols - 1];
        exitPoint = new Point(row, numCols - 1);
      }
    }

    return exitPoint;
  }

  private getNextPosOnPath(distances: number[][], currentPos: Point): Point {
    const steps = this.orderedSteps();
    const currentPosDist = distances[currentPos.x][currentPos.y];
    for (let step of steps) {
      const nextPos = step(currentPos);
      const nextPosDist = distances[nextPos.x][nextPos.y];
      if (nextPosDist === currentPosDist - 1) {
        return nextPos;
      }
    }

    throw new Error('Invalid distances[] or exit point');
  }

  /**
   * @param player The current player position/direction
   * @param nextPos The next position (has to be adjacent to the player's location)
   */
  private moveTo(player: Player, nextPos: Point): [Player, Move[]] {
    let moves: Move[];
    let nextPlayerDirection: Direction;

    if (nextPos.equals(player.location.left())) {
      nextPlayerDirection = Direction.Left;
      switch (player.direction) {
        case Direction.Left:
          moves = [Move.Forward];
        case Direction.Right:
          moves = [Move.RotateBack, Move.Forward];
        case Direction.Down:
          moves = [Move.RotateRight, Move.Forward];
        case Direction.Up:
          moves = [Move.RotateLeft, Move.Forward];
      }
    }
    if (nextPos.equals(player.location.right())) {
      nextPlayerDirection = Direction.Right;
      switch (player.direction) {
        case Direction.Left:
          moves = [Move.RotateBack, Move.Forward];
        case Direction.Right:
          moves = [Move.Forward];
        case Direction.Down:
          moves = [Move.RotateLeft, Move.Forward];
        case Direction.Up:
          moves = [Move.RotateRight, Move.Forward];
      }
    }
    if (nextPos.equals(player.location.up())) {
      nextPlayerDirection = Direction.Up;
      switch (player.direction) {
        case Direction.Left:
          moves = [Move.RotateRight, Move.Forward];
        case Direction.Right:
          moves = [Move.RotateLeft, Move.Forward];
        case Direction.Down:
          moves = [Move.RotateBack, Move.Forward];
        case Direction.Up:
          moves = [Move.Forward];
      }
    }
    if (nextPos.equals(player.location.down())) {
      nextPlayerDirection = Direction.Down;
      switch (player.direction) {
        case Direction.Left:
          moves = [Move.RotateLeft, Move.Forward];
        case Direction.Right:
          moves = [Move.RotateRight, Move.Forward];
        case Direction.Down:
          moves = [Move.Forward];
        case Direction.Up:
          moves = [Move.RotateBack, Move.Forward];
      }
    }

    return [new Player(nextPos, nextPlayerDirection), moves];
  }

  private getMovesToExit(distances: number[][], exitPoint: Point): Move[] {
    let currentPos = exitPoint;
    const path: Point[] = [];

    while (!currentPos.equals(this.player.location)) {
      path.push(currentPos);
      currentPos = this.getNextPosOnPath(distances, currentPos);
    }

    path.reverse();
    let currentPlayerPos = this.player;
    const movesToExit: Move[] = [];

    for (let point of path) {
      const [nextPlayerPos, moves] = this.moveTo(currentPlayerPos, point);
      movesToExit.push(...moves);
      currentPlayerPos = nextPlayerPos;
    }

    return movesToExit;
  }

  public solve(): Move[] {
    const distances = this.buildDistances();
    const exitPoint = this.getExitPoint(distances);
    if (!exitPoint) {
      throw Error('The maze has no solution!');
    }

    return this.getMovesToExit(distances, exitPoint);
  }
}

class StackItem {
  public pos: Point;
  public dist: number;

  public constructor(position: Point, dist: number) {
    this.pos = position;
    this.dist = dist;
  }
}
