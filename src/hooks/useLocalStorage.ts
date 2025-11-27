'use client';

import { useState } from 'react';

/**
 * Hook personalizado para manejar localStorage con TypeScript de forma segura
 * 
 * Proporciona una interfaz similar a useState pero persiste los datos en localStorage.
 * Maneja automáticamente la serialización/deserialización JSON y los errores de acceso.
 * 
 * @template T - Tipo de dato que se almacenará en localStorage
 * @param key - Clave única para identificar el valor en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns Tupla con el valor actual y función para actualizarlo
 * 
 * @example
 * ```typescript
 * // Almacenar un string
 * const [name, setName] = useLocalStorage('userName', 'Anónimo');
 * 
 * // Almacenar un objeto
 * const [settings, setSettings] = useLocalStorage('userSettings', {
 *   theme: 'light',
 *   language: 'es'
 * });
 * 
 * // Actualizar valor
 * setName('Juan Pérez');
 * setSettings(prev => ({ ...prev, theme: 'dark' }));
 * ```
 * 
 * @category Hooks
 * @since 1.0.0
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((previousValue: T) => T)) => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value: T | ((previousValue: T) => T)) => {
    try {
      // Permitir que el valor sea una función para tener la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en el estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

