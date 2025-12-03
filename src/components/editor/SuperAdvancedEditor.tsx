/**
 * @fileoverview Editor super avanzado con validación en tiempo real
 * @module components/editor/SuperAdvancedEditor
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
 * Propiedades del componente SuperAdvancedEditor
 * 
 * @interface SuperAdvancedEditorProps
 * @category Types
 */
export interface SuperAdvancedEditorProps {
  /** Parámetros iniciales */
  initialParams?: Partial<ClusteringParameters>;
  
  /** Callback ejecutado al enviar el formulario */
  onSubmit?: (params: ClusteringParameters) => void;
  
  /** Si el formulario está en estado de carga */
  loading?: boolean;
}

/**
 * Valores por defecto para el editor super avanzado
 * 
 * @constant defaultSuperAdvancedParams
 * @category Constants
 */
const defaultSuperAdvancedParams: Partial<ClusteringParameters> = {
  minClusterSize: 6,
  minSamples: 2,
  metric: 'euclidean',
  alpha: 1.0,
  clusterSelectionEpsilon: 0.0,
  algorithm: 'auto',
  leafSize: 30,
  approxMinSpanTree: true,
  genMinSpanTree: false,
  coreDistNJobs: 1,
  clusterSelectionMethod: 'eom',
  allowSingleCluster: false,
  predictionData: false,
  matchReferenceImplementation: false,
};

/**
 * Opciones de algoritmos disponibles
 * 
 * @constant algorithmOptions
 * @category Constants
 */
const algorithmOptions = [
  { value: 'auto', label: 'Automático' },
  { value: 'ball_tree', label: 'Ball Tree' },
  { value: 'kd_tree', label: 'KD Tree' },
  { value: 'brute', label: 'Fuerza bruta' },
];

/**
 * Opciones de métodos de selección de cluster
 * 
 * @constant clusterSelectionMethodOptions
 * @category Constants
 */
const clusterSelectionMethodOptions = [
  { value: 'eom', label: 'Excess of Mass (EOM)' },
  { value: 'leaf', label: 'Leaf' },
];

/**
 * Componente editor super avanzado con validación en tiempo real
 * 
 * Proporciona una interfaz completa para configurar todos los parámetros
 * de clustering con validación en tiempo real y feedback visual.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del editor super avanzado
 * 
 * @example
 * ```tsx
 * <SuperAdvancedEditor
 *   initialParams={defaultParams}
 *   onSubmit={(params) => console.log('Parámetros:', params)}
 * />
 * ```
 * 
 * @category Components
 * @subcategory Editor
 */
export function SuperAdvancedEditor({
  initialParams = defaultSuperAdvancedParams,
  onSubmit,
  loading = false,
}: SuperAdvancedEditorProps) {
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
    mode: 'super-advanced',
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
          Configuración Super Avanzada
        </h2>
        <p className="text-gray-600">
          Control total sobre todos los parámetros del algoritmo HDBSCAN.
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
      <div className="space-y-6">
        {/* Parámetros básicos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Parámetros Básicos
          </h3>
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
        </div>

        {/* Parámetros avanzados */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Parámetros Avanzados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Métrica de distancia"
              value={params.metric}
              onChange={(value) => updateParam('metric', String(value))}
              options={[
                { value: 'euclidean', label: 'Euclidiana' },
                { value: 'manhattan', label: 'Manhattan' },
                { value: 'cosine', label: 'Coseno' },
                { value: 'haversine', label: 'Haversine' },
              ]}
              errors={errors.metric}
              disabled={loading}
            />

            <Input
              label="Alpha"
              type="number"
              value={params.alpha}
              onChange={(value) => updateParam('alpha', Number(value))}
              errors={errors.alpha}
              helperText="Parámetro alpha (0.0-1.0)"
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
              helperText="Epsilon para selección (≥ 0.0)"
              min={0.0}
              step={0.01}
              disabled={loading}
            />
          </div>
        </div>

        {/* Parámetros super avanzados */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Parámetros Super Avanzados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Algoritmo de árbol"
              value={params.algorithm}
              onChange={(value) => updateParam('algorithm', String(value))}
              options={algorithmOptions}
              errors={errors.algorithm}
              disabled={loading}
            />

            <Input
              label="Tamaño de hoja"
              type="number"
              value={params.leafSize}
              onChange={(value) => updateParam('leafSize', Number(value))}
              errors={errors.leafSize}
              helperText="Tamaño de hoja para algoritmos de árbol (≥ 1)"
              min={1}
              disabled={loading}
            />

            <Input
              label="Número de trabajos (coreDistNJobs)"
              type="number"
              value={params.coreDistNJobs}
              onChange={(value) => updateParam('coreDistNJobs', Number(value))}
              errors={errors.coreDistNJobs}
              helperText="Número de trabajos para cálculo de distancia (≥ 1)"
              min={1}
              disabled={loading}
            />

            <Select
              label="Método de selección de cluster"
              value={params.clusterSelectionMethod}
              onChange={(value) => updateParam('clusterSelectionMethod', String(value))}
              options={clusterSelectionMethodOptions}
              errors={errors.clusterSelectionMethod}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="approxMinSpanTree"
                checked={params.approxMinSpanTree ?? false}
                onChange={(e) => updateParam('approxMinSpanTree', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="approxMinSpanTree" className="text-sm text-gray-700">
                Usar aproximación para árbol de expansión mínima
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="genMinSpanTree"
                checked={params.genMinSpanTree ?? false}
                onChange={(e) => updateParam('genMinSpanTree', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="genMinSpanTree" className="text-sm text-gray-700">
                Generar árbol de expansión mínima
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowSingleCluster"
                checked={params.allowSingleCluster ?? false}
                onChange={(e) => updateParam('allowSingleCluster', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="allowSingleCluster" className="text-sm text-gray-700">
                Permitir cluster único
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="predictionData"
                checked={params.predictionData ?? false}
                onChange={(e) => updateParam('predictionData', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="predictionData" className="text-sm text-gray-700">
                Almacenar datos de predicción
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="matchReferenceImplementation"
                checked={params.matchReferenceImplementation ?? false}
                onChange={(e) => updateParam('matchReferenceImplementation', e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="matchReferenceImplementation" className="text-sm text-gray-700">
                Coincidir con implementación de referencia
              </label>
            </div>
          </div>
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

export default SuperAdvancedEditor;

