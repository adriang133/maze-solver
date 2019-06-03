import { MazeCell, Move } from '../constants';
import Player from '../models/Player';

export default interface IMazeSolver {
  solve: { (): Move[] };
}
