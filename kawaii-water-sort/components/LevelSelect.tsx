import React from 'react';
import { Season } from '../types';
import { SEASON_THEMES, TOTAL_LEVELS_PER_SEASON } from '../constants';
import { audioManager } from '../services/audioService';

interface LevelSelectProps {
  season: Season;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ season, onSelectLevel, onBack }) => {
  const theme = SEASON_THEMES[season];
  const levels = Array.from({ length: TOTAL_LEVELS_PER_SEASON }, (_, i) => i + 1);

  return (
    <div className={`min-h-screen flex flex-col ${theme.background} p-6 transition-colors duration-500`}>
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
            <button 
                onClick={() => {
                    audioManager.playSelect();
                    onBack();
                }}
                className="px-6 py-2 bg-white/50 hover:bg-white/80 rounded-full font-bold text-slate-700 transition-colors shadow-sm"
            >
                ← Seasons
            </button>
            <h2 className={`text-3xl font-bold ${theme.text} drop-shadow-sm`}>
                {season} Levels
            </h2>
            <div className="w-24"></div> {/* Spacer for centering */}
        </header>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">
            {levels.map((level) => (
                <button
                    key={level}
                    onClick={() => {
                        audioManager.playSelect();
                        onSelectLevel(level - 1);
                    }}
                    className={`
                        aspect-square flex items-center justify-center rounded-2xl shadow-md
                        text-xl font-bold text-slate-600
                        bg-white/60 hover:bg-white hover:scale-110 transition-all
                        border-2 border-white/40
                    `}
                >
                    {level}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;