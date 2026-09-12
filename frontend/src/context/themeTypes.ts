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

export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
  accents: AccentOption[];
}
