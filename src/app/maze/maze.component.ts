import { Component, OnInit, Input, HostListener } from '@angular/core';

const PLAYER_LEFT = '<';
const PLAYER_RIGHT = '>';
const PLAYER_UP = '^';
const PLAYER_DOWN = 'v';
const WALL = '#';
const FREE = ' ';
const ROTATE_BACK = 'B';
const ROTATE_LEFT = 'L';
const ROTATE_RIGHT = 'R';
const MOVE_FORWARD = 'F';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {
  @Input()
  mazeString: string[];


  private mazeSolution: string[];
  private solved: boolean;
  private playing: boolean;
  private playerPos: Point;
  public maze: any[];

  constructor() {
    this.playerPos = new Point(-1, -1);
    this.solved = false;
    this.playing = false;
   }

  ngOnInit() {
    this.maze = [];

    for (let i = 0; i < this.mazeString.length; i++) {
      this.maze[i] = [];
      for (let j = 0; j < this.mazeString[i].length; j++) {
        this.maze[i].push(this.mazeString[i][j]);
        const p = new Point(i, j);
        if (this.isPlayer(p)) {
          this.playerPos = p;
        }
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.playing) {
      return;
    }
    switch(event.code) {
      case 'ArrowUp': this.moveForward(true); break;
      case 'ArrowLeft': this.rotateLeft(true); break;
      case 'ArrowRight': this.rotateRight(true); break;
      case 'ArrowDown': this.rotateBack(true); break;
    }
  }

  public updateSolution(): void {
    this.mazeSolution = this.getPath();
    this.clearMaze();
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public async playSolution() {
    this.solved = false;
    this.playing = true;
    for(let move of this.mazeSolution) {
      this.playMove(move);
      await this.delay(500);
    }
    this.playing = false;
  }

  public playMove(move: string): void {
    switch(move) {
      case MOVE_FORWARD: this.moveForward(); break;
      case ROTATE_BACK: this.rotateBack(); break;
      case ROTATE_LEFT: this.rotateLeft(); break;
      case ROTATE_RIGHT: this.rotateRight(); break;
    }
  }

  private isFree(p: Point): boolean {
    if (this.isOutOfBounds(p)) {
      return false;
    }
    return this.maze[p.x][p.y] === FREE;
  }

  private isWall(p: Point): boolean {
    if (this.isOutOfBounds(p)) {
      return false;
    }
    return this.maze[p.x][p.y] === WALL;
  }

  private isExit(p: Point): boolean {
    if (this.isOutOfBounds(p)) {
      return false;
    }
    return p.x === 0 || p.y === 0 || p.x === this.maze.length - 1 || p.y === this.maze[0].length - 1;
  }

  private isPlayer(p: Point): boolean {
    if (this.isOutOfBounds(p)) {
      return false;
    }
    return !this.isFree(p) && !this.isWall(p);
  }

  private isOutOfBounds(p: Point): boolean {
    return p.x < 0 || p.x >= this.maze.length || p.y < 0 || p.y >=this.maze[0].length;
  }

  private moveForward(userAction: boolean = false): void {
    let targetCell: Point;
    const state = this.maze[this.playerPos.x][this.playerPos.y];
    
    switch(state) {
      case PLAYER_LEFT: targetCell = this.left(this.playerPos); break;
      case PLAYER_RIGHT: targetCell = this.right(this.playerPos); break;
      case PLAYER_DOWN: targetCell = this.down(this.playerPos); break;
      case PLAYER_UP: targetCell = this.up(this.playerPos); break;
    }

    if (this.isFree(targetCell)) {
      this.maze[targetCell.x][targetCell.y] = state;
      this.maze[this.playerPos.x][this.playerPos.y] = FREE;
      this.playerPos = targetCell;
    }

    if(userAction) {
      this.solved = false;
    }
  }

  private rotateLeft(userAction: boolean = false): void {
    const state = this.maze[this.playerPos.x][this.playerPos.y];
    switch(state) {
      case PLAYER_LEFT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_DOWN; break;
      case PLAYER_RIGHT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_UP; break;
      case PLAYER_DOWN: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_RIGHT; break;
      case PLAYER_UP: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_LEFT; break;
    }

    if(userAction) {
      this.solved = false;
    }
  }

  private rotateRight(userAction: boolean = false): void {
    const state = this.maze[this.playerPos.x][this.playerPos.y];
    switch(state) {
      case PLAYER_LEFT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_UP; break;
      case PLAYER_RIGHT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_DOWN; break;
      case PLAYER_DOWN: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_LEFT; break;
      case PLAYER_UP: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_RIGHT; break;
    }

    if(userAction) {
      this.solved = false;
    }
  }

  private rotateBack(userAction: boolean = false): void {
    this.rotateLeft(userAction);
    this.rotateLeft(userAction);
  }

  private left(p: Point): Point {
    return new Point(p.x, p.y - 1);
  } 

  private right(p: Point): Point {
    return new Point(p.x, p.y + 1);
  }

  private up(p: Point): Point {
    return new Point(p.x - 1, p.y);
  }

  private down(p: Point): Point {
    return new Point(p.x + 1, p.y);
  }

  /**
   * Solves the maze and returns the exit point
   */
  private solveMaze(): StackItem {
    const steps = [this.left, this.right, this.up, this.down];
    const stack: StackItem[] = [new StackItem(this.playerPos, 0)];
    let exit: StackItem = new StackItem(new Point(-1, -1), Infinity);

    //let clone = JSON.parse(JSON.stringify(this.maze));

    let state = this.maze[this.playerPos.x][this.playerPos.y];
    switch(state) {
      case PLAYER_RIGHT: this.swap(steps[1], steps[0]); break;
      case PLAYER_DOWN: this.swap(steps[3], steps[0]); break;
      case PLAYER_UP: this.swap(steps[2], steps[0]); break;
    }

    while(stack.length > 0) {
      const si = stack.pop();
      for(let step of steps) {
        const posAfter = step(si.pos);
        if(this.isOutOfBounds(posAfter)) continue;

        const block = this.maze[posAfter.x][posAfter.y];
        if(this.isFree(posAfter) || (typeof(block) === 'number' && block > si.dist + 1) ) {
          stack.push(new StackItem(posAfter, si.dist + 1));
          this.maze[posAfter.x][posAfter.y] = si.dist + 1;
          if(this.isExit(posAfter) && si.dist + 1 < exit.dist){
            exit.pos = posAfter;
            exit.dist = si.dist + 1;
          }
        }
      }
    }

    return exit;
  }

  /**
   * Gets an array of characters corresponding to the directions to the exit. If there is no exit returns an empty array
   */
  private getPath(): string[] {
    const exit = this.solveMaze();
    if(exit.dist === Infinity) {
      this.solved = false;
      if(this.isExit(this.playerPos)) {
        return ["You are already at the exit"];
      }
      return ["There is no solution for this maze."];
    }
    this.solved = true;

    const steps = [this.left, this.right, this.up, this.down];
    const path = [exit.pos];
    let result = [];

    let currentPos = exit.pos;
    let distance = exit.dist;

    while (distance > 1) {
      for (let step of steps) {
        const posAfter = step(currentPos);
        if(!this.isOutOfBounds(posAfter) && this.maze[posAfter.x][posAfter.y] === distance - 1) {
          path.push(posAfter);
          currentPos = posAfter;
          distance--;
          break;
        }
      }
    }
    
    currentPos = this.playerPos;
    let state = this.maze[this.playerPos.x][this.playerPos.y];

    for(let i = path.length - 1; i >= 0; i--) {
      const r = this.rotate(currentPos, path[i], state);
      if(r[0]) {
        result.push(r[0]);
      }
      state = r[1];
      result.push(MOVE_FORWARD);
      currentPos = path[i];
    }

    return result;
  }

  private clearMaze(): void {
    for(let i = 0; i < this.maze.length; i++) {
      for (let j = 0; j < this.maze[i].length; j++) {
        if(typeof(this.maze[i][j]) === 'number') {
          this.maze[i][j] = FREE;
        }
      }
    }
  }

  private rotate(from: Point, to: Point, state: string): string[] {
    let rotation;
    let stateAfterRotation = state;

    if (to.equals(this.left(from))) {
      stateAfterRotation = PLAYER_LEFT;
      switch(state) {
        case PLAYER_RIGHT: rotation = ROTATE_BACK; break;
        case PLAYER_DOWN: rotation = ROTATE_RIGHT; break;
        case PLAYER_UP: rotation = ROTATE_LEFT; break;
      }
    }
    else if (to.equals(this.right(from))) {
      stateAfterRotation = PLAYER_RIGHT;
      switch(state) {
        case PLAYER_LEFT: rotation = ROTATE_BACK; break;
        case PLAYER_DOWN: rotation = ROTATE_LEFT; break;
        case PLAYER_UP: rotation = ROTATE_RIGHT; break;
      }
    }
    else if (to.equals(this.up(from))) {
      stateAfterRotation = PLAYER_UP;
      switch(state) {
        case PLAYER_LEFT: rotation = ROTATE_RIGHT; break;
        case PLAYER_DOWN: rotation = ROTATE_BACK; break;
        case PLAYER_RIGHT: rotation = ROTATE_LEFT; break;
      }
    }
    else if (to.equals(this.down(from))) {
      stateAfterRotation = PLAYER_DOWN;
      switch(state) {
        case PLAYER_LEFT: rotation = ROTATE_LEFT; break;
        case PLAYER_UP: rotation = ROTATE_BACK; break;
        case PLAYER_RIGHT: rotation = ROTATE_RIGHT; break;
      }
    }

    return [rotation, stateAfterRotation];
  }

  private swap(a: object, b: object): void {
    const tmp = b;
    b = a;
    a = tmp;
  }
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public equals(other: Point) {
    return this.x === other.x && this.y === other.y;
  }
}

class StackItem {
  pos: Point;
  dist: number;

  constructor(pos: Point, dist: number) {
    this.pos = pos;
    this.dist = dist;
  }
}
