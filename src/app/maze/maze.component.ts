import { Component, OnInit, Input, HostListener } from '@angular/core';

const PLAYER_LEFT = '<';
const PLAYER_RIGHT = '>';
const PLAYER_UP = '^';
const PLAYER_DOWN = 'v';
const WALL = '#';
const FREE = ' ';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {
  @Input()
  mazeString: string[];



  private playerPos: Point;
  public maze: any[];

  constructor() {
    this.playerPos = new Point(-1, -1);
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
    switch(event.code) {
      case 'ArrowUp': this.moveForward(); break;
      case 'ArrowLeft': this.rotateLeft(); break;
      case 'ArrowRight': this.rotateRight(); break;
      case 'ArrowDown': this.rotateBack(); break;
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

  private isPlayer(p: Point): boolean {
    if (this.isOutOfBounds(p)) {
      return false;
    }
    return !this.isFree(p) && !this.isWall(p);
  }

  private isOutOfBounds(p: Point): boolean {
    return p.x < 0 || p.x >= this.maze.length || p.y < 0 || p.y >=this.maze[0].length;
  }

  private moveForward(): void {
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
  }

  private rotateLeft(): void {
    const state = this.maze[this.playerPos.x][this.playerPos.y];
    switch(state) {
      case PLAYER_LEFT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_DOWN; break;
      case PLAYER_RIGHT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_UP; break;
      case PLAYER_DOWN: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_RIGHT; break;
      case PLAYER_UP: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_LEFT; break;
    }
  }

  private rotateRight(): void {
    const state = this.maze[this.playerPos.x][this.playerPos.y];
    switch(state) {
      case PLAYER_LEFT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_UP; break;
      case PLAYER_RIGHT: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_DOWN; break;
      case PLAYER_DOWN: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_LEFT; break;
      case PLAYER_UP: this.maze[this.playerPos.x][this.playerPos.y] = PLAYER_RIGHT; break;
    }
  }

  private rotateBack(): void {
    this.rotateLeft();
    this.rotateLeft();
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
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
