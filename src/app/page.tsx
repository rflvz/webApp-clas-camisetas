'use client';

import { ThemeToggle, ThemeCustomizer } from '@/components/theme';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Controles de tema */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <ThemeToggle />
      </div>
      <ThemeCustomizer />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6">
              Interfaz Web para
              <span className="block text-primary">
                Motor de Clustering HDBSCAN
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Una aplicación web moderna construida con Next.js que proporciona una 
              interfaz sofisticada para configurar y gestionar los parámetros del 
              motor de clustering HDBSCAN.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">Modo Básico</h3>
              <p className="text-text-secondary">
                Presets predefinidos: Rápido, Balanceado y Preciso para comenzar rápidamente.
              </p>
            </div>

            <div className="card">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">Modo Avanzado</h3>
              <p className="text-text-secondary">
                Parámetros principales organizados por categorías para mayor control.
              </p>
            </div>

            <div className="card">
              <div className="text-primary mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">Super Avanzado</h3>
              <p className="text-text-secondary">
                Control total de todos los parámetros para usuarios expertos.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-text">Tecnologías</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Next.js 14+
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                TypeScript
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Tailwind CSS
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                PostgreSQL
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Zod
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

