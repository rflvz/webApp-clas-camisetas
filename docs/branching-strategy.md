# Estrategia de Branching y Flujo de Desarrollo

## 📋 Tabla de Contenidos

- [Objetivo](#objetivo)
- [Estrategia de Branching: Git Flow Simplificado](#estrategia-de-branching-git-flow-simplificado)
- [Estructura de Branches](#estructura-de-branches)
- [Flujo de Trabajo por Milestone](#flujo-de-trabajo-por-milestone)
- [Convenciones de Naming](#convenciones-de-naming)
- [Flujo de Desarrollo Detallado](#flujo-de-desarrollo-detallado)
- [Estrategia de Tagging](#estrategia-de-tagging)
- [Convenciones de Commit Messages](#convenciones-de-commit-messages)
- [Protección de Branches](#protección-de-branches)
- [Integración con Linear](#integración-con-linear)
- [Flujo por Milestone](#flujo-por-milestone)
- [Casos Especiales](#casos-especiales)
- [Recursos y Herramientas](#recursos-y-herramientas)
- [Checklist de Implementación](#checklist-de-implementación)

## Objetivo

Definir y documentar la estrategia de branching para el proyecto de interfaz de clustering, estableciendo convenciones claras para el desarrollo colaborativo y la gestión de releases.

Una estrategia de branching bien definida es esencial para mantener un flujo de desarrollo ordenado, facilitar la colaboración entre desarrolladores y asegurar la estabilidad del código en producción.

## Estrategia de Branching: Git Flow Simplificado

### 🌳 Estructura de Branches

#### Branches Principales

1. **`main` (Producción)**
   - Código estable y listo para producción
   - Solo se actualiza mediante merge de `develop`
   - Cada commit representa una release
   - Protegido: requiere PR y revisión

2. **`develop` (Desarrollo)**
   - Branch de integración principal
   - Contiene las últimas funcionalidades completadas
   - Base para crear feature branches
   - Se actualiza constantemente durante el desarrollo

#### Branches de Trabajo

3. **`feature/DNT-XXX-descripcion-corta` (Features)**
   - Para desarrollo de nuevas funcionalidades
   - Se crean desde `develop`
   - Se mergean de vuelta a `develop`
   - Formato: `feature/DNT-118-setup-nextjs`

4. **`fix/DNT-XXX-descripcion-corta` (Hotfixes)**
   - Para corrección de bugs críticos
   - Se crean desde `main` (si es crítico) o `develop`
   - Se mergean a `main` y `develop`
   - Formato: `fix/DNT-XXX-corregir-validacion`

5. **`release/milestone-X-nombre` (Releases)**
   - Para preparar releases de milestones
   - Se crean desde `develop`
   - Permiten últimos ajustes antes de producción
   - Formato: `release/milestone-1-fundacion`

### 🔄 Flujo de Trabajo por Milestone

#### Fase 1: Desarrollo de Features

```
develop
├── feature/DNT-118-setup-nextjs
├── feature/DNT-119-esquema-postgresql
├── feature/DNT-120-cursor-rules
└── feature/DNT-121-estructura-directorios
```

#### Fase 2: Integración de Milestone

```
develop → release/milestone-1-fundacion
```

#### Fase 3: Release a Producción

```
release/milestone-1-fundacion → main
release/milestone-1-fundacion → develop (merge back)
```

## Convenciones de Naming

### Feature Branches

- **Formato**: `feature/DNT-XXX-descripcion-kebab-case`
- **Ejemplos**:
  - `feature/DNT-118-setup-nextjs-typescript`
  - `feature/DNT-123-validacion-zod-schemas`
  - `feature/DNT-133-modo-basico-presets`

### Fix Branches

- **Formato**: `fix/DNT-XXX-descripcion-kebab-case`
- **Ejemplos**:
  - `fix/DNT-124-api-routes-error-handling`
  - `fix/DNT-136-validacion-tiempo-real`

### Docs Branches

- **Formato**: `docs/DNT-XXX-descripcion-kebab-case`
- **Ejemplos**:
  - `docs/DNT-152-estrategia-branching-flujo-desarrollo`
  - `docs/DNT-XXX-guia-contribucion`

### Release Branches

- **Formato**: `release/milestone-X-nombre-corto`
- **Ejemplos**:
  - `release/milestone-1-fundacion`
  - `release/milestone-2-backend`
  - `release/milestone-4-editor`

## Flujo de Desarrollo Detallado

### 1. Iniciar Nueva Feature

```bash
# Desde develop
git checkout develop
git pull origin develop
git checkout -b feature/DNT-118-setup-nextjs

# Desarrollo...
git add .
git commit -m "feat(setup): configurar Next.js con TypeScript

- Instalar Next.js 14+ con App Router
- Configurar TypeScript con strict mode
- Setup inicial de Tailwind CSS
- Configurar ESLint y Prettier

Closes DNT-118"
```

### 2. Pull Request y Review

```bash
# Push feature branch
git push origin feature/DNT-118-setup-nextjs

# Crear PR: feature/DNT-118-setup-nextjs → develop
# Título: "feat(setup): configurar Next.js con TypeScript (DNT-118)"
# Descripción: Link al issue, criterios de aceptación, screenshots si aplica
```

### 3. Merge a Develop

```bash
# Después de aprobación
git checkout develop
git pull origin develop
git merge --no-ff feature/DNT-118-setup-nextjs
git push origin develop
git branch -d feature/DNT-118-setup-nextjs
```

### 4. Release de Milestone

```bash
# Al completar milestone
git checkout develop
git pull origin develop
git checkout -b release/milestone-1-fundacion

# Últimos ajustes, actualizar versión, changelog
git commit -m "chore(release): preparar milestone 1 - fundación técnica"
git push origin release/milestone-1-fundacion

# PR: release/milestone-1-fundacion → main
# PR: release/milestone-1-fundacion → develop (merge back)
```

## Estrategia de Tagging

### Tags de Milestone

- **Formato**: `milestone-X.Y.Z`
- **Ejemplos**:
  - `milestone-1.0.0` - Fundación Técnica
  - `milestone-2.0.0` - Backend y Validación
  - `milestone-4.1.0` - Editor v1.1 (hotfix)

### Tags de Release

- **Formato**: `v1.0.0` (Semantic Versioning)
- **Ejemplos**:
  - `v0.1.0` - Primera release (Milestone 1-2)
  - `v0.5.0` - Release intermedia (Milestone 1-4)
  - `v1.0.0` - Release final (Todos los milestones)

## Convenciones de Commit Messages

### Formato Estándar

```
<tipo>(<scope>): <descripción corta>

<descripción detallada>

<footer con referencias a issues>
```

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactoring de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### Scopes Recomendados

- `setup`: Configuración inicial
- `api`: API Routes y backend
- `ui`: Componentes de interfaz
- `editor`: Modos del editor
- `validation`: Esquemas y validación
- `database`: Esquemas y migraciones
- `test`: Testing y calidad
- `docs`: Documentación

### Ejemplos de Commits

```bash
feat(editor): implementar modo básico con presets

- Crear componente PresetSelector
- Integrar con API de presets
- Añadir validación de selección
- Implementar preview de configuración

Closes DNT-133

fix(api): corregir validación de parámetros HDBSCAN

- Ajustar esquema Zod para min_cluster_size
- Validar rangos de parámetros correctamente
- Mejorar mensajes de error

Fixes DNT-123

docs(branching): añadir estrategia de branching al proyecto

- Documentar Git Flow simplificado
- Definir convenciones de naming
- Establecer flujo de releases por milestone

Closes DNT-152
```

## Protección de Branches

### Branch `main`

- ✅ Require pull request reviews (1+ reviewers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Require linear history

### Branch `develop`

- ✅ Require pull request reviews (1+ reviewers)
- ✅ Require status checks to pass
- ✅ Allow force pushes (solo para maintainers)

## Integración con Linear

### Automatización de Issues

- **Commits** que referencian `DNT-XXX` se vinculan automáticamente
- **PRs** que incluyen `Closes DNT-XXX` cierran el issue al mergear
- **Branch names** con `DNT-XXX` se vinculan al issue

### Estados de Issue por Branch

- **Feature branch creado** → Issue pasa a "In Progress"
- **PR creado** → Issue pasa a "In Review"
- **PR mergeado** → Issue pasa a "Done"

## Flujo por Milestone

### Milestone 1: Fundación Técnica

```
develop
├── feature/DNT-118-setup-nextjs ✅
├── feature/DNT-119-esquema-postgresql ✅
├── feature/DNT-120-cursor-rules ✅
└── feature/DNT-121-estructura-directorios ✅
    ↓
release/milestone-1-fundacion
    ↓
main (tag: milestone-1.0.0)
```

### Milestone 2: Backend y Validación

```
develop
├── feature/DNT-123-validacion-zod ✅
├── feature/DNT-124-api-routes ✅
├── feature/DNT-125-presets-predefinidos ✅
└── feature/DNT-126-integracion-mock ✅
    ↓
release/milestone-2-backend
    ↓
main (tag: milestone-2.0.0)
```

## Casos Especiales

### Hotfixes Críticos

```bash
# Bug crítico en producción
git checkout main
git pull origin main
git checkout -b fix/DNT-XXX-critical-bug

# Fix...
git commit -m "fix(critical): corregir bug crítico en validación"
git push origin fix/DNT-XXX-critical-bug

# PR → main (deploy inmediato)
# PR → develop (merge back)
```

### Features Grandes (Multi-issue)

```bash
# Para features que abarcan múltiples issues
git checkout -b feature/milestone-4-editor-completo

# Commits incrementales
git commit -m "feat(editor): implementar modo básico (DNT-133)"
git commit -m "feat(editor): añadir modo avanzado (DNT-134)"
git commit -m "feat(editor): crear modo super avanzado (DNT-135)"
```

## Recursos y Herramientas

### Git Hooks Recomendados

- **pre-commit**: Linting, formatting, tests
- **commit-msg**: Validar formato de commit messages
- **pre-push**: Ejecutar tests antes de push

### Herramientas de Apoyo

- **Conventional Commits**: Para formato consistente
- **Semantic Release**: Para versionado automático
- **GitHub Actions**: Para CI/CD automatizado
- **Linear Integration**: Para sincronización automática

## Checklist de Implementación

- [x] Crear branches `main` y `develop`
- [ ] Configurar protección de branches
- [ ] Establecer reglas de PR y review
- [x] Configurar integración con Linear
- [ ] Documentar convenciones en README
- [x] Configurar git hooks (commitlint)
- [ ] Entrenar al equipo en el flujo
- [x] Crear templates de PR y commit messages

## Documentación Adicional

Esta estrategia debe documentarse también en:

- **README.md**: Sección "Contributing"
- **.cursorrules**: Reglas de desarrollo
- **CONTRIBUTING.md**: Guía detallada para contribuidores
- **Linear Project**: Como referencia rápida

---

Para más información sobre el proyecto, consulta:
- [README principal](../README.md)
- [Guía de contribución](./contributing.md)
- [Arquitectura del proyecto](./architecture.md)
