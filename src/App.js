import React from 'react';
import { Button, Container, Form, Message, Modal, TextArea } from 'semantic-ui-react';
import Maze from './components/Maze';
import { MAZE_CELL } from './Constants';
import Util from './Util';

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
    const mazeString2 = [
      '#########################################',
      '#<    #       #     #         # #   #   #',
      '##### # ##### # ### # # ##### # # # ### #',
      '# #   #   #   #   #   # #     #   #   # #',
      '# # # ### # ########### # ####### # # # #',
      '#   #   # # #       #   # #   #   # #   #',
      '####### # # # ##### # ### # # # #########',
      '#   #     # #     # #   #   # # #       #',
      '# # ####### ### ### ##### ### # ####### #',
      '# #             #   #     #   #   #   # #',
      '# ############### ### ##### ##### # # # #',
      '#               #     #   #   #   # #   #',
      '##### ####### # ######### # # # ### #####',
      '#   # #   #   # #         # # # #       #',
      '# # # # # # ### # # ####### # # ### ### #',
      '# # #   # # #     #   #     # #     #   #',
      '# # ##### # # ####### # ##### ####### # #',
      '# #     # # # #   # # #     # #       # #',
      '# ##### ### # ### # # ##### # # ### ### #',
      '#     #     #     #   #     #   #   #    ',
      '#########################################',
    ];

    return App.parseMaze(mazeString);
  }

  static parseMaze(mazeRaw) {
    const validMazeCharacters = [
      MAZE_CELL.WALL,
      MAZE_CELL.FREE,
      MAZE_CELL.PLAYER.UP,
      MAZE_CELL.PLAYER.DOWN,
      MAZE_CELL.PLAYER.LEFT,
      MAZE_CELL.PLAYER.RIGHT,
    ];

    if (!Util.isIterable(mazeRaw)) {
      throw new Error('Expected an array of strings');
    }
    const maze = [];
    for (let i = 0; i < mazeRaw.length; i += 1) {
      if (!Util.isIterable(mazeRaw[i])) {
        throw new Error('Expected an array of strings');
      }
      maze.push([]);
      for (let j = 0; j < mazeRaw[i].length; j += 1) {
        if (!validMazeCharacters.includes(mazeRaw[i][j])) {
          throw new Error(`Invalid maze character ${maze[i]}`);
        }
        maze[i].push(mazeRaw[i][j]);
      }
    }
    return maze;
  }

  static parseInput(inputText) {
    const inputObj = JSON.parse(inputText);
    return App.parseMaze(inputObj);
  }

  constructor(props) {
    super(props);
    this.state = {
      mazeInput: null,
      mazeInputError: null,
      maze: null,
      loadMazeModalOpen: true,
    };

    this.onChange = this.onChange.bind(this);
    this.loadMaze = this.loadMaze.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onChange(event) {
    this.setState({
      mazeInput: event.target.value,
    });
  }

  loadMaze() {
    this.setState(prevState => {
      try {
        const parsedInput = App.parseInput(prevState.mazeInput);
        return {
          maze: parsedInput,
          mazeInputError: null,
          loadMazeModalOpen: false,
        };
      } catch (err) {
        return {
          maze: null,
          mazeInputError: err.message,
        };
      }
    });
  }

  closeModal() {
    this.setState({
      loadMazeModalOpen: false,
    });
  }

  renderModal() {
    return (
      <Modal size="large" closeIcon open={this.state.loadMazeModalOpen} onClose={this.closeModal}>
        <Modal.Header>Load maze</Modal.Header>
        <Modal.Content>
          <Message>
            Enter the maze as a JSON array of strings, each string representing a row of the maze.
          </Message>
          <Form>
            <TextArea rows="8" placeholder="['#>     #']" onChange={this.onChange} />
          </Form>
          {this.state.mazeInputError && <Message error>{this.state.mazeInputError}</Message>}
        </Modal.Content>
        <Modal.Actions>
          <Button primary content="Load" onClick={this.loadMaze} />
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    return (
      <Container textAlign="center">
        <Button basic color="blue" onClick={() => this.setState({ loadMazeModalOpen: true })}>
          Load maze
        </Button>
        {this.renderModal()}
        <Maze key={this.state.maze} maze={this.state.maze || App.demoMaze()} />
      </Container>
    );
  }
}

export default App;
