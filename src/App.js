import React from 'react';
import Maze from './components/Maze';

class App extends React.Component {
  static demoMaze() {
    const mazeString = [
      '##########',
      '#        #',
      '#  ##### #',
      '#  #   # #',
      '#  #^# # #',
      '#  ### # #',
      '#      # #',
      '######## #',
    ];
    const maze = [];
    for (let i = 0; i < mazeString.length; i += 1) {
      maze.push([]);
      for (let j = 0; j < mazeString[i].length; j += 1) {
        maze[i].push(mazeString[i][j]);
      }
    }
    return maze;
  }

  render() {
    return <Maze maze={App.demoMaze()} />;
  }
}

export default App;
