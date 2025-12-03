/**
 * Utilidades para el sistema de temas
 * 
 * @module lib/theme-utils
 * @category Lib
 * @subcategory Theme
 */

import type { ThemeConfig, CustomColors, ThemeValidationResult } from '@/types/theme';

/**
 * Valida que un color hexadecimal sea válido
 * 
 * @param color - Color en formato hexadecimal
 * @returns true si el color es válido
 * 
 * @example
 * ```typescript
 * isValidHexColor('#3b82f6'); // true
 * isValidHexColor('invalid'); // false
 * ```
 * 
 * @category Utils
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Calcula el contraste entre dos colores según WCAG
 * 
 * @param color1 - Primer color en formato hexadecimal
 * @param color2 - Segundo color en formato hexadecimal
 * @returns Ratio de contraste (1-21)
 * 
 * @example
 * ```typescript
 * const contrast = calculateContrast('#000000', '#ffffff');
 * // Retorna 21 (máximo contraste)
 * ```
 * 
 * @category Utils
 */
export function calculateContrast(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convierte un color hexadecimal a RGB
 * 
 * @param hex - Color en formato hexadecimal
 * @returns Objeto con valores RGB o null si es inválido
 * 
 * @example
 * ```typescript
 * const rgb = hexToRgb('#3b82f6');
 * // { r: 59, g: 130, b: 246 }
 * ```
 * 
 * @category Utils
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Valida un tema personalizado para asegurar accesibilidad
 * 
 * @param theme - Configuración de tema a validar
 * @returns Resultado de validación con errores y advertencias
 * 
 * @example
 * ```typescript
 * const result = validateTheme(themeConfig);
 * if (!result.isValid) {
 *   console.error('Errores:', result.errors);
 * }
 * ```
 * 
 * @category Utils
 */
export function validateTheme(theme: ThemeConfig): ThemeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar colores
  const colorKeys: Array<keyof CustomColors> = [
    'primary',
    'secondary',
    'background',
    'surface',
    'text',
    'textSecondary',
    'border',
    'error',
    'warning',
    'success',
    'info',
  ];

  colorKeys.forEach((key) => {
    const color = theme.colors[key];
    if (!color) {
      errors.push(`Color ${key} es requerido`);
      return;
    }

    if (!isValidHexColor(color)) {
      errors.push(`Color ${key} tiene formato inválido: ${color}`);
      return;
    }
  });

  // Validar contraste para accesibilidad
  const textContrast = calculateContrast(theme.colors.text, theme.colors.background);
  const textSecondaryContrast = calculateContrast(
    theme.colors.textSecondary,
    theme.colors.background
  );

  // WCAG AA requiere mínimo 4.5:1 para texto normal, 3:1 para texto grande
  if (textContrast < 4.5) {
    errors.push(
      `Contraste insuficiente entre texto y fondo (${textContrast.toFixed(2)}:1). Mínimo requerido: 4.5:1 para accesibilidad WCAG AA`
    );
  } else if (textContrast < 7) {
    warnings.push(
      `Contraste de texto podría mejorarse (${textContrast.toFixed(2)}:1). Se recomienda 7:1 para WCAG AAA`
    );
  }

  if (textSecondaryContrast < 3) {
    warnings.push(
      `Contraste de texto secundario es bajo (${textSecondaryContrast.toFixed(2)}:1). Se recomienda mínimo 3:1`
    );
  }

  // Validar contraste de bordes
  const borderContrast = calculateContrast(theme.colors.border, theme.colors.surface);
  if (borderContrast < 1.5) {
    warnings.push(
      `Contraste de borde es muy bajo (${borderContrast.toFixed(2)}:1). Puede ser difícil de ver`
    );
  }

  // Validar que los colores de estado tengan buen contraste
  const errorContrast = calculateContrast(theme.colors.error, theme.colors.background);
  if (errorContrast < 3) {
    warnings.push(
      `Color de error tiene bajo contraste (${errorContrast.toFixed(2)}:1). Puede ser difícil de distinguir`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Genera un tema accesible basado en un color primario
 * 
 * @param primaryColor - Color primario en formato hexadecimal
 * @param mode - Modo del tema ('light' o 'dark')
 * @returns Tema generado con colores accesibles
 * 
 * @example
 * ```typescript
 * const theme = generateAccessibleTheme('#3b82f6', 'light');
 * ```
 * 
 * @category Utils
 */
export function generateAccessibleTheme(
  primaryColor: string,
  mode: 'light' | 'dark'
): ThemeConfig {
  if (!isValidHexColor(primaryColor)) {
    throw new Error('Color primario inválido');
  }

  const rgb = hexToRgb(primaryColor);
  if (!rgb) {
    throw new Error('No se pudo convertir el color a RGB');
  }

  if (mode === 'light') {
    return {
      name: 'Tema Generado',
      mode,
      colors: {
        primary: primaryColor,
        secondary: '#64748b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        textSecondary: '#475569',
        border: '#e2e8f0',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        info: primaryColor,
      },
      fontFamily: 'sans',
      fontSize: 'medium',
      density: 'comfortable',
    };
  } else {
    // Ajustar color primario para modo oscuro (más claro)
    const adjustedPrimary = adjustColorBrightness(primaryColor, 1.3);
    
    return {
      name: 'Tema Generado',
      mode,
      colors: {
        primary: adjustedPrimary,
        secondary: '#94a3b8',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#cbd5e1',
        border: '#334155',
        error: '#f87171',
        warning: '#fbbf24',
        success: '#34d399',
        info: adjustedPrimary,
      },
      fontFamily: 'sans',
      fontSize: 'medium',
      density: 'comfortable',
    };
  }
}

/**
 * Ajusta el brillo de un color
 * 
 * @param hex - Color en formato hexadecimal
 * @param factor - Factor de ajuste (1 = sin cambio, >1 = más claro, <1 = más oscuro)
 * @returns Color ajustado en formato hexadecimal
 * 
 * @category Utils
 */
function adjustColorBrightness(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.min(255, Math.round(rgb.r * factor));
  const g = Math.min(255, Math.round(rgb.g * factor));
  const b = Math.min(255, Math.round(rgb.b * factor));

  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

