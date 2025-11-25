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

### Ramas Principales

- `main`: Código de producción estable
- `develop`: Branch de integración principal

### Crear Nueva Feature

```bash
# Crear branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/DNT-XXX-descripcion

# Hacer cambios y commits
git add .
git commit -m "feat(scope): descripción del cambio

Closes DNT-XXX"

# Push y crear PR
git push origin feature/DNT-XXX-descripcion
```

### Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

Closes DNT-XXX
```

**Tipos válidos**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Scopes válidos**: `setup`, `api`, `ui`, `editor`, `validation`, `database`, `test`

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
