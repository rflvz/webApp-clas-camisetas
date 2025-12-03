/**
 * @fileoverview Hook para validar dependencias entre parámetros de clustering
 * @module hooks/useValidationDependencies
 */

'use client';

import { useMemo } from 'react';
import type { ClusteringParameters } from '@/types';

/**
 * Resultado de validación de dependencias
 * 
 * @interface DependencyValidationResult
 * @category Types
 */
export interface DependencyValidationResult {
  /** Errores de dependencias encontrados */
  errors: string[];
  
  /** Advertencias sobre dependencias */
  warnings: string[];
  
  /** Sugerencias para resolver problemas de dependencias */
  suggestions: string[];
  
  /** Indica si hay problemas de dependencias */
  hasIssues: boolean;
}

/**
 * Hook para validar dependencias entre parámetros de clustering
 * 
 * Valida relaciones lógicas entre parámetros, como que minSamples
 * no sea mayor que minClusterSize, o que ciertos parámetros solo
 * tengan sentido cuando otros están activados.
 * 
 * @param params - Parámetros de clustering a validar
 * @returns Resultado de validación de dependencias
 * 
 * @example
 * ```typescript
 * const { errors, warnings, hasIssues } = useValidationDependencies(params);
 * 
 * if (hasIssues) {
 *   console.warn('Problemas de dependencias:', warnings);
 * }
 * ```
 * 
 * @category Hooks
 * @subcategory Validation
 */
export function useValidationDependencies(
  params: Partial<ClusteringParameters>
): DependencyValidationResult {
  const result = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validación: minSamples no debe ser mayor que minClusterSize
    if (params.minSamples !== undefined && params.minClusterSize !== undefined) {
      if (params.minSamples > params.minClusterSize) {
        errors.push(
          'minSamples no puede ser mayor que minClusterSize. Esto generará solo outliers.'
        );
        suggestions.push(
          `Establece minSamples a ${params.minClusterSize} o menos para permitir clusters.`
        );
      } else if (params.minSamples === params.minClusterSize) {
        warnings.push(
          'minSamples es igual a minClusterSize. Esto puede generar clusters muy estrictos.'
        );
        suggestions.push(
          `Considera establecer minSamples a ${Math.max(1, params.minClusterSize - 1)} para mayor flexibilidad.`
        );
      }
    }

    // Validación: clusterSelectionEpsilon con valores muy altos
    if (params.clusterSelectionEpsilon !== undefined && params.clusterSelectionEpsilon > 0.5) {
      warnings.push(
        'Un clusterSelectionEpsilon muy alto (> 0.5) puede fusionar clusters distintos.'
      );
      suggestions.push(
        'Considera usar un valor menor (0.0-0.3) para mayor granularidad de clusters.'
      );
    }

    // Validación: alpha fuera del rango recomendado
    if (params.alpha !== undefined) {
      if (params.alpha < 0.1) {
        warnings.push(
          'Un alpha muy bajo (< 0.1) puede generar demasiados clusters pequeños.'
        );
      } else if (params.alpha > 0.9) {
        warnings.push(
          'Un alpha muy alto (> 0.9) puede generar pocos clusters grandes.'
        );
      }
    }

    // Validación: leafSize muy pequeño para algoritmos de árbol
    if (params.algorithm && params.algorithm !== 'brute' && params.algorithm !== 'auto') {
      if (params.leafSize !== undefined && params.leafSize < 10) {
        warnings.push(
          `Un leafSize muy pequeño (< 10) para ${params.algorithm} puede ser ineficiente.`
        );
        suggestions.push(
          'Considera usar un leafSize de al menos 10 para mejor rendimiento.'
        );
      }
    }

    // Validación: coreDistNJobs con valores muy altos
    if (params.coreDistNJobs !== undefined && params.coreDistNJobs > 8) {
      warnings.push(
        'Un coreDistNJobs muy alto (> 8) puede no mejorar el rendimiento significativamente.'
      );
    }

    // Validación: allowSingleCluster con minClusterSize muy alto
    if (params.allowSingleCluster && params.minClusterSize !== undefined) {
      if (params.minClusterSize > 50) {
        warnings.push(
          'allowSingleCluster con minClusterSize alto puede generar un solo cluster grande.'
        );
        suggestions.push(
          'Considera desactivar allowSingleCluster o reducir minClusterSize.'
        );
      }
    }

    return {
      errors,
      warnings,
      suggestions,
      hasIssues: errors.length > 0 || warnings.length > 0,
    };
  }, [params]);

  return result;
}

