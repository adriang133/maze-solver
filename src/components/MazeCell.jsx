import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { MAZE_CELL } from '../Constants';

class MazeCell extends React.Component {
  cssClass() {
    const classes = ['maze-cell'];
    switch (this.props.value) {
      case MAZE_CELL.FREE:
        classes.push('free');
        break;
      case MAZE_CELL.WALL:
        classes.push('wall');
        break;
      case MAZE_CELL.PATH:
        classes.push('highlight');
        break;
      default:
        classes.push('player');
        break;
    }
    return classes.join(' ');
  }

  playerIcon() {
    switch (this.props.value) {
      case MAZE_CELL.PLAYER.LEFT:
        return <Icon name="chevron left" />;
      case MAZE_CELL.PLAYER.RIGHT:
        return <Icon name="chevron right" />;
      case MAZE_CELL.PLAYER.UP:
        return <Icon name="chevron up" />;
      case MAZE_CELL.PLAYER.DOWN:
        return <Icon name="chevron down" />;
      default:
        return null;
    }
  }

  render() {
    return <div className={this.cssClass()}>{this.playerIcon()}</div>;
  }
}

MazeCell.propTypes = {
  value: PropTypes.string.isRequired,
};

export default MazeCell;
