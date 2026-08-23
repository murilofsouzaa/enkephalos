import { createContext, useState, type ReactNode } from 'react';

export interface IMode {
    mode: string;
    setMode: (mode: string) => void,
    isActive: boolean,
    setIsActive: (active:boolean) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ModeContext = createContext<IMode | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<string>("pomodoro");
    const [isActive, setIsActive] = useState<boolean>(true)
    
    return (
        <ModeContext.Provider value={{ mode, setMode, isActive, setIsActive }}>
            {children}
        </ModeContext.Provider>
    );
}