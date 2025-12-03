/**
 * @fileoverview Componente Input reutilizable con validación integrada
 * @module components/ui/Input
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ErrorDisplay } from './ErrorDisplay';
import { WarningDisplay } from './WarningDisplay';
import type { InputProps as BaseInputProps } from '@/types';

/**
 * Propiedades del componente Input
 * 
 * @interface InputProps
 * @extends BaseInputProps
 * @category Types
 */
export interface InputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'value'> {
  /** Valor del input */
  value?: string | number;
  
  /** Callback ejecutado cuando el valor cambia */
  onChange?: (value: string | number) => void;
  
  /** Errores de validación */
  errors?: string[];
  
  /** Advertencias de validación */
  warnings?: string[];
  
  /** Tipo de input */
  type?: 'text' | 'number' | 'email' | 'password';
  
  /** Placeholder del input */
  placeholder?: string;
  
  /** Si el input está en estado de carga */
  loading?: boolean;
}

/**
 * Componente Input reutilizable con validación integrada
 * 
 * Proporciona un input con soporte para validación en tiempo real,
 * errores, advertencias y feedback visual.
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Elemento JSX del input con validación
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Tamaño mínimo de cluster"
 *   type="number"
 *   value={minClusterSize}
 *   onChange={(value) => setMinClusterSize(Number(value))}
 *   errors={errors.minClusterSize}
 *   warnings={warnings}
 *   helperText="Debe ser entre 2 y 1000"
 *   required
 * />
 * ```
 * 
 * @category Components
 * @subcategory UI
 */
export function Input({
  label,
  error,
  errors,
  helperText,
  required = false,
  disabled = false,
  className,
  value,
  onChange,
  warnings,
  type = 'text',
  placeholder,
  loading = false,
  ...props
}: InputProps) {
  const inputErrors = errors || (error ? [error] : []);
  const hasError = inputErrors.length > 0;
  const hasWarning = warnings && warnings.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValue = type === 'number' ? e.target.valueAsNumber : e.target.value;
      onChange(newValue);
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
      
      <div className="relative">
        <input
          type={type}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          required={required}
          className={cn(
            'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : hasWarning
              ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
            disabled && 'bg-gray-100 cursor-not-allowed',
            loading && 'opacity-50'
          )}
          {...props}
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
      
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

export default Input;

