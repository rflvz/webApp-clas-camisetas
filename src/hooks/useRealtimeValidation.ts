/**
 * @fileoverview Hook para validación en tiempo real con debouncing
 * @module hooks/useRealtimeValidation
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from '@/lib/utils';
import { validateClusteringParams, type ValidationResult } from '@/lib/validation';
import type { ClusteringParameters } from '@/types';

/**
 * Opciones de configuración para el hook de validación en tiempo real
 * 
 * @interface UseRealtimeValidationOptions
 * @category Types
 */
export interface UseRealtimeValidationOptions {
  /** Tiempo de debounce en milisegundos (default: 300) */
  debounceMs?: number;
  
  /** Modo de validación (basic, advanced, super-advanced) */
  mode?: 'basic' | 'advanced' | 'super-advanced';
  
  /** Si debe validar inmediatamente al montar el componente */
  validateOnMount?: boolean;
  
  /** Callback ejecutado cuando la validación cambia */
  onValidationChange?: (result: ValidationResult) => void;
}

/**
 * Resultado del hook de validación en tiempo real
 * 
 * @interface UseRealtimeValidationResult
 * @category Types
 */
export interface UseRealtimeValidationResult {
  /** Errores de validación por campo */
  errors: Record<string, string[]>;
  
  /** Advertencias no críticas */
  warnings: string[];
  
  /** Sugerencias de corrección */
  suggestions: string[];
  
  /** Indica si la validación fue exitosa */
  isValid: boolean;
  
  /** Indica si se está validando actualmente */
  isValidating: boolean;
  
  /** Función para validar manualmente */
  validate: () => ValidationResult;
  
  /** Función para limpiar errores */
  clearErrors: () => void;
}

/**
 * Hook para validación en tiempo real de parámetros de clustering
 * 
 * Proporciona validación automática con debouncing para evitar
 * validaciones excesivas durante la escritura del usuario.
 * 
 * @param params - Parámetros de clustering a validar
 * @param options - Opciones de configuración del hook
 * @returns Objeto con errores, warnings, sugerencias y funciones de control
 * 
 * @example
 * ```typescript
 * const { errors, warnings, isValid, isValidating } = useRealtimeValidation(
 *   formParams,
 *   {
 *     mode: 'advanced',
 *     debounceMs: 300,
 *     onValidationChange: (result) => {
 *       console.log('Validación:', result);
 *     }
 *   }
 * );
 * 
 * // Usar en componente
 * <Input
 *   error={errors.minClusterSize?.[0]}
 *   warning={warnings[0]}
 * />
 * ```
 * 
 * @category Hooks
 * @subcategory Validation
 */
export function useRealtimeValidation(
  params: Partial<ClusteringParameters>,
  options: UseRealtimeValidationOptions = {}
): UseRealtimeValidationResult {
  const {
    debounceMs = 300,
    mode = 'basic',
    validateOnMount = false,
    onValidationChange,
  } = options;

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: {},
    warnings: [],
    suggestions: [],
  });
  
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Función de validación
   * 
   * @function performValidation
   * @returns Resultado de la validación
   * @category Internal
   */
  const performValidation = useCallback((): ValidationResult => {
    setIsValidating(true);
    
    let result: ValidationResult;
    try {
      result = validateClusteringParams(params, mode);
      setValidationResult(result);
      
      if (onValidationChange) {
        onValidationChange(result);
      }
    } catch (error) {
      console.error('Error en validación:', error);
      result = {
        isValid: false,
        errors: { _general: ['Error inesperado en la validación'] },
        warnings: [],
        suggestions: [],
      };
      setValidationResult(result);
    } finally {
      setIsValidating(false);
    }
    
    return result;
  }, [params, mode, onValidationChange]);

  // Memoizar función de validación con debounce
  const debouncedValidate = useMemo(
    () => debounce(performValidation, debounceMs),
    [performValidation, debounceMs]
  );

  // Efecto para validación en tiempo real
  useEffect(() => {
    // Validar inmediatamente si validateOnMount está activado y es la primera vez
    if (validateOnMount) {
      performValidation();
    } else {
      debouncedValidate();
    }

    // Cleanup: cancelar validación pendiente si el componente se desmonta
    return () => {
      // El debounce ya maneja el cleanup internamente
    };
  }, [params, debouncedValidate, validateOnMount, performValidation]);

  /**
   * Función para validar manualmente
   * 
   * @function validate
   * @returns Resultado de la validación
   */
  const validate = useCallback((): ValidationResult => {
    return performValidation();
  }, [performValidation]);

  /**
   * Función para limpiar errores
   * 
   * @function clearErrors
   */
  const clearErrors = useCallback(() => {
    setValidationResult({
      isValid: true,
      errors: {},
      warnings: [],
      suggestions: [],
    });
  }, []);

  return {
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    suggestions: validationResult.suggestions,
    isValid: validationResult.isValid,
    isValidating,
    validate,
    clearErrors,
  };
}

