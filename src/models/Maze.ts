import { MazeCell, Move } from '../constants';
import Point from './Point';
import Player, { Direction } from './Player';

export default class Maze {
  private readonly mazeCellMap = new Map<string, number>([
    ['#', MazeCell.Wall],
    [' ', MazeCell.Free],
    ['^', MazeCell.PlayerUp],
    ['v', MazeCell.PlayerDown],
    ['<', MazeCell.PlayerLeft],
    ['>', MazeCell.PlayerRight]
  ]);

  private maze: MazeCell[][];

  private player: Player;

  public constructor(rawMaze: string[]) {
    const numColumns = rawMaze[0].length;
    if (!rawMaze.every(mazeRowStr => mazeRowStr.length === numColumns)) {
      throw Error('The maze should be of a rectangular shape');
    }

    this.maze = rawMaze.map((mazeRowStr, rowIndex) =>
      Array.from(mazeRowStr).map((mazeChar, colIndex) => {
        const mazeCell = this.mazeCellMap.get(mazeChar);
        if (
          mazeCell === MazeCell.PlayerDown ||
          mazeCell === MazeCell.PlayerUp ||
          mazeCell === MazeCell.PlayerLeft ||
          mazeCell === MazeCell.PlayerRight
        ) {
          if (this.player) {
            throw Error('Multiple players found.');
          }

          this.player = new Player(
            new Point(rowIndex, colIndex),
            this.playerDirection(mazeCell)
          );
        }
        return mazeCell;
      })
    );
  }

  public solve(): Move[] {
    const steps: { (p: Point): Point }[] = [
      p => p.up(),
      p => p.down(),
      p => p.left(),
      p => p.right()
    ];
    const dist: number[][] = this.maze.map(mazeRow =>
      mazeRow.map(cell => Infinity)
    );
    const stack = [this.player.location];
    dist[this.player.location.x][this.player.location.y] = 0;

    while (stack.length > 0) {
      const currentPos = stack.pop();
    }
  }

  private static playerDirection(cell: MazeCell) {
    switch (cell) {
      case MazeCell.PlayerDown:
        return Direction.Down;
      case MazeCell.PlayerLeft:
        return Direction.Left;
      case MazeCell.PlayerRight:
        return Direction.Right;
      case MazeCell.PlayerUp:
        return Direction.Up;
      default:
        throw Error('Invalid maze cell');
    }
  }

  private cellAt(point: Point) {
    if (this.isOutOfBounds(point)) {
      return MazeCell.None;
    }
    return this.maze[point.x][point.y];
  }

  private isOutOfBounds(p: Point) {
    return (
      p.x < 0 ||
      p.x >= this.maze.length ||
      p.y < 0 ||
      p.y >= this.maze[0].length
    );
  }

  private isEdge(p: Point) {
    return (
      p.x === 0 ||
      p.x === this.maze.length - 1 ||
      p.y === 0 ||
      p.y === this.maze[0].length - 1
    );
  }
}
