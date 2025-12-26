import React from 'react';
import { Season } from '../types';
import { SEASON_THEMES } from '../constants';
import { audioManager } from '../services/audioService';

interface SeasonSelectProps {
  onSelectSeason: (season: Season) => void;
}

const SeasonSelect: React.FC<SeasonSelectProps> = ({ onSelectSeason }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-700 mb-2 tracking-wider">Seasonal Paws</h1>
      <p className="text-slate-500 mb-8 text-lg">Water Sort Puzzle</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {Object.values(Season).map((season) => {
          const theme = SEASON_THEMES[season];
          return (
            <button
              key={season}
              onClick={() => {
                audioManager.playSelect();
                onSelectSeason(season);
              }}
              className={`
                relative overflow-hidden h-48 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl
                flex flex-col items-center justify-center
                ${theme.background}
              `}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

                <span className="text-5xl mb-2 filter drop-shadow-md">
                    {season === Season.SPRING && '🌸'}
                    {season === Season.SUMMER && '☀️'}
                    {season === Season.FALL && '🍂'}
                    {season === Season.WINTER && '❄️'}
                </span>
              <h2 className={`text-3xl font-bold ${theme.text} uppercase tracking-widest drop-shadow-sm`}>
                {season}
              </h2>
              <div className="mt-2 px-4 py-1 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm text-slate-700">
                50 Levels
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonSelect;