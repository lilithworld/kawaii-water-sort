export enum Season {
  SPRING = 'Spring',
  SUMMER = 'Summer',
  FALL = 'Fall',
  WINTER = 'Winter'
}

export enum GameState {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}

export interface LevelConfig {
  tubeCount: number;
  emptyTubeCount: number;
  colorCount: number;
  shuffleMoves: number;
  moveLimitBuffer: number;
}

export interface GameLevel {
  tubes: string[][]; // Array of tubes, each containing an array of color strings
  initialTubes: string[][]; // For reset
  moveLimit: number;
}

export interface ThemeConfig {
  background: string;
  accent: string;
  text: string;
  button: string;
  animal: 'rabbit' | 'cat' | 'fox' | 'bear';
  colors: string[];
}