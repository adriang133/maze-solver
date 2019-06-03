import * as React from 'react';
import Maze from '../models/Maze';
import IMazeSolver from '../interfaces/IMazeSolver';

interface Props {
  maze: Maze;
  solver: IMazeSolver;
}

interface State {
  maze: Maze;
}

export default class MazeComponent extends React.Component<Props, State> {
  private solver: IMazeSolver;

  constructor(props: Props) {
    super(props);

    this.solver = props.solver;

    this.state = {
      maze: props.maze
    };
  }

  render() {
    const { maze } = this.state;

    return <div />;
  }
}
