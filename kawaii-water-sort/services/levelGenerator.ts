import { GameLevel, LevelConfig, Season } from '../types';
import { TUBE_CAPACITY, SEASON_THEMES } from '../constants';

// Helper to get level parameters based on level number (1-50)
const getLevelDifficulty = (level: number): LevelConfig => {
  // Progression logic - WAY HARDER START
  let tubeCount = 6; // Start with more tubes
  let emptyTubeCount = 2;
  let colorCount = 4; 
  let shuffleMoves = 25; // More mixing
  let moveBuffer = 4; // Very tight buffer

  if (level > 3) {
    tubeCount = 7;
    colorCount = 5;
    shuffleMoves = 35;
    moveBuffer = 3;
  }
  if (level > 8) {
    tubeCount = 8;
    colorCount = 6;
    shuffleMoves = 50;
    moveBuffer = 3;
  }
  if (level > 15) {
    tubeCount = 9;
    colorCount = 7;
    shuffleMoves = 70;
    moveBuffer = 2; // Extremely tight
  }
  if (level > 25) {
    tubeCount = 10;
    colorCount = 8;
    emptyTubeCount = 2; 
    shuffleMoves = 90;
    moveBuffer = 2;
  }
  if (level > 35) {
    tubeCount = 12; // Very crowded
    colorCount = 10;
    shuffleMoves = 120;
    moveBuffer = 2;
  }
  if (level > 45) {
    tubeCount = 14; // Chaos mode
    colorCount = 12;
    shuffleMoves = 150;
    moveBuffer = 1; // Almost perfect play required
  }

  return {
    tubeCount,
    emptyTubeCount,
    colorCount,
    shuffleMoves,
    moveLimitBuffer: moveBuffer
  };
};

// Deep clone helper
const cloneTubes = (tubes: string[][]) => tubes.map(t => [...t]);

export const generateLevel = (levelIndex: number, season: Season): GameLevel => {
  const config = getLevelDifficulty(levelIndex + 1);
  const palette = SEASON_THEMES[season].colors;
  
  // Loop palette if we need more colors than available in the strict theme
  // (This handles the "More colors" request even if the theme has 7)
  const levelColors: string[] = [];
  for(let i=0; i<config.colorCount; i++) {
      levelColors.push(palette[i % palette.length]);
  }
  
  // 1. Create Solved State
  let tubes: string[][] = [];
  
  // Add full tubes
  for (let i = 0; i < config.colorCount; i++) {
    const tube = Array(TUBE_CAPACITY).fill(levelColors[i]);
    tubes.push(tube);
  }
  
  // Add empty tubes
  for (let i = 0; i < config.emptyTubeCount; i++) {
    tubes.push([]);
  }

  // 2. Shuffle by simulating reverse moves
  let movesMade = 0;
  let attempts = 0;
  const maxAttempts = config.shuffleMoves * 20; 

  while (movesMade < config.shuffleMoves && attempts < maxAttempts) {
    attempts++;
    
    // Pick a random source tube that isn't empty
    const srcIdx = Math.floor(Math.random() * tubes.length);
    if (tubes[srcIdx].length === 0) continue;

    // Pick a random target tube that isn't full
    const tgtIdx = Math.floor(Math.random() * tubes.length);
    if (srcIdx === tgtIdx) continue;
    if (tubes[tgtIdx].length >= TUBE_CAPACITY) continue;

    // Move the liquid
    const liquid = tubes[srcIdx].pop()!;
    tubes[tgtIdx].push(liquid);
    movesMade++;
  }

  // Calculate move limit (Shuffle steps + small buffer)
  const moveLimit = movesMade + config.moveLimitBuffer;

  return {
    tubes,
    initialTubes: cloneTubes(tubes),
    moveLimit
  };
};

export const checkWinCondition = (tubes: string[][]): boolean => {
  return tubes.every(tube => {
    if (tube.length === 0) return true; // Empty tube is fine
    if (tube.length !== TUBE_CAPACITY) return false; // Must be full
    // All colors in tube must be identical
    return tube.every(color => color === tube[0]);
  });
};

export const isValidMove = (tubes: string[][], fromIdx: number, toIdx: number): boolean => {
  if (fromIdx === toIdx) return false;
  const fromTube = tubes[fromIdx];
  const toTube = tubes[toIdx];

  if (fromTube.length === 0) return false; // Source empty
  if (toTube.length >= TUBE_CAPACITY) return false; // Target full

  const sourceColor = fromTube[fromTube.length - 1];
  
  // If target is empty, any color can go
  if (toTube.length === 0) return true;

  const targetColor = toTube[toTube.length - 1];
  // Colors must match
  return sourceColor === targetColor;
};