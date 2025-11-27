# Arquitectura del Proyecto

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura de Componentes](#arquitectura-de-componentes)
- [Flujo de Datos](#flujo-de-datos)
- [API Design](#api-design)
- [Base de Datos](#base-de-datos)
- [Patrones de Diseño](#patrones-de-diseño)
- [Performance](#performance)
- [Seguridad](#seguridad)

## Visión General

La Interfaz Web para Motor de Clustering HDBSCAN es una aplicación web moderna construida con Next.js que proporciona una interfaz sofisticada para configurar y gestionar parámetros del algoritmo de clustering HDBSCAN.

### Objetivos Arquitectónicos

- **Modularidad**: Componentes reutilizables y bien definidos
- **Escalabilidad**: Arquitectura que permita crecimiento futuro
- **Mantenibilidad**: Código limpio y bien documentado
- **Performance**: Carga rápida y experiencia fluida
- **Accesibilidad**: Interfaz accesible para todos los usuarios

## Stack Tecnológico

### Frontend
- **Next.js 14+**: Framework React con App Router
- **TypeScript**: Tipado estático para JavaScript
- **Tailwind CSS**: Framework de utilidades CSS
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **Lucide React**: Iconografía

### Backend
- **Next.js API Routes**: Endpoints del servidor
- **PostgreSQL**: Base de datos relacional
- **Prisma**: ORM para base de datos
- **Zod**: Validación de datos del servidor

### Desarrollo y Calidad
- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **Jest**: Testing unitario
- **Playwright**: Testing end-to-end
- **Husky**: Git hooks
- **Commitlint**: Validación de commits

### Deployment y CI/CD
- **Vercel**: Hosting y deployment
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Containerización (opcional)

## Estructura del Proyecto

```
app-clas-camisetas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página home
│   │   ├── globals.css        # Estilos globales
│   │   └── api/               # API Routes
│   │       ├── clusters/      # Endpoints de clustering
│   │       ├── presets/       # Endpoints de presets
│   │       └── validation/    # Endpoints de validación
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (Button, Input, etc.)
│   │   ├── forms/            # Componentes de formularios
│   │   ├── editor/           # Componentes del editor
│   │   └── layout/           # Componentes de layout
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilidades y configuraciones
│   ├── types/                # Definiciones de tipos TypeScript
│   ├── utils/                # Funciones de utilidad
│   └── styles/               # Estilos adicionales
├── docs/                     # Documentación del proyecto
├── public/                   # Assets estáticos
├── prisma/                   # Esquemas y migraciones de BD
├── tests/                    # Tests del proyecto
└── .github/                  # Templates y workflows
```

### Convenciones de Organización

#### Componentes (`src/components/`)

```
components/
├── ui/                       # Componentes base reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── index.ts             # Barrel exports
├── forms/                   # Componentes específicos de formularios
│   ├── ClusterForm.tsx
│   ├── PresetSelector.tsx
│   └── ParameterInput.tsx
├── editor/                  # Componentes del editor de parámetros
│   ├── BasicEditor.tsx
│   ├── AdvancedEditor.tsx
│   └── SuperAdvancedEditor.tsx
└── layout/                  # Componentes de layout
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx
```

#### Hooks (`src/hooks/`)

```
hooks/
├── useLocalStorage.ts       # Persistencia local
├── useClusterParams.ts      # Manejo de parámetros
├── usePresets.ts           # Manejo de presets
└── useValidation.ts        # Validación en tiempo real
```

#### Utilidades (`src/lib/` y `src/utils/`)

```
lib/
├── db.ts                   # Configuración de base de datos
├── validation.ts           # Esquemas de validación Zod
├── constants.ts            # Constantes del proyecto
└── config.ts              # Configuración de la aplicación

utils/
├── clustering.ts           # Utilidades de clustering
├── formatting.ts           # Formateo de datos
├── api.ts                 # Helpers para API calls
└── testing.ts             # Utilidades para testing
```

## Arquitectura de Componentes

### Jerarquía de Componentes

```
App Layout
├── Header
│   ├── Navigation
│   └── UserMenu
├── Main Content
│   ├── Editor Mode Selector
│   ├── Parameter Editor
│   │   ├── Basic Editor
│   │   │   └── Preset Selector
│   │   ├── Advanced Editor
│   │   │   ├── Parameter Groups
│   │   │   └── Parameter Inputs
│   │   └── Super Advanced Editor
│   │       ├── All Parameters
│   │       └── Custom Validation
│   ├── Preview Panel
│   └── Results Display
└── Footer
```

### Patrones de Componentes

#### 1. Compound Components

```typescript
// Uso de compound components para flexibilidad
<ParameterEditor>
  <ParameterEditor.Header title="Clustering Parameters" />
  <ParameterEditor.Body>
    <ParameterGroup name="Core Parameters">
      <ParameterInput name="min_cluster_size" />
      <ParameterInput name="eps" />
    </ParameterGroup>
  </ParameterEditor.Body>
  <ParameterEditor.Footer>
    <Button>Apply</Button>
  </ParameterEditor.Footer>
</ParameterEditor>
```

#### 2. Render Props

```typescript
// Para compartir lógica entre componentes
<ValidationProvider>
  {({ errors, validate, isValid }) => (
    <ClusterForm
      onValidate={validate}
      errors={errors}
      canSubmit={isValid}
    />
  )}
</ValidationProvider>
```

#### 3. Custom Hooks

```typescript
// Encapsular lógica de estado compleja
function useClusterParams() {
  const [params, setParams] = useState(defaultParams);
  const [errors, setErrors] = useState({});
  
  const validateParams = useCallback((newParams) => {
    // Lógica de validación
  }, []);
  
  return { params, setParams, errors, validateParams };
}
```

## Flujo de Datos

### Estado Global vs Local

#### Estado Local (React State)
- **UI State**: Loading, modals, form inputs
- **Temporary Data**: Draft parameters, validation errors
- **Component-specific**: Accordion states, tabs

#### Estado Persistente (LocalStorage)
- **User Preferences**: Theme, language, layout
- **Draft Work**: Unsaved parameter configurations
- **Session Data**: Recent presets, history

### Flujo de Validación

```
User Input → Client Validation → Server Validation → Database
     ↓              ↓                    ↓              ↓
  Real-time     Form Submit        API Response    Persistence
  Feedback      Validation         Validation      
```

#### 1. Client-side Validation (Zod)

```typescript
const parameterSchema = z.object({
  min_cluster_size: z.number().min(2).max(1000),
  eps: z.number().min(0.01).max(10),
  metric: z.enum(['euclidean', 'manhattan', 'cosine'])
});

// Validación en tiempo real
const { errors } = useValidation(parameterSchema, formData);
```

#### 2. Server-side Validation (API Routes)

```typescript
// /api/clusters/validate
export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const validParams = parameterSchema.parse(body);
    return NextResponse.json({ valid: true, params: validParams });
  } catch (error) {
    return NextResponse.json({ valid: false, errors: error.errors });
  }
}
```

## API Design

### RESTful Endpoints

```
GET    /api/presets              # Listar presets disponibles
POST   /api/presets              # Crear nuevo preset
GET    /api/presets/:id          # Obtener preset específico
PUT    /api/presets/:id          # Actualizar preset
DELETE /api/presets/:id          # Eliminar preset

POST   /api/clusters/validate    # Validar parámetros
POST   /api/clusters/execute     # Ejecutar clustering
GET    /api/clusters/results/:id # Obtener resultados

GET    /api/parameters/schema    # Obtener esquema de parámetros
GET    /api/parameters/defaults  # Obtener valores por defecto
```

### Estructura de Respuestas

```typescript
// Respuesta exitosa
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Respuesta de error
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Respuesta de validación
interface ValidationResponse {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}
```

## Base de Datos

### Esquema Principal

```sql
-- Presets de configuración
CREATE TABLE presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parameters JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Resultados de clustering
CREATE TABLE cluster_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parameters JSONB NOT NULL,
  results JSONB NOT NULL,
  execution_time INTEGER, -- milliseconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- Configuraciones de usuario
CREATE TABLE user_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  config_name VARCHAR(255) NOT NULL,
  config_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Índices para Performance

```sql
-- Búsqueda de presets por nombre
CREATE INDEX idx_presets_name ON presets(name);

-- Filtros por fecha
CREATE INDEX idx_presets_created_at ON presets(created_at);
CREATE INDEX idx_cluster_results_created_at ON cluster_results(created_at);

-- Búsqueda en parámetros JSON
CREATE INDEX idx_presets_parameters ON presets USING GIN(parameters);
CREATE INDEX idx_cluster_results_parameters ON cluster_results USING GIN(parameters);
```

## Patrones de Diseño

### 1. Factory Pattern (Presets)

```typescript
interface PresetFactory {
  createPreset(type: PresetType): ClusterPreset;
}

class HDBSCANPresetFactory implements PresetFactory {
  createPreset(type: PresetType): ClusterPreset {
    switch (type) {
      case 'fast':
        return new FastPreset();
      case 'balanced':
        return new BalancedPreset();
      case 'accurate':
        return new AccuratePreset();
    }
  }
}
```

### 2. Strategy Pattern (Validation)

```typescript
interface ValidationStrategy {
  validate(params: ClusterParams): ValidationResult;
}

class BasicValidation implements ValidationStrategy {
  validate(params: ClusterParams): ValidationResult {
    // Validación básica
  }
}

class AdvancedValidation implements ValidationStrategy {
  validate(params: ClusterParams): ValidationResult {
    // Validación avanzada con reglas complejas
  }
}
```

### 3. Observer Pattern (Real-time Updates)

```typescript
class ParameterStore {
  private observers: Observer[] = [];
  
  subscribe(observer: Observer) {
    this.observers.push(observer);
  }
  
  notify(change: ParameterChange) {
    this.observers.forEach(observer => observer.update(change));
  }
}
```

## Performance

### Optimizaciones de React

#### 1. Code Splitting

```typescript
// Lazy loading de componentes pesados
const SuperAdvancedEditor = lazy(() => import('./SuperAdvancedEditor'));

function EditorSelector({ mode }: { mode: EditorMode }) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      {mode === 'super-advanced' && <SuperAdvancedEditor />}
    </Suspense>
  );
}
```

#### 2. Memoización

```typescript
// Memoizar componentes costosos
const ParameterVisualization = memo(({ params }: { params: ClusterParams }) => {
  const visualization = useMemo(() => 
    generateVisualization(params), [params]
  );
  
  return <div>{visualization}</div>;
});

// Memoizar cálculos pesados
const useOptimalParameters = (data: DataPoint[]) => {
  return useMemo(() => {
    return calculateOptimalParams(data);
  }, [data]);
};
```

#### 3. Virtualization

```typescript
// Para listas grandes de parámetros
import { FixedSizeList as List } from 'react-window';

function ParameterList({ parameters }: { parameters: Parameter[] }) {
  return (
    <List
      height={400}
      itemCount={parameters.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          <ParameterItem parameter={parameters[index]} />
        </div>
      )}
    </List>
  );
}
```

### Optimizaciones de Next.js

#### 1. Static Generation

```typescript
// Generar páginas estáticas para presets
export async function generateStaticParams() {
  const presets = await getPublicPresets();
  
  return presets.map((preset) => ({
    id: preset.id,
  }));
}
```

#### 2. Image Optimization

```typescript
import Image from 'next/image';

// Optimización automática de imágenes
<Image
  src="/clustering-diagram.png"
  alt="HDBSCAN Clustering Diagram"
  width={800}
  height={600}
  priority // Para imágenes above-the-fold
/>
```

## Seguridad

### Validación de Entrada

```typescript
// Sanitización en API routes
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input);
};

// Validación estricta de parámetros
const parameterSchema = z.object({
  min_cluster_size: z.number().int().min(2).max(10000),
  eps: z.number().min(0.001).max(100),
  // Prevenir inyección en strings
  metric: z.enum(['euclidean', 'manhattan', 'cosine'])
});
```

### Rate Limiting

```typescript
// Limitar requests a API
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request);
  
  const { success } = await rateLimit.limit(identifier);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // Procesar request...
}
```

### CORS y Headers de Seguridad

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};
```

---

Para más información sobre el proyecto, consulta:
- [README principal](../README.md)
- [Guía de contribución](./contributing.md)
- [Estrategia de branching](./branching-strategy.md)
