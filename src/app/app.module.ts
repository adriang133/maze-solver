import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight, faAngleDown, faAngleUp, faAngleLeft, faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from './app.component';
import { MazeCellComponent } from './maze-cell/maze-cell.component';
import { MazeComponent } from './maze/maze.component';

library.add(faAngleDown, faAngleLeft, faAngleRight, faAngleUp, faArrowUp, faArrowDown, faArrowLeft, faArrowRight);

@NgModule({
  declarations: [
    AppComponent,
    MazeCellComponent,
    MazeComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
