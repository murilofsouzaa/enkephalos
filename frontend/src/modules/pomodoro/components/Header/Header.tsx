import { useMode } from '../../hooks/useMode';

const Header = () => {
    const { mode, setMode } = useMode(); 

    const modes = [
        { key: 'pomodoro', label: 'Pomodoro', shortLabel: 'Pomodoro' },
        { key: 'short-break', label: 'Short-Break', shortLabel: 'Curta' },
        { key: 'long-break', label: 'Long-Break', shortLabel: 'Longa' },
    ];

    return ( 
        <header className="flex justify-center items-center py-2 w-auto px-2">
            <ul className="flex items-center justify-center gap-1.5 sm:gap-4 font-['Lexend',sans-serif]">
                {modes.map((m) => {
                    const isCurrent = mode === m.key;
                    return (
                        <li key={m.key}>
                            <button 
                                onClick={() => setMode(m.key)}
                                className={`uppercase font-medium py-1.5 px-2.5 sm:py-2 sm:px-5 rounded-lg text-xs sm:text-base tracking-wider transition-all cursor-pointer border shrink-0 ${
                                    isCurrent
                                        ? 'bg-[var(--accent-muted)] text-[var(--accent-color)] border-[var(--accent-color)] shadow-md shadow-[var(--accent-glow)] font-bold scale-[1.02]'
                                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)] hover:border-[var(--accent-color)]/40 hover:bg-[var(--bg-surface-hover)]'
                                }`}
                                type="button"
                            >
                                <span className="hidden sm:inline">{m.label}</span>
                                <span className="sm:hidden">{m.shortLabel}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </header>
     );
}
 
export default Header;