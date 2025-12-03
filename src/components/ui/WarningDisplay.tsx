/**
 * @fileoverview Componente para mostrar advertencias de validación
 * @module components/ui/WarningDisplay
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Propiedades del componente WarningDisplay
 * 
 * @interface WarningDisplayProps
 * @category Types
 */
export interface WarningDisplayProps {
  /** Mensaje de advertencia a mostrar */
  warning?: string;
  
  /** Múltiples mensajes de advertencia */
  warnings?: string[];
  
  /** Clases CSS adicionales */
  className?: string;
  
  /** Si la advertencia debe mostrarse de forma compacta */
  compact?: boolean;
}

/**
 * Componente para mostrar advertencias de validación de forma visual
 * 
 * Proporciona feedback visual sobre configuraciones subóptimas o
 * potencialmente problemáticas sin bloquear la acción del usuario.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del display de advertencia
 * 
 * @example
 * ```tsx
 * // Advertencia simple
 * <WarningDisplay warning="Esta configuración puede generar muchos outliers" />
 * 
 * // Múltiples advertencias
 * <WarningDisplay warnings={["Warning 1", "Warning 2"]} />
 * 
 * // Compacto
 * <WarningDisplay warning="Warning" compact />
 * ```
 * 
 * @category Components
 * @subcategory UI
 */
export function WarningDisplay({
  warning,
  warnings,
  className,
  compact = false,
}: WarningDisplayProps) {
  const warningList = warnings || (warning ? [warning] : []);

  if (warningList.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1 text-amber-600 text-sm', className)}>
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{warningList[0]}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-amber-50 border border-amber-200 p-3',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800 mb-1">
            Advertencias
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {warningList.map((warn, index) => (
              <li key={index} className="text-sm text-amber-700">
                {warn}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WarningDisplay;

