'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeMode } from '@/types/theme';

/**
 * Componente para cambiar entre modos de tema
 * 
 * @component
 * @returns Elemento JSX del toggle de tema
 * 
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 * 
 * @category Components
 * @subcategory Theme
 */
export function ThemeToggle() {
  const { currentMode, preferences, setMode } = useTheme();

  const handleToggle = () => {
    // Ciclar entre light -> dark -> auto
    if (preferences.mode === 'light') {
      setMode('dark');
    } else if (preferences.mode === 'dark') {
      setMode('auto');
    } else {
      setMode('light');
    }
  };

  const getIcon = () => {
    if (preferences.mode === 'auto') {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    }

    if (currentMode === 'dark') {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  };

  const getLabel = () => {
    if (preferences.mode === 'auto') {
      return 'Automático';
    }
    return currentMode === 'dark' ? 'Oscuro' : 'Claro';
  };

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface text-text border border-border hover:bg-surface/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={`Cambiar tema. Actual: ${getLabel()}`}
      title={`Tema actual: ${getLabel()}`}
    >
      {getIcon()}
      <span className="text-sm font-medium">{getLabel()}</span>
    </button>
  );
}

