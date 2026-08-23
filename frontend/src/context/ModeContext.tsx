import { createContext, useState, type ReactNode } from 'react';

export interface IMode {
    mode: string;
    setMode: (mode: string) => void;
}

export const ModeContext = createContext<IMode | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<string>("pomodoro");
    
    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
}