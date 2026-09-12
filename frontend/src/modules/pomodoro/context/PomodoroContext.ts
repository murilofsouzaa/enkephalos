import { createContext } from 'react';
import type { PomodoroSettingsContextType } from '../types';

export const PomodoroSettingsContext = createContext<PomodoroSettingsContextType | undefined>(undefined);
