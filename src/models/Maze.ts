import { MazeCell } from "../constants";
import Point from "./Point";

export default class Maze {
  readonly mazeCellMap = new Map<string, number>([
    ["#", MazeCell.Wall],
    [" ", MazeCell.Free],
    ["^", MazeCell.PlayerUp],
    ["v", MazeCell.PlayerDown],
    ["<", MazeCell.PlayerLeft],
    [">", MazeCell.PlayerRight]
  ]);
  private maze: MazeCell[][];

  constructor(rawMaze: string[]) {
    const numColumns = rawMaze[0].length;
    if (!rawMaze.every(mazeRowStr => mazeRowStr.length === numColumns)) {
      throw Error("The maze should be of a rectangular shape");
    }

    this.maze = rawMaze.map(mazeRowStr =>
      Array.from(mazeRowStr).map(mazeChar => this.mazeCellMap.get(mazeChar))
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

  private isFree(p: Point) {
    if (this.isOutOfBounds(p)) {
      return false;
    }

    this.cellAt(p) === MazeCell.Free;
  }
}
