import React from 'react';
import Maze from './components/Maze';
import { Button, Container, Header, Modal, Input } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mazeInput: null
    }

    this.onChange = this.onChange.bind(this);
  }
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
      "#########################################",
      "#<    #       #     #         # #   #   #",
      "##### # ##### # ### # # ##### # # # ### #",
      "# #   #   #   #   #   # #     #   #   # #",
      "# # # ### # ########### # ####### # # # #",
      "#   #   # # #       #   # #   #   # #   #",
      "####### # # # ##### # ### # # # #########",
      "#   #     # #     # #   #   # # #       #",
      "# # ####### ### ### ##### ### # ####### #",
      "# #             #   #     #   #   #   # #",
      "# ############### ### ##### ##### # # # #",
      "#               #     #   #   #   # #   #",
      "##### ####### # ######### # # # ### #####",
      "#   # #   #   # #         # # # #       #",
      "# # # # # # ### # # ####### # # ### ### #",
      "# # #   # # #     #   #     # #     #   #",
      "# # ##### # # ####### # ##### ####### # #",
      "# #     # # # #   # # #     # #       # #",
      "# ##### ### # ### # # ##### # # ### ### #",
      "#     #     #     #   #     #   #   #    ",
      "#########################################"
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

  onChange(event) { 
    this.setState({
      mazeInput: this.event.target.value
    })
  }

  renderModal() {
    return (<Modal trigger={<Button>Show Modal</Button>}>
      <Modal.Header>Load maze</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Load your own maze as text</Header>
          <Input onChange={this.onChange}></Input>
        </Modal.Description>
      </Modal.Content>
    </Modal>);
  }

  render() {
    return (
      <Container>
        {this.renderModal()}
        <Maze maze={App.demoMaze()} />;
      </Container>
    );
  }
}

export default App;
