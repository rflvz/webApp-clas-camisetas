'use client';

import React, { useState, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeConfig, CustomColors, Density, FontSize, FontFamily } from '@/types/theme';

/**
 * Componente para personalizar tema avanzado
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del personalizador de tema
 * 
 * @example
 * ```tsx
 * <ThemeCustomizer />
 * ```
 * 
 * @category Components
 * @subcategory Theme
 */
export function ThemeCustomizer() {
  const {
    currentMode,
    preferences,
    customTheme,
    updatePreferences,
    applyCustomTheme,
    clearCustomTheme,
    exportTheme,
    importTheme,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<Partial<ThemeConfig> | null>(null);

  // Crear tema de preview basado en preferencias actuales
  const createPreviewTheme = useCallback((): ThemeConfig => {
    const defaultColors = currentMode === 'dark'
      ? {
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
        }
      : {
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

    return {
      name: 'Tema Personalizado',
      mode: currentMode,
      colors: previewTheme?.colors || customTheme?.colors || defaultColors,
      fontFamily: previewTheme?.fontFamily || preferences.fontFamily,
      fontSize: previewTheme?.fontSize || preferences.fontSize,
      density: previewTheme?.density || preferences.density,
    };
  }, [currentMode, preferences, customTheme, previewTheme]);

  const handleColorChange = useCallback((colorKey: keyof CustomColors, value: string) => {
    const currentColors = previewTheme?.colors || customTheme?.colors || {};
    setPreviewTheme({
      ...previewTheme,
      colors: {
        ...currentColors,
        [colorKey]: value,
      } as CustomColors,
    });
  }, [previewTheme, customTheme]);

  const handleApplyPreview = useCallback(() => {
    const theme = createPreviewTheme();
    applyCustomTheme(theme);
    setPreviewTheme(null);
  }, [createPreviewTheme, applyCustomTheme]);

  const handleReset = useCallback(() => {
    clearCustomTheme();
    setPreviewTheme(null);
  }, [clearCustomTheme]);

  const handleExport = useCallback(() => {
    const themeJson = exportTheme();
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tema-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportTheme]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (importTheme(content)) {
        alert('Tema importado correctamente');
      } else {
        alert('Error al importar tema. Verifica el formato del archivo.');
      }
    };
    reader.readAsText(file);
  }, [importTheme]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Abrir personalizador de tema"
        title="Personalizar tema"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text">Personalizar Tema</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-surface/80 transition-colors"
            aria-label="Cerrar personalizador"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Colores */}
          <section>
            <h3 className="text-lg font-semibold text-text mb-4">Colores</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['primary', 'secondary', 'background', 'surface', 'text', 'textSecondary', 'border', 'error', 'warning', 'success', 'info'] as Array<keyof CustomColors>).map((colorKey) => (
                <div key={colorKey} className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={previewTheme?.colors?.[colorKey] || customTheme?.colors?.[colorKey] || '#000000'}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="w-16 h-10 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={previewTheme?.colors?.[colorKey] || customTheme?.colors?.[colorKey] || '#000000'}
                      onChange={(e) => handleColorChange(colorKey, e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tipografía */}
          <section>
            <h3 className="text-lg font-semibold text-text mb-4">Tipografía</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Familia de Fuente
                </label>
                <select
                  value={previewTheme?.fontFamily || preferences.fontFamily}
                  onChange={(e) => setPreviewTheme({ ...previewTheme, fontFamily: e.target.value as FontFamily })}
                  className="w-full px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="sans">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="mono">Monospace</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Tamaño de Fuente
                </label>
                <select
                  value={previewTheme?.fontSize || preferences.fontSize}
                  onChange={(e) => setPreviewTheme({ ...previewTheme, fontSize: e.target.value as FontSize })}
                  className="w-full px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Densidad
                </label>
                <select
                  value={previewTheme?.density || preferences.density}
                  onChange={(e) => setPreviewTheme({ ...previewTheme, density: e.target.value as Density })}
                  className="w-full px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="compact">Compacta</option>
                  <option value="comfortable">Cómoda</option>
                  <option value="spacious">Espaciosa</option>
                </select>
              </div>
            </div>
          </section>

          {/* Cambio Automático */}
          <section>
            <h3 className="text-lg font-semibold text-text mb-4">Cambio Automático</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.autoSwitch ?? false}
                  onChange={(e) => updatePreferences({ autoSwitch: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="text-text">Cambiar automáticamente según hora del día</span>
              </label>

              {preferences.autoSwitch && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Inicio Modo Oscuro
                    </label>
                    <input
                      type="time"
                      value={preferences.darkModeStart || '20:00'}
                      onChange={(e) => updatePreferences({ darkModeStart: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Fin Modo Oscuro
                    </label>
                    <input
                      type="time"
                      value={preferences.darkModeEnd || '07:00'}
                      onChange={(e) => updatePreferences({ darkModeEnd: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Acciones */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            <button
              onClick={handleApplyPreview}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Aplicar Cambios
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Restablecer
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Exportar Tema
            </button>
            <label className="px-4 py-2 bg-surface border border-border text-text rounded-lg hover:bg-surface/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer">
              Importar Tema
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

