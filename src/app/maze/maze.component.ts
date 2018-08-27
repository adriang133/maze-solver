import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-maze',
  templateUrl: './maze.component.html',
  styleUrls: ['./maze.component.css']
})
export class MazeComponent implements OnInit {
  @Input()
  mazeString: string[];

  public maze: any[];

  constructor() { }

  ngOnInit() {
    this.maze = [];

    for (let i = 0; i < this.mazeString.length; i++) {
      this.maze[i] = [];
      for (const character of this.mazeString[i]) {
        this.maze[i].push(character);
      }
    }
  }

}
