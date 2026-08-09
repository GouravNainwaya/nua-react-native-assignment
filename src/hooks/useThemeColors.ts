import { useSelector } from 'react-redux';

import { selectThemeMode } from '../store/themeSelectors';

const colors = {
  light: {
    background: '#ffffff',
    backgroundSecondary: '#fafafa',
    text: '#171717',
    textSecondary: '#525252',
    textMuted: '#737373',
    border: '#e5e5e5',
    primary: '#0f766e',
    cardBackground: '#ffffff',
    danger: '#ef4444',
  },
  dark: {
    background: '#171717',
    backgroundSecondary: '#262626',
    text: '#f5f5f5',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',
    border: '#404040',
    primary: '#2dd4bf', // Lighter teal for dark mode
    cardBackground: '#262626',
    danger: '#f87171',
  },
};

export function useThemeColors() {
  const themeMode = useSelector(selectThemeMode);
  return {
    isDark: themeMode === 'dark',
    colors: colors[themeMode],
  };
}
