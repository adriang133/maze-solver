export enum MazeCell {
  None,
  Wall,
  Free,
  PlayerUp,
  PlayerDown,
  PlayerLeft,
  PlayerRight
}

export enum Move {
  Forward = 'F',
  RotateLeft = 'L',
  RotateRight = 'R',
  RotateBack = 'B'
}
