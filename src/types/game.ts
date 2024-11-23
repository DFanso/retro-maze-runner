export type Position = {
  x: number;
  y: number;
};

export type Direction = {
  x: number;
  y: number;
};

export type Ghost = {
  position: Position;
  previousPosition: Position;
  direction: Direction;
  color: string;
};

export type GameState = {
  player: Position;
  ghosts: Ghost[];
  dots: Position[];
  score: number;
  lives: number;
  gameOver: boolean;
  isInvincible: boolean;
  isWinner?: boolean;
};