'use client';

import { ThemeProvider } from '@/context/ThemeContext';

/**
 * Wrapper del ThemeProvider para usar en componentes de servidor
 * 
 * @component
 * @param props - Propiedades del componente
 * @returns Wrapper del ThemeProvider
 * 
 * @example
 * ```tsx
 * <ThemeProviderWrapper>
 *   <App />
 * </ThemeProviderWrapper>
 * ```
 * 
 * @category Components
 * @subcategory Theme
 */
export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

