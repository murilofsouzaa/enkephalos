import { useState, useEffect, type FC, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContextDefinition';
import { ACCENT_OPTIONS, type ThemeMode, type AccentColor } from './themeTypes';

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('enkephalos-theme-mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light'; // Light theme default
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('enkephalos-accent-color-v3') as AccentColor;
    if (saved && ACCENT_OPTIONS.some(a => a.id === saved)) return saved;
    return 'cyan'; // Verde Água default
  });

  // Sync mode with document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    if (themeMode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('enkephalos-theme-mode', themeMode);
  }, [themeMode]);

  // Sync accent with document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accentColor);
    localStorage.setItem('enkephalos-accent-color-v3', accentColor);
    localStorage.setItem('enkephalos-accent-color', accentColor);
  }, [accentColor]);

  const toggleThemeMode = () => {
    setThemeMode(prevMode => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const setAccentColor = (accent: AccentColor) => {
    setAccentColorState(accent);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleThemeMode,
        accentColor,
        setAccentColor,
        accents: ACCENT_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
