/**
 * Tipos para el sistema de temas y personalización
 * 
 * @module types/theme
 * @category Types
 * @subcategory Theme
 */

/**
 * Modo de tema disponible
 * 
 * @type ThemeMode
 * @category Types
 * @subcategory Theme
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Densidad de información en la interfaz
 * 
 * @type Density
 * @category Types
 * @subcategory Theme
 */
export type Density = 'compact' | 'comfortable' | 'spacious';

/**
 * Tamaño de fuente
 * 
 * @type FontSize
 * @category Types
 * @subcategory Theme
 */
export type FontSize = 'small' | 'medium' | 'large';

/**
 * Familia de fuente
 * 
 * @type FontFamily
 * @category Types
 * @subcategory Theme
 */
export type FontFamily = 'sans' | 'serif' | 'mono';

/**
 * Configuración de colores personalizados
 * 
 * @interface CustomColors
 * @category Types
 * @subcategory Theme
 */
export interface CustomColors {
  /** Color primario en formato hexadecimal */
  primary: string;
  
  /** Color secundario en formato hexadecimal */
  secondary: string;
  
  /** Color de fondo en formato hexadecimal */
  background: string;
  
  /** Color de superficie en formato hexadecimal */
  surface: string;
  
  /** Color de texto principal en formato hexadecimal */
  text: string;
  
  /** Color de texto secundario en formato hexadecimal */
  textSecondary: string;
  
  /** Color de borde en formato hexadecimal */
  border: string;
  
  /** Color de error en formato hexadecimal */
  error: string;
  
  /** Color de advertencia en formato hexadecimal */
  warning: string;
  
  /** Color de éxito en formato hexadecimal */
  success: string;
  
  /** Color de información en formato hexadecimal */
  info: string;
}

/**
 * Configuración completa de un tema personalizado
 * 
 * @interface ThemeConfig
 * @category Types
 * @subcategory Theme
 */
export interface ThemeConfig {
  /** Nombre del tema */
  name: string;
  
  /** Descripción del tema */
  description?: string;
  
  /** Modo del tema */
  mode: ThemeMode;
  
  /** Colores personalizados */
  colors: CustomColors;
  
  /** Familia de fuente */
  fontFamily: FontFamily;
  
  /** Tamaño de fuente */
  fontSize: FontSize;
  
  /** Densidad de información */
  density: Density;
  
  /** Fecha de creación */
  createdAt?: string;
  
  /** Fecha de última modificación */
  updatedAt?: string;
}

/**
 * Preferencias de tema del usuario
 * 
 * @interface ThemePreferences
 * @category Types
 * @subcategory Theme
 */
export interface ThemePreferences {
  /** Modo de tema actual */
  mode: ThemeMode;
  
  /** Tema personalizado activo (si existe) */
  customTheme?: ThemeConfig;
  
  /** Familia de fuente preferida */
  fontFamily: FontFamily;
  
  /** Tamaño de fuente preferido */
  fontSize: FontSize;
  
  /** Densidad de información preferida */
  density: Density;
  
  /** Hora de inicio para cambio automático a modo oscuro (formato HH:mm) */
  darkModeStart?: string;
  
  /** Hora de fin para cambio automático a modo oscuro (formato HH:mm) */
  darkModeEnd?: string;
  
  /** Habilitar cambio automático según hora del día */
  autoSwitch?: boolean;
}

/**
 * Resultado de validación de tema
 * 
 * @interface ThemeValidationResult
 * @category Types
 * @subcategory Theme
 */
export interface ThemeValidationResult {
  /** Indica si el tema es válido */
  isValid: boolean;
  
  /** Lista de errores encontrados */
  errors: string[];
  
  /** Advertencias no críticas */
  warnings?: string[];
}

/**
 * Opciones para exportar tema
 * 
 * @interface ExportThemeOptions
 * @category Types
 * @subcategory Theme
 */
export interface ExportThemeOptions {
  /** Incluir metadatos (fecha, descripción, etc.) */
  includeMetadata?: boolean;
  
  /** Formato de exportación */
  format?: 'json' | 'css';
}

