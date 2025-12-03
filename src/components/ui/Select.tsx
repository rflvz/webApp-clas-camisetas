/**
 * @fileoverview Componente Select reutilizable con validación integrada
 * @module components/ui/Select
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ErrorDisplay } from './ErrorDisplay';
import { WarningDisplay } from './WarningDisplay';

/**
 * Opción del select
 * 
 * @interface SelectOption
 * @category Types
 */
export interface SelectOption {
  /** Valor de la opción */
  value: string | number;
  
  /** Etiqueta de la opción */
  label: string;
  
  /** Si la opción está deshabilitada */
  disabled?: boolean;
}

/**
 * Propiedades del componente Select
 * 
 * @interface SelectProps
 * @category Types
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange' | 'value'> {
  /** Etiqueta del select */
  label?: string;
  
  /** Opciones del select */
  options: SelectOption[];
  
  /** Valor seleccionado */
  value?: string | number;
  
  /** Callback ejecutado cuando el valor cambia */
  onChange?: (value: string | number) => void;
  
  /** Errores de validación */
  errors?: string[];
  
  /** Advertencias de validación */
  warnings?: string[];
  
  /** Texto de ayuda */
  helperText?: string;
  
  /** Si el campo es requerido */
  required?: boolean;
  
  /** Si el select está deshabilitado */
  disabled?: boolean;
  
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente Select reutilizable con validación integrada
 * 
 * Proporciona un select con soporte para validación en tiempo real,
 * errores, advertencias y feedback visual.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del select con validación
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Métrica de distancia"
 *   value={metric}
 *   onChange={(value) => setMetric(value)}
 *   options={[
 *     { value: 'euclidean', label: 'Euclidiana' },
 *     { value: 'manhattan', label: 'Manhattan' },
 *   ]}
 *   errors={errors.metric}
 *   helperText="Selecciona la métrica de distancia"
 * />
 * ```
 * 
 * @category Components
 * @subcategory UI
 */
export function Select({
  label,
  value,
  onChange,
  options,
  errors,
  warnings,
  helperText,
  required = false,
  disabled = false,
  className,
  ...props
}: SelectProps) {
  const inputErrors = errors || [];
  const hasError = inputErrors.length > 0;
  const hasWarning = warnings && warnings.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      const selectedOption = options.find(
        (opt) => String(opt.value) === e.target.value
      );
      if (selectedOption) {
        onChange(selectedOption.value);
      }
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value ?? ''}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          hasError
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : hasWarning
            ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          disabled && 'bg-gray-100 cursor-not-allowed'
        )}
        {...props}
      >
        {!required && <option value="">Selecciona una opción</option>}
        {options.map((option) => (
          <option
            key={String(option.value)}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {helperText && !hasError && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {hasError && (
        <div className="mt-1">
          <ErrorDisplay errors={inputErrors} compact />
        </div>
      )}
      
      {hasWarning && !hasError && (
        <div className="mt-1">
          <WarningDisplay warnings={warnings} compact />
        </div>
      )}
    </div>
  );
}

export default Select;

