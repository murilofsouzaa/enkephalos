import { useState, useEffect, useRef, type FC, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Palette, Loader2 } from 'lucide-react';
import { usePageTransition } from '../../context/TransitionContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: FC = () => {
  const { triggerTransition } = usePageTransition();
  const { themeMode, toggleThemeMode, accentColor, setAccentColor, accents } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.key.toLowerCase() === 'k') {
        // If on article page, ArticleDetail handles in-article find
        if (location.pathname.startsWith('/estudos/') && location.pathname !== '/estudos') {
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname]);

  // Sync search input if URL contains ?q= or when cleared
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (location.pathname === '/estudos') {
      setSearchQuery(q || '');
    }
  }, [location.search, location.pathname]);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Continuous Netflix-style search: user types, pauses for 1 second, and search executes automatically
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value.trim()) {
      setIsDebouncing(false);
      if (location.pathname === '/estudos') {
        navigate('/estudos', { replace: true });
      }
      return;
    }

    setIsDebouncing(true);
    debounceTimerRef.current = setTimeout(() => {
      setIsDebouncing(false);
      const q = value.trim();
      if (q) {
        if (location.pathname === '/estudos') {
          navigate(`/estudos?q=${encodeURIComponent(q)}`, { replace: true });
        } else {
          triggerTransition(`/estudos?q=${encodeURIComponent(q)}`);
        }
      }
    }, 1000); // 1-second pause just like Netflix
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setIsDebouncing(false);
    if (searchQuery.trim()) {
      if (location.pathname === '/estudos') {
        navigate(`/estudos?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
      } else {
        triggerTransition(`/estudos?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      triggerTransition('/');
    }
  };

  return (
    <header className="w-full border-b border-[var(--border-subtle,#26211e)] bg-[var(--bg-color,#121110)]/95 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo / Brand with The Girl Next Door font */}
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className="group flex items-center gap-2 outline-none select-none shrink-0"
        >
          <span className="font-['The_Girl_Next_Door',cursive] text-xl sm:text-3xl font-semibold tracking-wide text-[var(--text-main,#f3f0ea)] group-hover:text-[var(--accent-color)] transition-colors leading-none pt-1">
            Enkephalos
          </span>
        </Link>

        {/* Right side controls: Netflix search input, GitHub, Theme Palette, Dark/Light mode */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Continuous Netflix-style Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-24 sm:w-56 lg:w-64 bg-[var(--bg-surface,#1a1715)] border border-[var(--border-subtle,#2e2824)] focus:border-[var(--accent-color,#f59e0b)] text-xs text-[var(--text-main,#f3f0ea)] placeholder-[var(--text-dimmed,#686158)] font-['Lexend',sans-serif] rounded-md pl-7 pr-2 sm:pl-8 sm:pr-12 py-1 sm:py-1.5 outline-none transition-all"
              />
              {isDebouncing ? (
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent-color,#f59e0b)] animate-spin absolute left-2 sm:left-2.5 pointer-events-none" />
              ) : (
                <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-dimmed,#686158)] absolute left-2 sm:left-2.5 pointer-events-none" />
              )}
              <kbd className="hidden sm:inline-block absolute right-2 px-1 py-0.5 text-[9px] font-['Raleway',sans-serif] font-medium text-[var(--text-muted,#78716c)] bg-[var(--bg-color,#121110)] border border-[var(--border-subtle,#2e2824)] rounded pointer-events-none">
                {isDebouncing ? 'aguarde...' : 'Ctrl+K'}
              </kbd>
            </div>
          </form>

          {/* GitHub link to murilofsouzaa */}
          <a
            href="https://github.com/murilofsouzaa"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub: murilofsouzaa"
            className="hidden sm:flex p-2 text-[var(--text-muted,#9e9589)] hover:text-[var(--text-main,#f3f0ea)] hover:bg-[var(--bg-surface-hover,#1a1715)] rounded-md transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Theme Accent Color Picker Popover */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => setShowColorPicker(prev => !prev)}
              title="Trocar cor do tema"
              className="p-2 text-[var(--text-muted,#9e9589)] hover:text-[var(--accent-color)] hover:bg-[var(--bg-surface-hover,#1a1715)] rounded-md transition-colors relative flex items-center justify-center cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              <span
                className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-[var(--bg-color)]"
                style={{ backgroundColor: `var(--accent-color)` }}
              />
            </button>

            {showColorPicker && (
              <div className="absolute right-0 top-11 p-2 bg-[var(--bg-surface,#191614)] border border-[var(--border-subtle,#2e2824)] rounded-lg shadow-xl flex items-center gap-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {accents.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setAccentColor(acc.id);
                      setShowColorPicker(false);
                    }}
                    title={acc.label}
                    className={`w-6 h-6 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                      accentColor === acc.id ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: acc.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Functional Dark / Light mode toggle */}
          <button
            type="button"
            onClick={toggleThemeMode}
            title={themeMode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            className="p-2 text-[var(--accent-color)] hover:bg-[var(--bg-surface-hover,#1a1715)] rounded-md transition-all cursor-pointer"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

