import React from 'react';
import { TUBE_CAPACITY } from '../constants';

interface TubeProps {
  colors: string[];
  selected: boolean;
  onClick: () => void;
  animalType: 'rabbit' | 'cat' | 'fox' | 'bear';
}

const Tube: React.FC<TubeProps> = ({ colors, selected, onClick, animalType }) => {
  
  const isFull = colors.length === TUBE_CAPACITY;
  const isCompleted = isFull && colors.every(c => c === colors[0]);

  return (
    <div 
      className={`relative flex flex-col items-center transition-all duration-300 cursor-pointer ${selected ? '-translate-y-4 scale-105' : 'hover:-translate-y-1'}`}
      onClick={onClick}
    >
      {/* Animal Ears/Face Deco */}
      <div className="absolute -top-6 w-full h-10 z-0 flex justify-between px-1 pointer-events-none">
        {animalType === 'cat' && (
          <>
            <div className="w-4 h-4 bg-white border-2 border-gray-200 transform -rotate-12 rounded-tl-lg"></div>
            <div className="w-4 h-4 bg-white border-2 border-gray-200 transform rotate-12 rounded-tr-lg"></div>
          </>
        )}
        {animalType === 'rabbit' && (
          <>
            <div className="w-3 h-8 bg-pink-100 border-2 border-pink-200 transform -rotate-6 rounded-full -mt-2"></div>
            <div className="w-3 h-8 bg-pink-100 border-2 border-pink-200 transform rotate-6 rounded-full -mt-2"></div>
          </>
        )}
        {animalType === 'bear' && (
          <>
            <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded-full"></div>
          </>
        )}
        {animalType === 'fox' && (
          <>
            <div className="w-5 h-5 bg-orange-200 border-2 border-orange-300 transform -rotate-12 rounded-tl-xl"></div>
            <div className="w-5 h-5 bg-orange-200 border-2 border-orange-300 transform rotate-12 rounded-tr-xl"></div>
          </>
        )}
      </div>

      {/* Bottle Body */}
      <div className={`
        relative w-12 h-36 md:w-14 md:h-40 lg:w-16 lg:h-48
        border-4 border-white/80 bg-white/10 backdrop-blur-sm 
        rounded-b-3xl rounded-t-lg 
        flex flex-col-reverse overflow-hidden shadow-xl
        ${selected ? 'ring-4 ring-yellow-400 ring-opacity-60' : ''}
        ${isCompleted ? 'ring-4 ring-green-400 ring-opacity-60' : ''}
      `}>
        {/* Liquids */}
        {colors.map((color, index) => (
          <div
            key={index}
            style={{ 
              backgroundColor: color, 
              height: `${100 / TUBE_CAPACITY}%` 
            }}
            className={`
                w-full transition-all duration-500 ease-in-out animate-pour-stream
                relative
                border-t border-white/10
            `}
          >
            {/* "Rob" Effect: Inner shadows to look like thick paste/jam */}
            <div className="absolute inset-0 shadow-[inset_0px_0px_8px_rgba(0,0,0,0.3)] pointer-events-none"></div>
            
            {/* Glossy Highlight for viscosity */}
            <div className="absolute top-1 left-1 right-1 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-md opacity-70 pointer-events-none"></div>
            
            {/* Surface tension/Top curve for the top-most liquid */}
            {index === colors.length - 1 && (
                <div className="absolute -top-1 left-0 right-0 h-2 bg-white/20 rounded-[50%] opacity-60 blur-[1px]"></div>
            )}
          </div>
        ))}
        
        {/* Animal Face Overlay (Eyes/Nose) on the glass */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            <div className="flex space-x-2 justify-center mb-1">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
            </div>
            <div className="w-3 h-2 bg-slate-900 rounded-full mx-auto opacity-80"></div>
        </div>
      </div>
    </div>
  );
};

export default Tube;