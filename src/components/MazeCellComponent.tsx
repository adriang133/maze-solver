import * as React from 'react';
import { MazeCell } from '../constants';
import { Icon, SemanticICONS } from 'semantic-ui-react';

interface Props {
  cell: MazeCell;
  highlight: boolean;
}

const MazeCellComponent = (props: Props) => {
  const { cell, highlight } = props;
  const cssClasses = ['maze-cell'];
  let playerIconClass: SemanticICONS;

  switch (cell) {
    case MazeCell.Free: {
      cssClasses.push('free');
      break;
    }
    case MazeCell.Wall: {
      cssClasses.push('wall');
    }
    case MazeCell.PlayerDown: {
      playerIconClass = 'chevron down';
      break;
    }
    case MazeCell.PlayerLeft: {
      playerIconClass = 'chevron left';
      break;
    }
    case MazeCell.PlayerUp: {
      playerIconClass = 'chevron up';
      break;
    }
    case MazeCell.PlayerRight: {
      playerIconClass = 'chevron right';
      break;
    }
  }

  return (
    <div className={cssClasses.join(' ')}>
      {playerIconClass && <Icon name={playerIconClass} />}
    </div>
  );
};

export default MazeCellComponent;
