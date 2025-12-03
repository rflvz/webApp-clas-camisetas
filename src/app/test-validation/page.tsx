/**
 * @fileoverview Página de prueba para validación en tiempo real
 * @module app/test-validation/page
 */

'use client';

import { useState } from 'react';
import { BasicEditor, AdvancedEditor, SuperAdvancedEditor } from '@/components/editor';
import type { ClusteringParameters } from '@/types';

/**
 * Página de prueba para validación en tiempo real
 * 
 * Permite probar los tres modos de editor con validación en tiempo real.
 * 
 * @component
 * @returns Elemento JSX de la página de prueba
 * 
 * @category Pages
 */
export default function TestValidationPage() {
  const [activeMode, setActiveMode] = useState<'basic' | 'advanced' | 'super-advanced'>('basic');
  const [submittedParams, setSubmittedParams] = useState<ClusteringParameters | null>(null);

  /**
   * Maneja el envío de parámetros
   * 
   * @function handleSubmit
   * @param params - Parámetros validados
   */
  const handleSubmit = (params: ClusteringParameters) => {
    setSubmittedParams(params);
    console.log('Parámetros enviados:', params);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prueba de Validación en Tiempo Real
          </h1>
          <p className="text-gray-600">
            Prueba los tres modos de editor con validación en tiempo real.
          </p>
        </div>

        {/* Selector de modo */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveMode('basic')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeMode === 'basic'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Modo Básico
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('advanced')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeMode === 'advanced'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Modo Avanzado
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('super-advanced')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeMode === 'super-advanced'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Modo Super Avanzado
            </button>
          </div>
        </div>

        {/* Editor activo */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {activeMode === 'basic' && (
            <BasicEditor
              initialParams={{
                minClusterSize: 6,
                minSamples: 2,
              }}
              onSubmit={handleSubmit}
            />
          )}

          {activeMode === 'advanced' && (
            <AdvancedEditor
              initialParams={{
                minClusterSize: 6,
                minSamples: 2,
                metric: 'euclidean',
                alpha: 1.0,
                clusterSelectionEpsilon: 0.0,
              }}
              onSubmit={handleSubmit}
            />
          )}

          {activeMode === 'super-advanced' && (
            <SuperAdvancedEditor
              initialParams={{
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
              }}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Resultado del envío */}
        {submittedParams && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              ✅ Parámetros Enviados Correctamente
            </h2>
            <pre className="bg-white p-4 rounded border border-green-200 overflow-auto text-sm">
              {JSON.stringify(submittedParams, null, 2)}
            </pre>
            <button
              type="button"
              onClick={() => setSubmittedParams(null)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Limpiar
            </button>
          </div>
        )}

        {/* Instrucciones de prueba */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Instrucciones de Prueba
          </h2>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>
              <strong>Validación en tiempo real:</strong> Cambia los valores de los campos y observa cómo
              aparecen errores, warnings y sugerencias automáticamente.
            </li>
            <li>
              <strong>Errores:</strong> Intenta poner un valor inválido (ej: minClusterSize = 1) y verás
              el error en rojo.
            </li>
            <li>
              <strong>Warnings:</strong> Intenta poner minSamples mayor que minClusterSize para ver
              un warning en amarillo.
            </li>
            <li>
              <strong>Sugerencias:</strong> Observa las sugerencias automáticas que aparecen cuando
              hay problemas de configuración.
            </li>
            <li>
              <strong>Debouncing:</strong> Escribe rápidamente en un campo y nota que la validación
              espera 300ms antes de ejecutarse.
            </li>
            <li>
              <strong>Botón de envío:</strong> El botón se deshabilita automáticamente cuando hay
              errores o la validación está en curso.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

