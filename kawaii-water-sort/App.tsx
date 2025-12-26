import React, { useState } from 'react';
import { GameState, Season } from './types';
import SeasonSelect from './components/SeasonSelect';
import LevelSelect from './components/LevelSelect';
import Game from './components/Game';

const App: React.FC = () => {
  const [appState, setAppState] = useState<GameState>(GameState.MENU);
  const [currentSeason, setCurrentSeason] = useState<Season>(Season.SPRING);
  const [currentLevel, setCurrentLevel] = useState<number>(0);

  const handleSeasonSelect = (season: Season) => {
    setCurrentSeason(season);
    setAppState(GameState.LEVEL_SELECT);
  };

  const handleLevelSelect = (level: number) => {
    setCurrentLevel(level);
    setAppState(GameState.PLAYING);
  };

  const handleBackToSeasons = () => {
    setAppState(GameState.MENU);
  };

  const handleBackToLevels = () => {
    setAppState(GameState.LEVEL_SELECT);
  };

  const handleNextLevel = () => {
    setCurrentLevel((prev) => prev + 1);
    setAppState(GameState.PLAYING); // Reset game instance
  };

  return (
    <div className="font-sans antialiased text-gray-900 selection:bg-pink-200 selection:text-pink-900">
      {appState === GameState.MENU && (
        <SeasonSelect onSelectSeason={handleSeasonSelect} />
      )}

      {appState === GameState.LEVEL_SELECT && (
        <LevelSelect 
          season={currentSeason} 
          onSelectLevel={handleLevelSelect} 
          onBack={handleBackToSeasons}
        />
      )}

      {(appState === GameState.PLAYING || appState === GameState.WON || appState === GameState.LOST) && (
        <Game 
          season={currentSeason} 
          levelIndex={currentLevel}
          onBack={handleBackToLevels}
          onLevelComplete={handleNextLevel}
          onRetry={() => setAppState(GameState.PLAYING)} // Triggers re-mount logic inside Game due to same state, effectively handled by internal reset but good for clarity
        />
      )}
    </div>
  );
};

export default App;