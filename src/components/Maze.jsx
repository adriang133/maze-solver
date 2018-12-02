import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Divider, Icon, Label, Message, Modal } from 'semantic-ui-react';
import MazeCell from './MazeCell';
import Point from '../models/Point';
import StackItem from '../models/StackItem';
import { MAZE_CELL } from '../Constants';
import Util from '../Util';

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
    this.renderSolution = this.renderSolutionModal.bind(this);
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
      let newMaze = Util.mazeWithUpdatedPlayerState(
        prevState.maze,
        prevState.player,
        newPlayerState
      );
      if (newPlayerState.location.equals(prevState.player.location)) {
        stillSolved = prevState.solved;
        newSolution = prevState.solution;
      } else if (prevState.solution) {
        if (newPlayerState.location.equals(prevState.solution[0])) {
          stillSolved = true;
          newSolution = prevState.solution.slice(1);
        } else {
          stillSolved = false;
          newSolution = null;
          newMaze = Util.mazeWithClearedHighlightedPath(newMaze, prevState.solution);
        }
      }
      return {
        maze: newMaze,
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
      this.setState(prevState => ({
        solved: true,
        solution: path,
        maze: Util.mazeWithHighlightedPath(prevState.maze, path),
      }));
    }
  }

  renderError() {
    if (!this.state.error) {
      return null;
    }
    return <Message error>{this.state.error}</Message>;
  }

  renderSolutionModal() {
    if (!this.state.solved) {
      return null;
    }
    const directions = Util.compactPathDirections(this.state.solution, this.state.player);
    return (
      <Modal size="large" trigger={<Button>View directions</Button>}>
        <Modal.Header>
          Maze solution directions
          {'   '}
          <Label>
            F<Label.Detail>Move forward</Label.Detail>
          </Label>
          <Label>
            L<Label.Detail>Rotate left</Label.Detail>
          </Label>
          <Label>
            R<Label.Detail>Rotate right</Label.Detail>
          </Label>
          <Label>
            B<Label.Detail>Rotate 180°</Label.Detail>
          </Label>
        </Modal.Header>
        <Modal.Content>
          <Button labelPosition="right">
            <Label basic color="blue">
              {directions[0].value}({directions[0].count})
            </Label>
            {directions.slice(1).map(step => (
              <Label basic color="blue" pointing="left">
                {step.value}({step.count})
              </Label>
            ))}
          </Button>
        </Modal.Content>
      </Modal>
    );
  }

  static renderControls() {
    return (
      <Container className="controls-container" textAlign="center">
        <Label>
          <Icon name="arrow alternate circle up" />
          <Label.Detail>Move forward</Label.Detail>
        </Label>
        <Label>
          <Icon name="arrow alternate circle left" />
          <Label.Detail>Rotate left</Label.Detail>
        </Label>
        <Label>
          <Icon name="arrow alternate circle right" />
          <Label.Detail>Rotate right</Label.Detail>
        </Label>
        <Label>
          <Icon name="arrow alternate circle down" />
          <Label.Detail>Rotate 180 degrees</Label.Detail>
        </Label>
      </Container>
    );
  }

  render() {
    return (
      <Container>
        <Container textAlign="center">{Maze.renderControls()}</Container>
        <Container>{this.state.maze.map((row, i) => Maze.renderRow(row, i))}</Container>
        <Divider hidden />
        <Container textAlign="center">
          {!this.state.solved && (
            <Button color="green" onClick={this.handleSolveMaze}>
              Solve maze
            </Button>
          )}
          {this.renderSolutionModal()}
          {this.renderError()}
        </Container>
      </Container>
    );
  }
}

Maze.propTypes = {
  maze: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default Maze;
