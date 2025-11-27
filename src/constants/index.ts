// Constantes globales de la aplicación

// Configuración de clustering
export const CLUSTERING_PRESETS = {
  FAST: 'fast',
  BALANCED: 'balanced',
  PRECISE: 'precise',
} as const;

// Configuración de UI
export const THEME = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;

// Configuración de API
export const API_ENDPOINTS = {
  CLUSTERING: '/api/clustering',
  UPLOAD: '/api/upload',
  RESULTS: '/api/results',
} as const;

// Configuración de validación
export const VALIDATION = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['.csv', '.json', '.xlsx'],
  MIN_CLUSTER_SIZE: 2,
  MAX_CLUSTER_SIZE: 1000,
} as const;
