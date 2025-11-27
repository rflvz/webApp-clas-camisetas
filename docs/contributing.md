# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto de Interfaz Web para Motor de Clustering HDBSCAN! Esta guía te ayudará a entender cómo participar en el desarrollo del proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Documentación](#documentación)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Features](#solicitar-features)
- [Pull Requests](#pull-requests)

## Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

## Cómo Contribuir

Hay muchas maneras de contribuir al proyecto:

- 🐛 **Reportar bugs**
- 💡 **Sugerir nuevas features**
- 📝 **Mejorar documentación**
- 🧪 **Escribir tests**
- 💻 **Contribuir código**
- 🎨 **Mejorar UI/UX**

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- Git
- Editor de código (recomendado: VS Code con extensiones)

### Instalación

1. **Fork el repositorio**
   ```bash
   # Hacer fork en GitHub, luego clonar tu fork
   git clone https://github.com/TU-USUARIO/webApp-clas-camisetas.git
   cd webApp-clas-camisetas
   ```

2. **Configurar remotes**
   ```bash
   git remote add upstream https://github.com/rflvz/webApp-clas-camisetas.git
   git remote -v
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus configuraciones
   ```

5. **Configurar base de datos**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Verificar instalación**
   ```bash
   npm run dev
   # Abrir http://localhost:3000
   ```

### Extensiones Recomendadas (VS Code)

- **ESLint**: Linting de JavaScript/TypeScript
- **Prettier**: Formateo automático de código
- **Tailwind CSS IntelliSense**: Autocompletado para Tailwind
- **TypeScript Importer**: Auto-import de TypeScript
- **GitLens**: Información avanzada de Git
- **Thunder Client**: Testing de APIs

## Flujo de Trabajo

### 1. Sincronizar con Upstream

```bash
git checkout develop
git pull upstream develop
git push origin develop
```

### 2. Crear Feature Branch

```bash
# Para nuevas features
git checkout -b feature/DNT-XXX-descripcion-corta

# Para fixes
git checkout -b fix/DNT-XXX-descripcion-bug

# Para documentación
git checkout -b docs/DNT-XXX-descripcion-docs
```

### 3. Desarrollo

- Hacer cambios siguiendo los estándares de código
- Escribir tests para nuevas funcionalidades
- Actualizar documentación si es necesario
- Hacer commits siguiendo convenciones

### 4. Testing

```bash
# Ejecutar tests
npm run test

# Linting
npm run lint

# Build
npm run build
```

### 5. Commit y Push

```bash
git add .
git commit -m "feat(scope): descripción del cambio

Descripción detallada del cambio realizado.

Closes DNT-XXX"

git push origin feature/DNT-XXX-descripcion-corta
```

### 6. Crear Pull Request

- Ir a GitHub y crear PR desde tu branch hacia `develop`
- Usar el template de PR proporcionado
- Asignar reviewers apropiados
- Enlazar con el issue correspondiente

## Estándares de Código

### Convenciones de Naming

#### Archivos y Directorios

- **Componentes React**: `PascalCase.tsx` (ej: `PresetSelector.tsx`)
- **Hooks**: `camelCase.ts` con prefijo `use` (ej: `useLocalStorage.ts`)
- **Utilities**: `camelCase.ts` (ej: `formatDate.ts`)
- **Types**: `camelCase.ts` o `PascalCase.ts` (ej: `types.ts`, `ApiTypes.ts`)
- **Pages**: `kebab-case.tsx` o `page.tsx` (Next.js App Router)

#### Variables y Funciones

```typescript
// Variables: camelCase
const userName = 'john';
const isLoading = false;

// Funciones: camelCase
function calculateClusterSize() {}
const handleSubmit = () => {};

// Constantes: SCREAMING_SNAKE_CASE
const MAX_CLUSTER_SIZE = 1000;
const API_ENDPOINTS = {
  USERS: '/api/users',
  CLUSTERS: '/api/clusters'
};

// Tipos e Interfaces: PascalCase
interface UserProfile {
  id: string;
  name: string;
}

type ClusterParams = {
  minClusterSize: number;
  eps: number;
};
```

### Estructura de Componentes

```typescript
// Imports
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { validateInput } from '@/utils/validation';
import type { ComponentProps } from '@/types';

// Types (si son específicos del componente)
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

// Component
export function ComponentName({ title, onSubmit }: Props) {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // Handlers
  const handleClick = () => {
    // Implementation
  };
  
  // Render
  return (
    <div className="container">
      <h1>{title}</h1>
      <Button onClick={handleClick} disabled={isLoading}>
        Submit
      </Button>
    </div>
  );
}

// Default export (si es necesario)
export default ComponentName;
```

### Convenciones de CSS/Tailwind

```typescript
// Usar clsx para clases condicionales
import clsx from 'clsx';

const buttonClasses = clsx(
  'px-4 py-2 rounded-md font-medium transition-colors',
  {
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled,
  }
);

// Organizar clases por categoría
<div className={clsx(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'px-6 py-4 mb-4',
  // Appearance
  'bg-white border border-gray-200 rounded-lg shadow-sm',
  // Interactive
  'hover:shadow-md transition-shadow'
)}>
```

## Testing

### Estructura de Tests

```
src/
├── components/
│   ├── Button.tsx
│   └── __tests__/
│       └── Button.test.tsx
├── utils/
│   ├── validation.ts
│   └── __tests__/
│       └── validation.test.ts
└── __tests__/
    ├── setup.ts
    └── helpers/
```

### Convenciones de Testing

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Coverage Requirements

- **Componentes**: Mínimo 80% coverage
- **Utilities**: Mínimo 90% coverage
- **API Routes**: Mínimo 85% coverage

## Documentación

### JSDoc para Funciones Complejas

```typescript
/**
 * Calcula los parámetros óptimos para clustering HDBSCAN
 * @param data - Array de puntos de datos para clustering
 * @param options - Opciones de configuración
 * @param options.minClusterSize - Tamaño mínimo de cluster (default: 5)
 * @param options.eps - Radio de vecindario (default: 0.5)
 * @returns Objeto con parámetros calculados y métricas
 * @throws {ValidationError} Cuando los datos de entrada son inválidos
 * @example
 * ```typescript
 * const params = calculateOptimalParams(dataPoints, {
 *   minClusterSize: 10,
 *   eps: 0.3
 * });
 * ```
 */
export function calculateOptimalParams(
  data: DataPoint[],
  options: ClusterOptions = {}
): ClusterParams {
  // Implementation
}
```

### README de Componentes

Para componentes complejos, crear un README:

```markdown
# PresetSelector Component

## Overview
Componente para seleccionar presets predefinidos de clustering.

## Usage
\`\`\`typescript
import { PresetSelector } from '@/components/PresetSelector';

<PresetSelector
  presets={availablePresets}
  onSelect={handlePresetSelect}
  defaultValue="balanced"
/>
\`\`\`

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| presets | Preset[] | - | Array de presets disponibles |
| onSelect | (preset: Preset) => void | - | Callback cuando se selecciona preset |
| defaultValue | string | undefined | Preset seleccionado por defecto |

## Examples
Ver `PresetSelector.stories.tsx` para ejemplos completos.
```

## Reportar Bugs

### Antes de Reportar

1. **Buscar issues existentes** para evitar duplicados
2. **Verificar en la última versión** si el bug persiste
3. **Reproducir el bug** de manera consistente

### Template de Bug Report

Usar el template `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
**Describe el bug**
Descripción clara y concisa del problema.

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ir a '...'
2. Hacer click en '....'
3. Scroll down to '....'
4. Ver error

**Comportamiento Esperado**
Descripción clara de lo que esperabas que pasara.

**Screenshots**
Si aplica, añadir screenshots para explicar el problema.

**Información del Sistema:**
- OS: [ej: Windows 11]
- Browser: [ej: Chrome 91]
- Node Version: [ej: 18.17.0]
- Versión del Proyecto: [ej: v0.1.0]
```

## Solicitar Features

### Template de Feature Request

```markdown
**¿Tu feature request está relacionada con un problema?**
Descripción clara del problema. Ej: "Me frustra cuando [...]"

**Describe la solución que te gustaría**
Descripción clara y concisa de lo que quieres que pase.

**Describe alternativas que has considerado**
Descripción clara de soluciones o features alternativas.

**Contexto adicional**
Añadir cualquier otro contexto o screenshots sobre el feature request.
```

## Pull Requests

### Checklist de PR

Antes de crear un PR, verificar:

- [ ] **Branch actualizado** con `develop`
- [ ] **Tests pasan** (`npm run test`)
- [ ] **Linting pasa** (`npm run lint`)
- [ ] **Build exitoso** (`npm run build`)
- [ ] **Commits siguen convenciones**
- [ ] **Documentación actualizada** si es necesario
- [ ] **Screenshots incluidos** para cambios de UI
- [ ] **Issue enlazado** correctamente

### Template de PR

Usar el template `.github/pull_request_template.md`:

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentación
- [ ] 🎨 Refactoring

## Issues relacionados
Closes #DNT-XXX

## Criterios de aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## Screenshots
[Si aplica, añadir screenshots]
```

### Proceso de Review

1. **Auto-review**: Revisar tu propio código antes de solicitar review
2. **Asignar reviewers**: Mínimo 1 reviewer, idealmente 2
3. **Responder feedback**: Abordar todos los comentarios
4. **Re-request review**: Después de hacer cambios
5. **Merge**: Solo después de aprobación

### Merge Strategy

- **Squash and merge** para features pequeñas
- **Merge commit** para features grandes con commits lógicos
- **Rebase and merge** para hotfixes simples

## Recursos Adicionales

### Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Testing Library](https://testing-library.com/docs/)

### Comunicación

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas y discusiones generales
- **Linear**: Para tracking de trabajo interno

---

¡Gracias por contribuir al proyecto! 🎉

Para más información, consulta:
- [Estrategia de Branching](./branching-strategy.md)
- [Arquitectura del Proyecto](./architecture.md)
- [README Principal](../README.md)
