import { useContext } from 'react';
import { PomodoroSettingsContext } from '../context/PomodoroContext';
import type { PomodoroSettingsContextType } from '../types';

export const usePomodoroSettings = (): PomodoroSettingsContextType => {
  const context = useContext(PomodoroSettingsContext);
  if (!context) {
    throw new Error('usePomodoroSettings must be used within a PomodoroSettingsProvider');
  }
  return context;
};
