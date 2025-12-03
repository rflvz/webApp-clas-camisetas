/**
 * @fileoverview Editor básico con validación en tiempo real
 * @module components/editor/BasicEditor
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { WarningDisplay } from '@/components/ui/WarningDisplay';
import { SuggestionDisplay } from '@/components/ui/SuggestionDisplay';
import Button from '@/components/Button';
import { useRealtimeValidation } from '@/hooks/useRealtimeValidation';
import { useValidationDependencies } from '@/hooks/useValidationDependencies';
import type { ClusteringParameters } from '@/types';

/**
 * Propiedades del componente BasicEditor
 * 
 * @interface BasicEditorProps
 * @category Types
 */
export interface BasicEditorProps {
  /** Parámetros iniciales */
  initialParams?: Partial<ClusteringParameters>;
  
  /** Callback ejecutado al enviar el formulario */
  onSubmit?: (params: ClusteringParameters) => void;
  
  /** Si el formulario está en estado de carga */
  loading?: boolean;
}

/**
 * Valores por defecto para el editor básico
 * 
 * @constant defaultBasicParams
 * @category Constants
 */
const defaultBasicParams: Partial<ClusteringParameters> = {
  minClusterSize: 6,
  minSamples: 2,
};

/**
 * Componente editor básico con validación en tiempo real
 * 
 * Proporciona una interfaz simple para configurar parámetros básicos
 * de clustering con validación en tiempo real y feedback visual.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del editor básico
 * 
 * @example
 * ```tsx
 * <BasicEditor
 *   initialParams={{ minClusterSize: 6, minSamples: 2 }}
 *   onSubmit={(params) => console.log('Parámetros:', params)}
 * />
 * ```
 * 
 * @category Components
 * @subcategory Editor
 */
export function BasicEditor({
  initialParams = defaultBasicParams,
  onSubmit,
  loading = false,
}: BasicEditorProps) {
  const [params, setParams] = useState<Partial<ClusteringParameters>>(initialParams);

  // Validación en tiempo real (solo en cliente para evitar problemas de hidratación)
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    errors,
    warnings,
    suggestions,
    isValid,
    isValidating,
  } = useRealtimeValidation(params, {
    mode: 'basic',
    debounceMs: 300,
    validateOnMount: isMounted, // Validar solo después de montar en cliente
  });

  // Validación de dependencias
  const dependencyValidation = useValidationDependencies(params);
  const allWarnings = [...warnings, ...dependencyValidation.warnings];
  const allSuggestions = [...suggestions, ...dependencyValidation.suggestions];

  /**
   * Actualiza un parámetro
   * 
   * @function updateParam
   * @param key - Clave del parámetro
   * @param value - Nuevo valor
   */
  const updateParam = useCallback(
    (key: keyof ClusteringParameters, value: string | number | boolean | undefined) => {
      setParams((prev) => {
        // Si el valor es cadena vacía, null o NaN, establecerlo como undefined
        // Pero mantener 0 como valor válido (se validará como error si es minClusterSize)
        let processedValue: string | number | boolean | undefined;
        
        if (value === '' || value === null || (typeof value === 'number' && isNaN(value))) {
          processedValue = undefined;
        } else if (value === 0 && key === 'minClusterSize') {
          // Mantener 0 para minClusterSize para que se detecte como error
          processedValue = 0;
        } else {
          processedValue = value;
        }
        
        return {
          ...prev,
          [key]: processedValue,
        };
      });
    },
    []
  );

  /**
   * Maneja el envío del formulario
   * 
   * @function handleSubmit
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!isValid || dependencyValidation.hasIssues) {
        return;
      }

      if (onSubmit) {
        onSubmit(params as ClusteringParameters);
      }
    },
    [isValid, dependencyValidation.hasIssues, params, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Configuración Básica
        </h2>
        <p className="text-gray-600">
          Configura los parámetros esenciales para el clustering.
        </p>
      </div>

      {/* Errores generales */}
      {dependencyValidation.errors.length > 0 && (
        <ErrorDisplay errors={dependencyValidation.errors} />
      )}

      {/* Advertencias */}
      {allWarnings.length > 0 && (
        <WarningDisplay warnings={allWarnings} />
      )}

      {/* Sugerencias */}
      {allSuggestions.length > 0 && (
        <SuggestionDisplay suggestions={allSuggestions} />
      )}

      {/* Campos del formulario */}
      <div className="space-y-4">
        <Input
          label="Tamaño mínimo de cluster"
          type="number"
          value={params.minClusterSize}
          onChange={(value) => updateParam('minClusterSize', Number(value))}
          errors={errors.minClusterSize}
          helperText="Número mínimo de puntos para formar un cluster (2-1000)"
          required
          min={2}
          max={1000}
          disabled={loading}
        />

        <Input
          label="Número mínimo de muestras"
          type="number"
          value={params.minSamples}
          onChange={(value) => updateParam('minSamples', Number(value))}
          errors={errors.minSamples}
          helperText="Número mínimo de muestras en un cluster (1-100). Recomendado: menor que minClusterSize"
          min={1}
          max={100}
          disabled={loading}
        />
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || dependencyValidation.hasIssues || loading || isValidating}
          loading={loading || isValidating}
        >
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </div>
    </form>
  );
}

export default BasicEditor;

