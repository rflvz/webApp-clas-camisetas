/**
 * @fileoverview Editor avanzado con validación en tiempo real
 * @module components/editor/AdvancedEditor
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { WarningDisplay } from '@/components/ui/WarningDisplay';
import { SuggestionDisplay } from '@/components/ui/SuggestionDisplay';
import Button from '@/components/Button';
import { useRealtimeValidation } from '@/hooks/useRealtimeValidation';
import { useValidationDependencies } from '@/hooks/useValidationDependencies';
import type { ClusteringParameters } from '@/types';

/**
 * Propiedades del componente AdvancedEditor
 * 
 * @interface AdvancedEditorProps
 * @category Types
 */
export interface AdvancedEditorProps {
  /** Parámetros iniciales */
  initialParams?: Partial<ClusteringParameters>;
  
  /** Callback ejecutado al enviar el formulario */
  onSubmit?: (params: ClusteringParameters) => void;
  
  /** Si el formulario está en estado de carga */
  loading?: boolean;
}

/**
 * Valores por defecto para el editor avanzado
 * 
 * @constant defaultAdvancedParams
 * @category Constants
 */
const defaultAdvancedParams: Partial<ClusteringParameters> = {
  minClusterSize: 6,
  minSamples: 2,
  metric: 'euclidean',
  alpha: 1.0,
  clusterSelectionEpsilon: 0.0,
};

/**
 * Opciones de métricas disponibles
 * 
 * @constant metricOptions
 * @category Constants
 */
const metricOptions = [
  { value: 'euclidean', label: 'Euclidiana' },
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'cosine', label: 'Coseno' },
  { value: 'haversine', label: 'Haversine' },
];

/**
 * Componente editor avanzado con validación en tiempo real
 * 
 * Proporciona una interfaz para configurar parámetros avanzados
 * de clustering con validación en tiempo real y feedback visual.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del editor avanzado
 * 
 * @example
 * ```tsx
 * <AdvancedEditor
 *   initialParams={{ minClusterSize: 6, metric: 'euclidean' }}
 *   onSubmit={(params) => console.log('Parámetros:', params)}
 * />
 * ```
 * 
 * @category Components
 * @subcategory Editor
 */
export function AdvancedEditor({
  initialParams = defaultAdvancedParams,
  onSubmit,
  loading = false,
}: AdvancedEditorProps) {
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
    mode: 'advanced',
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
      setParams((prev) => ({
        ...prev,
        [key]: value,
      }));
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
          Configuración Avanzada
        </h2>
        <p className="text-gray-600">
          Configura parámetros avanzados para mayor control del algoritmo.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            helperText="Número mínimo de muestras (1-100)"
            min={1}
            max={100}
            disabled={loading}
          />
        </div>

        <Select
          label="Métrica de distancia"
          value={params.metric}
          onChange={(value) => updateParam('metric', String(value))}
          options={metricOptions}
          errors={errors.metric}
          helperText="Métrica utilizada para calcular distancias entre puntos"
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Alpha"
            type="number"
            value={params.alpha}
            onChange={(value) => updateParam('alpha', Number(value))}
            errors={errors.alpha}
            helperText="Parámetro alpha para HDBSCAN (0.0-1.0)"
            min={0.0}
            max={1.0}
            step={0.1}
            disabled={loading}
          />

          <Input
            label="Epsilon de selección de cluster"
            type="number"
            value={params.clusterSelectionEpsilon}
            onChange={(value) => updateParam('clusterSelectionEpsilon', Number(value))}
            errors={errors.clusterSelectionEpsilon}
            helperText="Epsilon para selección de clusters (≥ 0.0)"
            min={0.0}
            step={0.01}
            disabled={loading}
          />
        </div>
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

export default AdvancedEditor;

