'use client';

import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar localStorage con TypeScript
 * 
 * El setter está memoizado para evitar recreaciones innecesarias y problemas
 * con dependencias en useEffect.
 * 
 * @param key - Clave para almacenar en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns Tupla con el valor actual y la función setter memoizada
 * 
 * @example
 * ```typescript
 * const [value, setValue] = useLocalStorage('theme', 'light');
 * setValue('dark'); // Actualiza estado y localStorage
 * ```
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

  // Función para actualizar el valor - memoizada para estabilidad de referencia
  const setValue = useCallback((value: T | ((previousValue: T) => T)) => {
    try {
      // Usar la función de actualización funcional para acceder al valor actual
      setStoredValue((prevValue) => {
        // Permitir que el valor sea una función para tener la misma API que useState
        const valueToStore = value instanceof Function ? value(prevValue) : value;
        
        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
          }
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]); // Solo depende de la key, que es estable

  return [storedValue, setValue];
}

