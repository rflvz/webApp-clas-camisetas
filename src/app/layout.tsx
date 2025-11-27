import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interfaz Web HDBSCAN Clustering',
  description: 'Interfaz web moderna para configurar y gestionar parámetros del motor de clustering HDBSCAN',
  keywords: ['clustering', 'HDBSCAN', 'machine learning', 'data analysis'],
  authors: [{ name: 'Equipo Clasificadoria' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div id="root" className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}

