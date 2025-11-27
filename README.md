# Interfaz Web para Motor de Clustering HDBSCAN

Una aplicación web moderna construida con Next.js que proporciona una interfaz sofisticada para configurar y gestionar los parámetros del motor de clustering HDBSCAN.

## 🚀 Características

- **Tres modos de configuración**:
  - 🎯 **Básico**: Presets predefinidos (Rápido, Balanceado, Preciso)
  - ⚙️ **Avanzado**: Parámetros principales organizados por categorías
  - 🔧 **Super Avanzado**: Control total de todos los parámetros

- **Tecnologías**:
  - Next.js 14+ con App Router
  - TypeScript
  - Tailwind CSS
  - PostgreSQL
  - Zod para validación

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- Git

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/rflvz/webApp-clas-camisetas.git
cd webApp-clas-camisetas

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar migraciones de base de datos
npm run db:migrate

# Iniciar servidor de desarrollo
npm run dev
```

## 🌳 Flujo de Desarrollo

Este proyecto utiliza **Git Flow Simplificado** para el desarrollo colaborativo. Para información detallada, consulta la [Estrategia de Branching](./docs/branching-strategy.md).

### Ramas Principales

- **`main`**: Código de producción estable, protegido
- **`develop`**: Branch de integración principal para desarrollo

### Crear Nueva Feature

```bash
# Crear branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/DNT-XXX-descripcion-corta

# Hacer cambios y commits
git add .
git commit -m "feat(scope): descripción del cambio

- Detalle del cambio 1
- Detalle del cambio 2

Closes DNT-XXX"

# Push y crear PR hacia develop
git push origin feature/DNT-XXX-descripcion-corta
```

### Convenciones de Naming

- **Features**: `feature/DNT-XXX-descripcion-kebab-case`
- **Fixes**: `fix/DNT-XXX-descripcion-kebab-case`
- **Docs**: `docs/DNT-XXX-descripcion-kebab-case`
- **Releases**: `release/milestone-X-nombre-corto`

### Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción corta>

<descripción detallada opcional>

Closes DNT-XXX
```

**Tipos válidos**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Scopes válidos**: `setup`, `api`, `ui`, `editor`, `validation`, `database`, `test`, `docs`

### Documentación Completa

- 📋 [Estrategia de Branching](./docs/branching-strategy.md) - Flujo completo de Git
- 🤝 [Guía de Contribución](./docs/contributing.md) - Cómo contribuir al proyecto

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run test         # Tests unitarios
npm run test:e2e     # Tests end-to-end
npm run db:migrate   # Migraciones de BD
npm run db:seed      # Seed de datos
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests end-to-end
npm run test:e2e
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React reutilizables
│   ├── ui/               # Componentes UI básicos (Button, Input, etc.)
│   ├── layout/           # Componentes de layout (Header, Footer, etc.)
│   ├── forms/            # Componentes de formularios
│   ├── clustering/       # Componentes específicos de clustering
│   └── index.ts          # Exportaciones centralizadas
├── hooks/                # Custom hooks de React
├── lib/                  # Utilidades y configuraciones
├── types/                # Definiciones de tipos TypeScript
├── utils/                # Funciones utilitarias
├── styles/               # Estilos globales y CSS
├── constants/            # Constantes de la aplicación
├── services/             # Servicios y lógica de negocio
└── context/              # Contextos de React
```

### Paths Absolutos Configurados

El proyecto utiliza paths absolutos para imports más limpios:

```typescript
// En lugar de: import { Button } from '../../../components/Button'
import { Button } from '@/components/Button'
import { ClusteringService } from '@/services/clustering'
import { CLUSTERING_PRESETS } from '@/constants'
```

## 📚 Documentación

- [Arquitectura del Proyecto](./docs/architecture.md)
- [Guía de Contribución](./docs/contributing.md)
- [API Reference](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/DNT-XXX-amazing-feature`)
3. Commit cambios (`git commit -m 'feat: add amazing feature'`)
4. Push al branch (`git push origin feature/DNT-XXX-amazing-feature`)
5. Crear Pull Request

Ver [Guía de Contribución](./docs/contributing.md) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔗 Enlaces

- [Repositorio GitHub](https://github.com/rflvz/webApp-clas-camisetas)
- [Proyecto Linear](https://linear.app/clasificadoria/project/interfaz-web-para-motor-de-clustering-hdbscan-ba3ef12aca6f)
- [Documentación HDBSCAN](https://hdbscan.readthedocs.io/)

## 📞 Soporte

Si tienes preguntas o problemas, por favor:

1. Revisa la [documentación](./docs/)
2. Busca en [issues existentes](https://github.com/rflvz/webApp-clas-camisetas/issues)
3. Crea un [nuevo issue](https://github.com/rflvz/webApp-clas-camisetas/issues/new/choose)

---

Desarrollado con ❤️ para el proyecto de clustering HDBSCAN
