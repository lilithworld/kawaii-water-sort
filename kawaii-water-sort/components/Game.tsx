import React, { useState, useEffect, useCallback } from 'react';
import { Season, GameState } from '../types';
import { SEASON_THEMES } from '../constants';
import { generateLevel, isValidMove, checkWinCondition } from '../services/levelGenerator';
import { audioManager } from '../services/audioService';
import Tube from './Tube';

interface GameProps {
  season: Season;
  levelIndex: number;
  onBack: () => void;
  onLevelComplete: () => void;
  onRetry: () => void;
}

const Game: React.FC<GameProps> = ({ season, levelIndex, onBack, onLevelComplete, onRetry }) => {
  const [tubes, setTubes] = useState<string[][]>([]);
  const [moveLimit, setMoveLimit] = useState(0);
  const [selectedTubeIndex, setSelectedTubeIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [history, setHistory] = useState<string[][][]>([]);
  
  const theme = SEASON_THEMES[season];

  // Initialize Level
  useEffect(() => {
    startLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex, season]);

  const startLevel = () => {
    const levelData = generateLevel(levelIndex, season);
    setTubes(levelData.tubes);
    setMoveLimit(levelData.moveLimit);
    setSelectedTubeIndex(null);
    setGameState(GameState.PLAYING);
    setHistory([]);
  };

  const handleTubeClick = (index: number) => {
    if (gameState !== GameState.PLAYING) return;

    audioManager.playSelect();

    if (selectedTubeIndex === null) {
      // Select source
      if (tubes[index].length > 0) {
        setSelectedTubeIndex(index);
      }
    } else {
      // Try to move
      if (selectedTubeIndex === index) {
        // Deselect
        setSelectedTubeIndex(null);
      } else {
        // Attempt move
        if (isValidMove(tubes, selectedTubeIndex, index)) {
          executeMove(selectedTubeIndex, index);
        } else {
            // Invalid move animation feedback could go here (shake)
            setSelectedTubeIndex(null);
        }
      }
    }
  };

  const executeMove = (fromIdx: number, toIdx: number) => {
    const newTubes = tubes.map(t => [...t]);
    const liquid = newTubes[fromIdx].pop();
    
    if (liquid) {
        newTubes[toIdx].push(liquid);
        
        audioManager.playPour();
        
        // Save history for undo (optional, not asked for but good practice) usually
        // But here we track moves left.
        setTubes(newTubes);
        setMoveLimit(prev => prev - 1);
        setSelectedTubeIndex(null);

        // Check Win
        if (checkWinCondition(newTubes)) {
            audioManager.playWin();
            setGameState(GameState.WON);
        } else if (moveLimit - 1 <= 0) {
             audioManager.playLose();
             setGameState(GameState.LOST);
        }
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col overflow-hidden ${theme.background} transition-colors duration-700`}>
      
      {/* Header */}
      <div className="w-full p-4 flex justify-between items-center z-10 bg-white/20 backdrop-blur-sm">
        <button onClick={onBack} className="text-3xl hover:scale-110 transition-transform">↩️</button>
        <div className="flex flex-col items-center">
            <h2 className={`text-2xl font-bold ${theme.text} drop-shadow-sm`}>Level {levelIndex + 1}</h2>
            <div className={`px-4 py-1 rounded-full bg-white/60 font-mono font-bold ${moveLimit < 5 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                Moves: {moveLimit}
            </div>
        </div>
        <button onClick={startLevel} className="text-3xl hover:rotate-180 transition-transform duration-500">🔄</button>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 max-w-4xl">
           {tubes.map((colors, idx) => (
               <Tube
                key={idx}
                colors={colors}
                selected={selectedTubeIndex === idx}
                onClick={() => handleTubeClick(idx)}
                animalType={theme.animal}
               />
           ))}
        </div>
      </div>

      {/* Floating particles for atmosphere (CSS only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {season === Season.WINTER && (
             <div className="animate-float opacity-50 text-2xl absolute top-10 left-10">❄️</div>
         )}
         {season === Season.FALL && (
             <div className="animate-float opacity-50 text-2xl absolute top-20 right-20">🍂</div>
         )}
         {season === Season.SPRING && (
             <div className="animate-float opacity-50 text-2xl absolute bottom-20 left-20">🌸</div>
         )}
         {season === Season.SUMMER && (
             <div className="animate-float opacity-50 text-2xl absolute top-1/2 left-1/2">☀️</div>
         )}
      </div>

      {/* Win Modal */}
      {gameState === GameState.WON && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 transform scale-100 animate-bounce">
            <div className="text-6xl mb-4 animate-spin-slow">🏆</div>
            <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Perfect!</h2>
            <p className="text-slate-500 mb-6">You matched all the colors!</p>
            <button 
                onClick={onLevelComplete}
                className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:scale-105 ${theme.button}`}
            >
                Next Level
            </button>
          </div>
          {/* Simple Confetti Logic via CSS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {Array.from({length: 20}).map((_, i) => (
                 <div key={i} className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{
                     top: `${Math.random() * 100}%`,
                     left: `${Math.random() * 100}%`,
                     animationDuration: `${0.5 + Math.random()}s`,
                     animationDelay: `${Math.random()}s`
                 }}></div>
             ))}
          </div>
        </div>
      )}

      {/* Lose Modal */}
      {gameState === GameState.LOST && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4 animate-shake">
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-3xl font-bold mb-2 text-slate-700">Oh no!</h2>
            <p className="text-slate-500 mb-6">Out of moves!</p>
            <button 
                onClick={startLevel}
                className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition hover:scale-105 bg-slate-500 hover:bg-slate-600`}
            >
                Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;