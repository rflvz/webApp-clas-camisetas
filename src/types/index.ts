/**
 * @fileoverview Definiciones de tipos TypeScript para la aplicación HDBSCAN
 * @module types
 */

/**
 * Configuración completa de clustering HDBSCAN
 * 
 * Representa una configuración guardada que incluye parámetros,
 * modo de operación y metadatos de la configuración.
 * 
 * @interface ClusteringConfig
 * @category Types
 * @subcategory Clustering
 */
export interface ClusteringConfig {
  /** Identificador único de la configuración */
  id?: string;
  
  /** Nombre descriptivo de la configuración */
  name: string;
  
  /** Modo de configuración utilizado */
  mode: 'basic' | 'advanced' | 'super-advanced';
  
  /** Parámetros de clustering asociados */
  parameters: ClusteringParameters;
  
  /** Fecha de creación de la configuración */
  createdAt?: Date;
  
  /** Fecha de última actualización */
  updatedAt?: Date;
}

/**
 * Parámetros de configuración para el algoritmo HDBSCAN
 * 
 * Define todos los parámetros disponibles para configurar el comportamiento
 * del algoritmo de clustering HDBSCAN, organizados por nivel de complejidad.
 * 
 * @interface ClusteringParameters
 * @category Types
 * @subcategory Clustering
 */
export interface ClusteringParameters {
  /** 
   * Tamaño mínimo de cluster (parámetro básico)
   * @minimum 2
   * @maximum 1000
   */
  minClusterSize: number;
  
  /** 
   * Número mínimo de muestras (parámetro básico)
   * @minimum 1
   * @maximum 100
   * @defaultValue minClusterSize
   */
  minSamples?: number;
  
  /** 
   * Métrica de distancia utilizada (parámetro avanzado)
   * @defaultValue "euclidean"
   */
  metric?: string;
  
  /** 
   * Parámetro alpha para HDBSCAN (parámetro avanzado)
   * @minimum 0.0
   * @maximum 1.0
   * @defaultValue 1.0
   */
  alpha?: number;
  
  /** 
   * Epsilon para selección de clusters (parámetro avanzado)
   * @minimum 0.0
   * @defaultValue 0.0
   */
  clusterSelectionEpsilon?: number;
  
  /** 
   * Algoritmo de árbol para búsqueda de vecinos (super avanzado)
   * @defaultValue "auto"
   */
  algorithm?: 'auto' | 'ball_tree' | 'kd_tree' | 'brute';
  
  /** 
   * Tamaño de hoja para algoritmos de árbol (super avanzado)
   * @minimum 1
   * @defaultValue 30
   */
  leafSize?: number;
  
  /** 
   * Usar aproximación para árbol de expansión mínima (super avanzado)
   * @defaultValue true
   */
  approxMinSpanTree?: boolean;
  
  /** 
   * Generar árbol de expansión mínima (super avanzado)
   * @defaultValue false
   */
  genMinSpanTree?: boolean;
  
  /** 
   * Número de trabajos para cálculo de distancia central (super avanzado)
   * @defaultValue 1
   */
  coreDistNJobs?: number;
  
  /** 
   * Método de selección de clusters (super avanzado)
   * @defaultValue "eom"
   */
  clusterSelectionMethod?: 'eom' | 'leaf';
  
  /** 
   * Permitir cluster único (super avanzado)
   * @defaultValue false
   */
  allowSingleCluster?: boolean;
  
  /** 
   * Almacenar datos de predicción (super avanzado)
   * @defaultValue false
   */
  predictionData?: boolean;
  
  /** 
   * Coincidir con implementación de referencia (super avanzado)
   * @defaultValue false
   */
  matchReferenceImplementation?: boolean;
}

export interface PresetConfig {
  name: string;
  description: string;
  parameters: ClusteringParameters;
}

export interface ClusteringResult {
  id: string;
  configId: string;
  labels: number[];
  probabilities?: number[];
  clusterPersistence?: number[];
  condensedTree?: any;
  singleLinkageTree?: any;
  executionTime: number;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Propiedades para el componente Button
 * 
 * Define todas las propiedades disponibles para personalizar
 * el comportamiento y apariencia del componente Button.
 * 
 * @interface ButtonProps
 * @category Types
 * @subcategory Components
 */
export interface ButtonProps {
  /** 
   * Variante visual del botón
   * @defaultValue "primary"
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /** 
   * Tamaño del botón
   * @defaultValue "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /** 
   * Si el botón está deshabilitado
   * @defaultValue false
   */
  disabled?: boolean;
  
  /** 
   * Si el botón muestra estado de carga
   * @defaultValue false
   */
  loading?: boolean;
  
  /** Contenido del botón */
  children: React.ReactNode;
  
  /** Función ejecutada al hacer clic */
  onClick?: () => void;
  
  /** 
   * Tipo HTML del botón
   * @defaultValue "button"
   */
  type?: 'button' | 'submit' | 'reset';
  
  /** Clases CSS adicionales */
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Tipos para formularios
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'checkbox' | 'range';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
}

