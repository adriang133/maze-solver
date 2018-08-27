import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-maze-cell',
  templateUrl: './maze-cell.component.html',
  styleUrls: ['./maze-cell.component.css']
})
export class MazeCellComponent implements OnInit {
  @Input() cellType: string;

  constructor() { }

  ngOnInit() {
  }

  public cellClass(): string {
    switch (this.cellType) {
      case ' ': return 'free';
      case '#': return 'wall';
      default: return 'player';
    }
  }

  public playerIcon(): string {
    switch (this.cellType) {
      case '<': return 'angle-left';
      case '>': return 'angle-right';
      case '^': return 'angle-up';
      case 'v': return 'angle-down';
    }
  }

}
