/**
 * @fileoverview Esquemas de validación Zod para parámetros de clustering HDBSCAN
 * @module lib/validation
 */

import { z } from 'zod';
import type { ClusteringParameters } from '@/types';

/**
 * Esquema de validación para parámetros básicos de clustering
 * 
 * Incluye los parámetros esenciales que se usan en todos los modos.
 * 
 * @constant basicParamsSchema
 * @category Validation
 * @subcategory Schemas
 */
export const basicParamsSchema = z.object({
  minClusterSize: z
    .number({
      required_error: 'El tamaño mínimo de cluster es requerido',
      invalid_type_error: 'El tamaño mínimo de cluster debe ser un número',
    })
    .int('El tamaño mínimo de cluster debe ser un número entero')
    .min(2, 'El tamaño mínimo de cluster debe ser al menos 2')
    .max(1000, 'El tamaño mínimo de cluster no puede exceder 1000'),
  
  minSamples: z
    .number({
      invalid_type_error: 'El número mínimo de muestras debe ser un número',
    })
    .int('El número mínimo de muestras debe ser un número entero')
    .min(1, 'El número mínimo de muestras debe ser al menos 1')
    .max(100, 'El número mínimo de muestras no puede exceder 100')
    .optional(),
});

/**
 * Esquema de validación para parámetros avanzados de clustering
 * 
 * Incluye parámetros adicionales para mayor control del algoritmo.
 * 
 * @constant advancedParamsSchema
 * @category Validation
 * @subcategory Schemas
 */
export const advancedParamsSchema = basicParamsSchema.extend({
  metric: z
    .enum(['euclidean', 'manhattan', 'cosine', 'haversine'], {
      errorMap: () => ({ message: 'La métrica debe ser euclidean, manhattan, cosine o haversine' }),
    })
    .default('euclidean'),
  
  alpha: z
    .number({
      invalid_type_error: 'Alpha debe ser un número',
    })
    .min(0.0, 'Alpha debe ser mayor o igual a 0.0')
    .max(1.0, 'Alpha no puede exceder 1.0')
    .default(1.0)
    .optional(),
  
  clusterSelectionEpsilon: z
    .number({
      invalid_type_error: 'Epsilon de selección de cluster debe ser un número',
    })
    .min(0.0, 'Epsilon de selección de cluster debe ser mayor o igual a 0.0')
    .default(0.0)
    .optional(),
});

/**
 * Esquema de validación para parámetros super avanzados de clustering
 * 
 * Incluye todos los parámetros disponibles para control total del algoritmo.
 * 
 * @constant superAdvancedParamsSchema
 * @category Validation
 * @subcategory Schemas
 */
export const superAdvancedParamsSchema = advancedParamsSchema.extend({
  algorithm: z
    .enum(['auto', 'ball_tree', 'kd_tree', 'brute'], {
      errorMap: () => ({ message: 'El algoritmo debe ser auto, ball_tree, kd_tree o brute' }),
    })
    .default('auto')
    .optional(),
  
  leafSize: z
    .number({
      invalid_type_error: 'El tamaño de hoja debe ser un número',
    })
    .int('El tamaño de hoja debe ser un número entero')
    .min(1, 'El tamaño de hoja debe ser al menos 1')
    .default(30)
    .optional(),
  
  approxMinSpanTree: z
    .boolean({
      invalid_type_error: 'approxMinSpanTree debe ser un booleano',
    })
    .default(true)
    .optional(),
  
  genMinSpanTree: z
    .boolean({
      invalid_type_error: 'genMinSpanTree debe ser un booleano',
    })
    .default(false)
    .optional(),
  
  coreDistNJobs: z
    .number({
      invalid_type_error: 'coreDistNJobs debe ser un número',
    })
    .int('coreDistNJobs debe ser un número entero')
    .min(1, 'coreDistNJobs debe ser al menos 1')
    .default(1)
    .optional(),
  
  clusterSelectionMethod: z
    .enum(['eom', 'leaf'], {
      errorMap: () => ({ message: 'El método de selección de cluster debe ser eom o leaf' }),
    })
    .default('eom')
    .optional(),
  
  allowSingleCluster: z
    .boolean({
      invalid_type_error: 'allowSingleCluster debe ser un booleano',
    })
    .default(false)
    .optional(),
  
  predictionData: z
    .boolean({
      invalid_type_error: 'predictionData debe ser un booleano',
    })
    .default(false)
    .optional(),
  
  matchReferenceImplementation: z
    .boolean({
      invalid_type_error: 'matchReferenceImplementation debe ser un booleano',
    })
    .default(false)
    .optional(),
});

/**
 * Esquema de validación completo para parámetros de clustering
 * 
 * Usa el esquema apropiado según el modo de configuración.
 * 
 * @function getValidationSchema
 * @param mode - Modo de configuración (basic, advanced, super-advanced)
 * @returns Esquema Zod apropiado para el modo
 * 
 * @example
 * ```typescript
 * const schema = getValidationSchema('advanced');
 * const result = schema.safeParse(params);
 * ```
 * 
 * @category Validation
 * @subcategory Schemas
 */
export function getValidationSchema(mode: 'basic' | 'advanced' | 'super-advanced') {
  switch (mode) {
    case 'basic':
      return basicParamsSchema;
    case 'advanced':
      return advancedParamsSchema;
    case 'super-advanced':
      return superAdvancedParamsSchema;
    default:
      return basicParamsSchema;
  }
}

/**
 * Tipo TypeScript inferido del esquema básico
 * 
 * @type BasicParams
 * @category Types
 */
export type BasicParams = z.infer<typeof basicParamsSchema>;

/**
 * Tipo TypeScript inferido del esquema avanzado
 * 
 * @type AdvancedParams
 * @category Types
 */
export type AdvancedParams = z.infer<typeof advancedParamsSchema>;

/**
 * Tipo TypeScript inferido del esquema super avanzado
 * 
 * @type SuperAdvancedParams
 * @category Types
 */
export type SuperAdvancedParams = z.infer<typeof superAdvancedParamsSchema>;

/**
 * Resultado de validación con errores y warnings
 * 
 * @interface ValidationResult
 * @category Types
 * @subcategory Validation
 */
export interface ValidationResult {
  /** Indica si la validación fue exitosa */
  isValid: boolean;
  
  /** Errores de validación encontrados */
  errors: Record<string, string[]>;
  
  /** Advertencias no críticas */
  warnings: string[];
  
  /** Sugerencias de corrección automática */
  suggestions: string[];
}

/**
 * Valida parámetros de clustering y retorna resultado detallado
 * 
 * @param params - Parámetros a validar
 * @param mode - Modo de configuración
 * @returns Resultado de validación con errores, warnings y sugerencias
 * 
 * @example
 * ```typescript
 * const result = validateClusteringParams(
 *   { minClusterSize: 6, minSamples: 2 },
 *   'basic'
 * );
 * 
 * if (!result.isValid) {
 *   console.error('Errores:', result.errors);
 * }
 * ```
 * 
 * @category Validation
 * @subcategory Functions
 */
export function validateClusteringParams(
  params: Partial<ClusteringParameters>,
  mode: 'basic' | 'advanced' | 'super-advanced' = 'basic'
): ValidationResult {
  const schema = getValidationSchema(mode);
  const result = schema.safeParse(params);
  
  const validationResult: ValidationResult = {
    isValid: result.success,
    errors: {},
    warnings: [],
    suggestions: [],
  };
  
  if (!result.success) {
    // Procesar errores de Zod
    const fieldErrors = result.error.flatten().fieldErrors;
    validationResult.errors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, errors]) => [
        key,
        errors || [],
      ])
    );
  }
  
  // Validaciones adicionales y warnings
  if (params.minSamples && params.minClusterSize) {
    if (params.minSamples > params.minClusterSize) {
      validationResult.warnings.push(
        'minSamples es mayor que minClusterSize. Esto puede generar más outliers.'
      );
      validationResult.suggestions.push(
        `Considera establecer minSamples a ${params.minClusterSize} o menos.`
      );
    }
  }
  
  if (params.minClusterSize && params.minClusterSize < 5) {
    validationResult.warnings.push(
      'Un minClusterSize muy pequeño (< 5) puede generar clusters poco significativos.'
    );
  }
  
  if (params.minClusterSize && params.minClusterSize > 100) {
    validationResult.warnings.push(
      'Un minClusterSize muy grande (> 100) puede generar pocos clusters o muchos outliers.'
    );
  }
  
  return validationResult;
}

