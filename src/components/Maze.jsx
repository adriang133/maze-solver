import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Divider, Message } from 'semantic-ui-react';
import MazeCell from './MazeCell';
import Point from '../models/Point';
import StackItem from '../models/StackItem';
import { MAZE_CELL } from '../constants';
import Util from '../util';

class Maze extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maze: props.maze,
      player: Util.getPlayerState(props.maze),
      solved: false,
      solution: null,
      error: null,
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.solveMaze = this.solveMaze.bind(this);
    this.handleSolveMaze = this.handleSolveMaze.bind(this);
    this.renderError = this.renderError.bind(this);
    this.renderSolution = this.renderSolution.bind(this);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  static renderRow(row, i) {
    return (
      <div className="maze-row" key={i}>
        {row.map((cell, j) => (
          <MazeCell value={cell} key={`${i}-${j}`} />
        ))}
      </div>
    );
  }

  /**
   * Changes the player state
   * @param {PlayerState} newPlayerState
   */
  setNewPlayerState(newPlayerState) {
    this.setState(prevState => {
      let stillSolved = false;
      let newSolution = [];
      if (newPlayerState.location.equals(prevState.player.location)) {
        stillSolved = true;
        newSolution = prevState.solution;
      } else if (prevState.solution && newPlayerState.location.equals(prevState.solution[0])) {
        stillSolved = true;
        newSolution = prevState.solution.slice(1);
      }
      return {
        maze: Util.mazeWithUpdatedPlayerState(prevState.maze, prevState.player, newPlayerState),
        player: newPlayerState,
        solved: stillSolved,
        solution: newSolution,
      };
    });
  }

  /**
   * Moves the player forward one square in the direction they are facing, if the target cell is free
   */
  moveForward() {
    const targetCell = this.state.player.forwardLocation();

    if (Util.isFree(targetCell, this.state.maze)) {
      this.setNewPlayerState(this.state.player.moveForward());
    }
  }

  rotateRight() {
    this.setNewPlayerState(this.state.player.rotateRight());
  }

  rotateLeft() {
    this.setNewPlayerState(this.state.player.rotateLeft());
  }

  rotateBack() {
    this.setNewPlayerState(this.state.player.rotateBack());
  }

  /**
   * Solves the maze and returns the path to the exit
   */
  solveMaze() {
    const steps = [p => p.left(), p => p.right(), p => p.up(), p => p.down()];
    const stack = [new StackItem(this.state.player.location, 0)];
    const exit = new StackItem(new Point(-1, -1), Infinity);

    const _maze = Util.deepCopy(this.state.maze);

    switch (this.state.player.direction) {
      case MAZE_CELL.PLAYER.RIGHT:
        Util.swap(steps[1], steps[0]);
        break;
      case MAZE_CELL.PLAYER.DOWN:
        Util.swap(steps[3], steps[0]);
        break;
      case MAZE_CELL.PLAYER.UP:
        Util.swap(steps[2], steps[0]);
        break;
      default:
        break;
    }

    while (stack.length > 0) {
      const si = stack.pop();
      for (const step of steps) {
        const posAfter = step(si.pos);
        if (Util.isOutOfBounds(posAfter, _maze)) continue;

        const block = _maze[posAfter.x][posAfter.y];
        if (Util.isFree(posAfter, _maze) || (typeof block === 'number' && block > si.dist + 1)) {
          stack.push(new StackItem(posAfter, si.dist + 1));
          _maze[posAfter.x][posAfter.y] = si.dist + 1;
          if (Util.isExit(posAfter, _maze) && si.dist + 1 < exit.dist) {
            exit.pos = posAfter;
            exit.dist = si.dist + 1;
          }
        }
      }
    }

    if (exit.dist === Infinity) {
      return null;
    }

    return Util.getPath(_maze, exit);
  }

  handleKeyPress(event) {
    switch (event.code) {
      case 'ArrowUp':
        this.moveForward();
        break;
      case 'ArrowLeft':
        this.rotateLeft();
        break;
      case 'ArrowRight':
        this.rotateRight();
        break;
      case 'ArrowDown':
        this.rotateBack();
        break;
      default:
        break;
    }
  }

  handleSolveMaze() {
    const path = this.solveMaze();
    if (!path) {
      this.setState({
        solved: false,
        error: 'There is no way out :(',
      });
    } else {
      this.setState({
        solved: true,
        solution: path,
      });
    }
  }

  renderError() {
    if (!this.state.error) {
      return null;
    }
    return <Message error>{this.state.error}</Message>;
  }

  renderSolution() {
    if (!this.state.solved) {
      return null;
    }
    return <Message info>{Util.pathDirections(this.state.solution, this.state.player)}</Message>;
  }

  render() {
    return (
      <Container>
        <Container>{this.state.maze.map((row, i) => Maze.renderRow(row, i))}</Container>
        <Divider hidden />
        <Container>
          <Button onClick={this.handleSolveMaze} disabled={this.state.solved}>
            Solve maze
          </Button>
        </Container>
        {this.renderSolution()}
        {this.renderError()}
      </Container>
    );
  }
}

Maze.propTypes = {
  maze: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default Maze;
