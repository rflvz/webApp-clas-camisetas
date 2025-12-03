/**
 * @fileoverview Componente para mostrar errores de validación
 * @module components/ui/ErrorDisplay
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Propiedades del componente ErrorDisplay
 * 
 * @interface ErrorDisplayProps
 * @category Types
 */
export interface ErrorDisplayProps {
  /** Mensaje de error a mostrar */
  error?: string;
  
  /** Múltiples mensajes de error */
  errors?: string[];
  
  /** Clases CSS adicionales */
  className?: string;
  
  /** Si el error debe mostrarse de forma compacta */
  compact?: boolean;
}

/**
 * Componente para mostrar errores de validación de forma visual
 * 
 * Proporciona feedback visual claro sobre errores de validación
 * con iconos y estilos consistentes.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del display de error
 * 
 * @example
 * ```tsx
 * // Error simple
 * <ErrorDisplay error="El valor debe ser mayor que 2" />
 * 
 * // Múltiples errores
 * <ErrorDisplay errors={["Error 1", "Error 2"]} />
 * 
 * // Compacto
 * <ErrorDisplay error="Error" compact />
 * ```
 * 
 * @category Components
 * @subcategory UI
 */
export function ErrorDisplay({
  error,
  errors,
  className,
  compact = false,
}: ErrorDisplayProps) {
  const errorList = errors || (error ? [error] : []);

  if (errorList.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1 text-red-600 text-sm', className)}>
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
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{errorList[0]}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-red-50 border border-red-200 p-3',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-800 mb-1">
            Errores de validación
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {errorList.map((err, index) => (
              <li key={index} className="text-sm text-red-700">
                {err}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;

