import { Season, ThemeConfig } from './types';

export const SEASON_THEMES: Record<Season, ThemeConfig> = {
  [Season.SPRING]: {
    background: 'bg-gradient-to-br from-green-100 via-pink-100 to-blue-100',
    accent: 'bg-pink-400',
    text: 'text-pink-700',
    button: 'bg-green-500 hover:bg-green-600',
    animal: 'rabbit',
    colors: ['#FFB7B2', '#B5EAD7', '#C7CEEA', '#E2F0CB', '#FF9AA2', '#FFDAC1', '#E0BBE4'] // Pastel Palette
  },
  [Season.SUMMER]: {
    background: 'bg-gradient-to-br from-yellow-200 via-orange-100 to-sky-200',
    accent: 'bg-yellow-400',
    text: 'text-orange-600',
    button: 'bg-blue-500 hover:bg-blue-600',
    animal: 'cat',
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F1C', '#2EC4B6', '#FDFFFC'] // Bright/Beach
  },
  [Season.FALL]: {
    background: 'bg-gradient-to-br from-orange-100 via-amber-100 to-stone-200',
    accent: 'bg-orange-500',
    text: 'text-amber-800',
    button: 'bg-orange-600 hover:bg-orange-700',
    animal: 'fox',
    colors: ['#D62828', '#F77F00', '#FCBF49', '#EAE2B7', '#606C38', '#8D5524', '#583101'] // Autumnal
  },
  [Season.WINTER]: {
    background: 'bg-gradient-to-br from-slate-200 via-blue-100 to-white',
    accent: 'bg-blue-400',
    text: 'text-slate-700',
    button: 'bg-cyan-600 hover:bg-cyan-700',
    animal: 'bear',
    colors: ['#0077B6', '#90E0EF', '#CAF0F8', '#03045E', '#5E60CE', '#48CAE4', '#ADB5BD'] // Frosty
  }
};

export const TUBE_CAPACITY = 4;
export const TOTAL_LEVELS_PER_SEASON = 50;
