/**
 * @fileoverview Componente para mostrar sugerencias de corrección
 * @module components/ui/SuggestionDisplay
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Propiedades del componente SuggestionDisplay
 * 
 * @interface SuggestionDisplayProps
 * @category Types
 */
export interface SuggestionDisplayProps {
  /** Mensaje de sugerencia a mostrar */
  suggestion?: string;
  
  /** Múltiples mensajes de sugerencia */
  suggestions?: string[];
  
  /** Clases CSS adicionales */
  className?: string;
  
  /** Si la sugerencia debe mostrarse de forma compacta */
  compact?: boolean;
  
  /** Callback ejecutado cuando el usuario hace clic en aplicar sugerencia */
  onApply?: (suggestion: string) => void;
}

/**
 * Componente para mostrar sugerencias de corrección automática
 * 
 * Proporciona feedback visual sobre cómo mejorar la configuración
 * y permite aplicar sugerencias automáticamente.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del display de sugerencia
 * 
 * @example
 * ```tsx
 * // Sugerencia simple
 * <SuggestionDisplay 
 *   suggestion="Considera establecer minSamples a 2"
 *   onApply={(s) => applySuggestion(s)}
 * />
 * 
 * // Múltiples sugerencias
 * <SuggestionDisplay suggestions={["Sugerencia 1", "Sugerencia 2"]} />
 * ```
 * 
 * @category Components
 * @subcategory UI
 */
export function SuggestionDisplay({
  suggestions: suggestionsProp,
  className,
  compact = false,
  onApply,
}: SuggestionDisplayProps) {
  const suggestionList = suggestionsProp || [];

  if (suggestionList.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1 text-blue-600 text-sm', className)}>
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{suggestionList[0]}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-blue-50 border border-blue-200 p-3',
        className
      )}
    >
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-800 mb-1">
            Sugerencias
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {suggestionList.map((sugg, index) => (
              <li key={index} className="text-sm text-blue-700 flex items-center justify-between">
                <span>{sugg}</span>
                {onApply && (
                  <button
                    type="button"
                    onClick={() => onApply(sugg)}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium underline"
                  >
                    Aplicar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SuggestionDisplay;

