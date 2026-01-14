import React from 'react';
import { BeakerIcon, ArrowDownTrayIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onExport: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, theme, toggleTheme }) => {
  return (
    <header className="h-14 bg-canvas-overlay border-b border-border-default flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-border-default p-1.5 rounded-lg border border-border-muted shadow-sm">
            <BeakerIcon className="w-5 h-5 text-accent-fg" />
        </div>
        <div>
            <h1 className="text-sm font-bold text-fg-default tracking-tight">NexMark</h1>
            <p className="text-[10px] text-fg-muted font-mono">v1.0.0 // Markdown + LaTeX</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-fg-muted hover:text-accent-fg hover:bg-canvas-subtle rounded-md transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        <div className="h-4 w-px bg-border-default mx-1"></div>

        <button 
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-fg-default bg-btn-bg border border-btn-border rounded-md hover:bg-btn-hoverBg transition-colors"
            onClick={onExport}
        >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export HTML
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-fg to-purple-500 border border-border-default shadow-inner"></div>
      </div>
    </header>
  );
};

export default Header;