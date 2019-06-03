import { MazeCell, Move } from '../constants';
import Point from './Point';
import Player, { Direction } from './Player';

export default class Maze {
  private static readonly mazeCellMap = new Map<string, number>([
    ['#', MazeCell.Wall],
    [' ', MazeCell.Free],
    ['^', MazeCell.PlayerUp],
    ['v', MazeCell.PlayerDown],
    ['<', MazeCell.PlayerLeft],
    ['>', MazeCell.PlayerRight]
  ]);

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

  private maze: MazeCell[][];

  private player: Player;

  public static Parse(rawMaze: string[]): Maze {
    const numColumns = rawMaze[0].length;
    if (!rawMaze.every(mazeRowStr => mazeRowStr.length === numColumns)) {
      throw Error('The maze should be of a rectangular shape');
    }
    let player: Player;
    const maze = rawMaze.map((mazeRowStr, rowIndex) =>
      Array.from(mazeRowStr).map((mazeChar, colIndex) => {
        const mazeCell = this.mazeCellMap.get(mazeChar);
        if (
          mazeCell === MazeCell.PlayerDown ||
          mazeCell === MazeCell.PlayerUp ||
          mazeCell === MazeCell.PlayerLeft ||
          mazeCell === MazeCell.PlayerRight
        ) {
          if (player) {
            throw Error('Multiple players found.');
          }

          player = new Player(
            new Point(rowIndex, colIndex),
            this.playerDirection(mazeCell)
          );

          return MazeCell.Free;
        }
        return mazeCell;
      })
    );

    return new Maze(maze, player);
  }

  public constructor(maze: MazeCell[][], player: Player) {
    this.maze = maze;
    this.player = player;
  }

  private pointInFrontOfPlayer(): Point {
    switch (this.player.direction) {
      case Direction.Up:
        return this.player.location.up();
      case Direction.Down:
        return this.player.location.down();
      case Direction.Left:
        return this.player.location.left();
      case Direction.Right:
        return this.player.location.right();
    }
  }

  private playerCell(): MazeCell {
    switch (this.player.direction) {
      case Direction.Up:
        return MazeCell.PlayerUp;
      case Direction.Down:
        return MazeCell.PlayerDown;
      case Direction.Left:
        return MazeCell.PlayerLeft;
      case Direction.Right:
        return MazeCell.PlayerRight;
    }
  }

  public canMoveForward(): boolean {
    return this.cellAt(this.pointInFrontOfPlayer()) === MazeCell.Free;
  }

  public moveForward(): void {
    if (this.canMoveForward()) {
      this.player = new Player(
        this.pointInFrontOfPlayer(),
        this.player.direction
      );
    }
  }

  public cells(): MazeCell[][] {
    return this.maze.map((mazeRow, rowIdx) =>
      mazeRow.map((mazeCell, colIdx) => {
        const cellPos = new Point(rowIdx, colIdx);
        if (cellPos.equals(this.player.location)) {
          return this.playerCell();
        }
        return this.maze[rowIdx][colIdx];
      })
    );
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
}
