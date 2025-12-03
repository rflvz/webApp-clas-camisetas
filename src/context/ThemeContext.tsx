'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { ThemeMode, ThemePreferences, ThemeConfig, CustomColors, Density, FontSize, FontFamily } from '@/types/theme';

/**
 * Contexto de tema para la aplicación
 * 
 * @interface ThemeContextValue
 * @category Types
 * @subcategory Theme
 */
interface ThemeContextValue {
  /** Modo de tema actual (resuelto, no 'auto') */
  currentMode: 'light' | 'dark';
  
  /** Preferencias de tema del usuario */
  preferences: ThemePreferences;
  
  /** Tema personalizado activo */
  customTheme: ThemeConfig | null;
  
  /** Cambiar modo de tema */
  setMode: (mode: ThemeMode) => void;
  
  /** Actualizar preferencias de tema */
  updatePreferences: (preferences: Partial<ThemePreferences>) => void;
  
  /** Aplicar tema personalizado */
  applyCustomTheme: (theme: ThemeConfig) => void;
  
  /** Eliminar tema personalizado */
  clearCustomTheme: () => void;
  
  /** Exportar tema actual */
  exportTheme: () => string;
  
  /** Importar tema */
  importTheme: (themeJson: string) => boolean;
  
  /** Verificar si el cambio automático está activo */
  isAutoSwitchActive: boolean;
}

/**
 * Contexto de tema
 * 
 * @constant ThemeContext
 * @category Context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Valores por defecto de preferencias de tema
 * 
 * @constant DEFAULT_PREFERENCES
 * @category Constants
 */
const DEFAULT_PREFERENCES: ThemePreferences = {
  mode: 'light',
  fontFamily: 'sans',
  fontSize: 'medium',
  density: 'comfortable',
  autoSwitch: false,
  darkModeStart: '20:00',
  darkModeEnd: '07:00',
};

/**
 * Colores por defecto para tema claro
 * 
 * @constant DEFAULT_LIGHT_COLORS
 * @category Constants
 */
const DEFAULT_LIGHT_COLORS: CustomColors = {
  primary: '#3b82f6',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#475569',
  border: '#e2e8f0',
  error: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6',
};

/**
 * Colores por defecto para tema oscuro
 * 
 * @constant DEFAULT_DARK_COLORS
 * @category Constants
 */
const DEFAULT_DARK_COLORS: CustomColors = {
  primary: '#60a5fa',
  secondary: '#94a3b8',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  border: '#334155',
  error: '#f87171',
  warning: '#fbbf24',
  success: '#34d399',
  info: '#60a5fa',
};

/**
 * Resuelve el modo de tema actual considerando 'auto'
 * 
 * @param mode - Modo de tema (puede ser 'auto')
 * @param autoSwitch - Si el cambio automático está habilitado
 * @param darkModeStart - Hora de inicio para modo oscuro
 * @param darkModeEnd - Hora de fin para modo oscuro
 * @returns Modo resuelto ('light' o 'dark')
 * 
 * @example
 * ```typescript
 * const resolved = resolveThemeMode('auto', true, '20:00', '07:00');
 * // Retorna 'dark' si está entre 20:00 y 07:00, 'light' en caso contrario
 * ```
 * 
 * @category Utils
 */
function resolveThemeMode(
  mode: ThemeMode,
  autoSwitch: boolean,
  darkModeStart?: string,
  darkModeEnd?: string
): 'light' | 'dark' {
  if (mode !== 'auto') {
    return mode;
  }

  if (!autoSwitch || !darkModeStart || !darkModeEnd) {
    // Si auto está deshabilitado o no hay horarios, usar preferencia del sistema
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = darkModeStart.split(':').map(Number);
  const [endHour, endMinute] = darkModeEnd.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  // Si el rango cruza medianoche (ej: 20:00 - 07:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime ? 'dark' : 'light';
  }

  // Rango normal (ej: 22:00 - 06:00, pero sin cruzar medianoche)
  return currentTime >= startTime && currentTime < endTime ? 'dark' : 'light';
}

/**
 * Provider de tema para la aplicación
 * 
 * @component
 * @param props - Propiedades del provider
 * @returns Provider de contexto de tema
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 * 
 * @category Components
 * @subcategory Theme
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useLocalStorage<ThemePreferences>(
    'theme-preferences',
    DEFAULT_PREFERENCES
  );

  const [customTheme, setCustomTheme] = useLocalStorage<ThemeConfig | null>(
    'custom-theme',
    null
  );

  // Resolver modo actual
  const currentMode = useMemo(() => {
    return resolveThemeMode(
      preferences.mode,
      preferences.autoSwitch ?? false,
      preferences.darkModeStart,
      preferences.darkModeEnd
    );
  }, [preferences.mode, preferences.autoSwitch, preferences.darkModeStart, preferences.darkModeEnd]);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar clase de modo
    root.classList.remove('light', 'dark');
    root.classList.add(currentMode);

    // Aplicar colores personalizados si existe tema personalizado
    if (customTheme) {
      const colors = customTheme.colors;
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-surface', colors.surface);
      root.style.setProperty('--color-text', colors.text);
      root.style.setProperty('--color-text-secondary', colors.textSecondary);
      root.style.setProperty('--color-border', colors.border);
      root.style.setProperty('--color-error', colors.error);
      root.style.setProperty('--color-warning', colors.warning);
      root.style.setProperty('--color-success', colors.success);
      root.style.setProperty('--color-info', colors.info);
    } else {
      // Usar colores por defecto según el modo
      const defaultColors = currentMode === 'dark' ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS;
      root.style.setProperty('--color-primary', defaultColors.primary);
      root.style.setProperty('--color-secondary', defaultColors.secondary);
      root.style.setProperty('--color-background', defaultColors.background);
      root.style.setProperty('--color-surface', defaultColors.surface);
      root.style.setProperty('--color-text', defaultColors.text);
      root.style.setProperty('--color-text-secondary', defaultColors.textSecondary);
      root.style.setProperty('--color-border', defaultColors.border);
      root.style.setProperty('--color-error', defaultColors.error);
      root.style.setProperty('--color-warning', defaultColors.warning);
      root.style.setProperty('--color-success', defaultColors.success);
      root.style.setProperty('--color-info', defaultColors.info);
    }

    // Aplicar densidad
    root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    root.classList.add(`density-${preferences.density}`);

    // Aplicar tamaño de fuente
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${preferences.fontSize}`);

    // Aplicar familia de fuente
    root.classList.remove('font-sans', 'font-serif', 'font-mono');
    root.classList.add(`font-${preferences.fontFamily}`);
  }, [currentMode, customTheme, preferences]);

  // Verificar cambio automático cada minuto
  useEffect(() => {
    if (preferences.mode === 'auto' && preferences.autoSwitch) {
      const interval = setInterval(() => {
        // Forzar re-render para actualizar modo resuelto
        setPreferences((prev) => ({ ...prev }));
      }, 60000); // Cada minuto

      return () => clearInterval(interval);
    }
  }, [preferences.mode, preferences.autoSwitch, setPreferences]);

  // Escuchar cambios en preferencias del sistema
  useEffect(() => {
    if (preferences.mode === 'auto' && !preferences.autoSwitch) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setPreferences((prev) => ({ ...prev }));
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.mode, preferences.autoSwitch, setPreferences]);

  const setMode = useCallback((mode: ThemeMode) => {
    setPreferences((prev) => ({ ...prev, mode }));
  }, [setPreferences]);

  const updatePreferences = useCallback((newPreferences: Partial<ThemePreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  }, [setPreferences]);

  const applyCustomTheme = useCallback((theme: ThemeConfig) => {
    setCustomTheme(theme);
    setPreferences((prev) => ({ ...prev, customTheme: theme }));
  }, [setCustomTheme, setPreferences]);

  const clearCustomTheme = useCallback(() => {
    setCustomTheme(null);
    setPreferences((prev) => {
      const { customTheme, ...rest } = prev;
      return rest;
    });
  }, [setCustomTheme, setPreferences]);

  const exportTheme = useCallback((): string => {
    const themeToExport: ThemeConfig = customTheme || {
      name: `Tema ${currentMode === 'dark' ? 'Oscuro' : 'Claro'}`,
      mode: currentMode,
      colors: currentMode === 'dark' ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS,
      fontFamily: preferences.fontFamily,
      fontSize: preferences.fontSize,
      density: preferences.density,
      createdAt: new Date().toISOString(),
    };

    return JSON.stringify(themeToExport, null, 2);
  }, [customTheme, currentMode, preferences]);

  const importTheme = useCallback((themeJson: string): boolean => {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig;
      
      // Validación básica
      if (!theme.name || !theme.mode || !theme.colors) {
        return false;
      }

      applyCustomTheme(theme);
      return true;
    } catch {
      return false;
    }
  }, [applyCustomTheme]);

  const isAutoSwitchActive = useMemo(() => {
    return preferences.mode === 'auto' && (preferences.autoSwitch ?? false);
  }, [preferences.mode, preferences.autoSwitch]);

  const value: ThemeContextValue = useMemo(() => ({
    currentMode,
    preferences,
    customTheme,
    setMode,
    updatePreferences,
    applyCustomTheme,
    clearCustomTheme,
    exportTheme,
    importTheme,
    isAutoSwitchActive,
  }), [
    currentMode,
    preferences,
    customTheme,
    setMode,
    updatePreferences,
    applyCustomTheme,
    clearCustomTheme,
    exportTheme,
    importTheme,
    isAutoSwitchActive,
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de tema
 * 
 * @returns Contexto de tema
 * @throws {Error} Si se usa fuera de ThemeProvider
 * 
 * @example
 * ```typescript
 * const { currentMode, setMode, preferences } = useTheme();
 * 
 * // Cambiar a modo oscuro
 * setMode('dark');
 * ```
 * 
 * @category Hooks
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  
  return context;
}

