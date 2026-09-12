import { useContext } from 'react';
import { TransitionContext, type TransitionContextType } from './TransitionContextDefinition';

export function usePageTransition(): TransitionContextType {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('usePageTransition deve ser usado dentro de um TransitionProvider');
  }
  return context;
}
