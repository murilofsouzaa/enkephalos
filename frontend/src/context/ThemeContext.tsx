import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'cyan' | 'blue' | 'amber' | 'emerald' | 'violet' | 'rose';

export interface AccentOption {
  id: AccentColor;
  label: string;
  hex: string;
  glow: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: 'cyan', label: 'Verde Água', hex: '#06b6d4', glow: 'rgba(6,182,212,0.5)' },
  { id: 'blue', label: 'Azul', hex: '#2563eb', glow: 'rgba(37,99,235,0.5)' },
  { id: 'amber', label: 'Âmbar Ouro', hex: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  { id: 'emerald', label: 'Esmeralda', hex: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  { id: 'violet', label: 'Violeta', hex: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
  { id: 'rose', label: 'Rosa Coral', hex: '#f43f5e', glow: 'rgba(244,63,94,0.5)' },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  accents: AccentOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}
