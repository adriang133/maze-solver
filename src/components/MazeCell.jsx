import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

class MazeCell extends React.Component {
  cssClass() {
    const classes = ['maze-cell'];
    switch (this.props.value) {
      case ' ':
        classes.push('free');
        break;
      case '#':
        classes.push('wall');
        break;
      default:
        classes.push('player');
        break;
    }
    return classes.join(' ');
  }

  playerIcon() {
    switch (this.props.value) {
      case '<':
        return <Icon name="chevron left" size="big" />;
      // return <FontAwesomeIcon icon={faAngleLeft} />;
      case '>':
        return <Icon name="chevron right" size="big" />;
      // return <FontAwesomeIcon icon={faAngleRight} />;
      case '^':
        return <Icon name="chevron up" size="big" />;
      // return <FontAwesomeIcon icon={faAngleUp} />;
      case 'v':
        return <Icon name="chevron down" size="big" />;
      // return <FontAwesomeIcon icon={faAngleDown} />;
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
