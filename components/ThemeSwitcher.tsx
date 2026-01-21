
import React from 'react';

interface ThemeSwitcherProps {
  currentTheme: 'light' | 'dark' | 'gray';
  setTheme: (theme: 'light' | 'dark' | 'gray') => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <div className="flex space-x-2 p-2 bg-[var(--color-secondary-bg)] rounded-full shadow-theme border border-[var(--color-border)]">
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="light"
          checked={currentTheme === 'light'}
          onChange={() => setTheme('light')}
          className="sr-only"
          aria-label="Switch to Light Theme"
        />
        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          currentTheme === 'light' ? 'bg-indigo-500 text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
        }`}>
          Light
        </span>
      </label>
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={currentTheme === 'dark'}
          onChange={() => setTheme('dark')}
          className="sr-only"
          aria-label="Switch to Dark Theme"
        />
        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          currentTheme === 'dark' ? 'bg-indigo-500 text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
        }`}>
          Dark
        </span>
      </label>
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="gray"
          checked={currentTheme === 'gray'}
          onChange={() => setTheme('gray')}
          className="sr-only"
          aria-label="Switch to Gray Theme"
        />
        <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
          currentTheme === 'gray' ? 'bg-indigo-500 text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
        }`}>
          Gray
        </span>
      </label>
    </div>
  );
};
