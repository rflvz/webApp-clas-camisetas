// Tipos principales para la aplicación HDBSCAN

export interface ClusteringConfig {
  id?: string;
  name: string;
  mode: 'basic' | 'advanced' | 'super-advanced';
  parameters: ClusteringParameters;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClusteringParameters {
  // Parámetros básicos
  minClusterSize: number;
  minSamples?: number;
  
  // Parámetros avanzados
  metric?: string;
  alpha?: number;
  clusterSelectionEpsilon?: number;
  
  // Parámetros super avanzados
  algorithm?: 'auto' | 'ball_tree' | 'kd_tree' | 'brute';
  leafSize?: number;
  approxMinSpanTree?: boolean;
  genMinSpanTree?: boolean;
  coreDistNJobs?: number;
  clusterSelectionMethod?: 'eom' | 'leaf';
  allowSingleCluster?: boolean;
  predictionData?: boolean;
  matchReferenceImplementation?: boolean;
}

export interface PresetConfig {
  name: string;
  description: string;
  parameters: ClusteringParameters;
}

export interface ClusteringResult {
  id: string;
  configId: string;
  labels: number[];
  probabilities?: number[];
  clusterPersistence?: number[];
  condensedTree?: any;
  singleLinkageTree?: any;
  executionTime: number;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para componentes UI
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Tipos para formularios
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'checkbox' | 'range';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
}

