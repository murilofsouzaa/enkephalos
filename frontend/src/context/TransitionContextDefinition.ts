import { createContext } from 'react';

export interface TransitionContextType {
  triggerTransition: (targetPath: string) => void;
  isTransitioning: boolean;
  isPegasusFlying?: boolean;
}

export const TransitionContext = createContext<TransitionContextType | undefined>(undefined);
