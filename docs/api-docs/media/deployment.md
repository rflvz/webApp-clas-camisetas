# Guía de Deployment

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Preparación para Deployment](#preparación-para-deployment)
- [Deployment en Vercel](#deployment-en-vercel)
- [Deployment con Docker](#deployment-con-docker)
- [Deployment en VPS](#deployment-en-vps)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Variables de Entorno](#variables-de-entorno)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Troubleshooting](#troubleshooting)

## Visión General

Esta guía cubre las diferentes opciones de deployment para la aplicación de clustering HDBSCAN, desde opciones simples como Vercel hasta deployments más complejos con Docker y VPS.

### Opciones de Deployment

1. **Vercel** (Recomendado para desarrollo/staging)
   - ✅ Fácil configuración
   - ✅ CI/CD automático
   - ✅ Escalado automático
   - ❌ Limitaciones en base de datos

2. **Docker + VPS** (Recomendado para producción)
   - ✅ Control total
   - ✅ Escalabilidad personalizada
   - ✅ Base de datos dedicada
   - ❌ Requiere más configuración

3. **Plataformas Cloud** (AWS, GCP, Azure)
   - ✅ Servicios gestionados
   - ✅ Alta disponibilidad
   - ✅ Escalado automático
   - ❌ Costo más alto

## Preparación para Deployment

### 1. Checklist Pre-deployment

- [ ] **Tests pasan**: `npm run test`
- [ ] **Build exitoso**: `npm run build`
- [ ] **Linting limpio**: `npm run lint`
- [ ] **Variables de entorno configuradas**
- [ ] **Base de datos configurada**
- [ ] **Secrets configurados**
- [ ] **Dominio configurado** (si aplica)

### 2. Optimizaciones de Producción

```bash
# Instalar dependencias de producción únicamente
npm ci --only=production

# Generar build optimizado
npm run build

# Verificar tamaño del bundle
npm run analyze
```

### 3. Configuración de Seguridad

```typescript
// next.config.js - Configuración de producción
const nextConfig = {
  // Optimizaciones de producción
  compress: true,
  poweredByHeader: false,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ];
  }
};
```

## Deployment en Vercel

### 1. Configuración Inicial

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Configurar proyecto
vercel
```

### 2. Configuración de Variables de Entorno

En el dashboard de Vercel o usando CLI:

```bash
# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

### 3. Configuración de Base de Datos

Para Vercel, recomendamos usar **Vercel Postgres** o **PlanetScale**:

```bash
# Vercel Postgres
vercel postgres create

# O PlanetScale
npm install @planetscale/database
```

### 4. Archivo de Configuración Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 5. Deployment Automático

```bash
# Deployment manual
vercel --prod

# O configurar GitHub integration para deployment automático
# en cada push a main/develop
```

## Deployment con Docker

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias únicamente cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basado en el package manager preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild el código fuente únicamente cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar build
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configurar permisos correctos para prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar archivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/clustering_db
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=clustering_db
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Configuración de Nginx

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name tu-dominio.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name tu-dominio.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security Headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip Compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files caching
        location /_next/static/ {
            proxy_pass http://app;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }
}
```

### 4. Comandos de Deployment

```bash
# Build y deploy
docker-compose build
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Actualizar aplicación
git pull
docker-compose build app
docker-compose up -d app
```

## Deployment en VPS

### 1. Configuración del Servidor

```bash
# Actualizar sistema (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Instalar Nginx
sudo apt install nginx

# Configurar firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Configuración de la Aplicación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/webApp-clas-camisetas.git
cd webApp-clas-camisetas

# Instalar dependencias
npm ci --only=production

# Build de producción
npm run build

# Configurar variables de entorno
cp .env.example .env.production
# Editar .env.production con valores de producción
```

### 3. Configuración de PM2

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'clustering-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

```bash
# Iniciar aplicación con PM2
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar en boot
pm2 startup
pm2 save

# Comandos útiles de PM2
pm2 status
pm2 logs clustering-app
pm2 restart clustering-app
pm2 reload clustering-app  # Zero-downtime restart
```

### 4. Configuración de Nginx

```bash
# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/clustering-app

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/clustering-app /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 5. SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Configurar renovación automática
sudo crontab -e
# Añadir línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Configuración de Base de Datos

### 1. PostgreSQL en Producción

```bash
# Crear usuario y base de datos
sudo -u postgres psql

CREATE USER clustering_user WITH PASSWORD 'secure_password';
CREATE DATABASE clustering_db OWNER clustering_user;
GRANT ALL PRIVILEGES ON DATABASE clustering_db TO clustering_user;
\q

# Configurar PostgreSQL para conexiones remotas
sudo nano /etc/postgresql/15/main/postgresql.conf
# Cambiar: listen_addresses = '*'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Añadir: host clustering_db clustering_user 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### 2. Migraciones de Base de Datos

```bash
# Ejecutar migraciones en producción
npm run db:migrate

# Seed de datos iniciales (si es necesario)
npm run db:seed
```

### 3. Backup de Base de Datos

```bash
# Script de backup
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/clustering"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="clustering_db"
DB_USER="clustering_user"

mkdir -p $BACKUP_DIR

pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Configurar cron para backup diario
# 0 2 * * * /path/to/backup-db.sh
```

## Variables de Entorno

### Variables de Producción

```bash
# .env.production
NODE_ENV=production
PORT=3000

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/clustering_db

# Autenticación (si se implementa)
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://tu-dominio.com

# API Keys (si se usan)
CLUSTERING_API_KEY=your-api-key

# Configuración de logs
LOG_LEVEL=info
LOG_FILE=/var/log/clustering-app.log

# Rate limiting
RATE_LIMIT_WINDOW=3600000  # 1 hora en ms
RATE_LIMIT_MAX=100         # 100 requests por hora
```

### Gestión Segura de Secrets

```bash
# Usar herramientas como sops, vault, o servicios cloud
# Nunca commitear secrets al repositorio

# Ejemplo con sops
sops -e .env.production > .env.production.enc
sops -d .env.production.enc > .env.production
```

## Monitoreo y Logs

### 1. Configuración de Logs

```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'clustering-app' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### 2. Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Verificar conexión a base de datos
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

### 3. Monitoreo con Prometheus (Opcional)

```typescript
// lib/metrics.ts
import client from 'prom-client';

// Crear métricas personalizadas
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const clusteringExecutions = new client.Counter({
  name: 'clustering_executions_total',
  help: 'Total number of clustering executions',
  labelNames: ['status'],
});

export { httpRequestDuration, clusteringExecutions };
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Verificar conexión
psql -U clustering_user -h localhost -d clustering_db
```

#### 2. Aplicación No Responde

```bash
# Verificar estado de PM2
pm2 status

# Ver logs de la aplicación
pm2 logs clustering-app

# Reiniciar aplicación
pm2 restart clustering-app
```

#### 3. Problemas de SSL

```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew --dry-run

# Verificar configuración de Nginx
sudo nginx -t
```

#### 4. Alto Uso de Memoria

```bash
# Monitorear uso de recursos
htop
pm2 monit

# Configurar límites de memoria en PM2
pm2 restart clustering-app --max-memory-restart 1G
```

### Scripts de Diagnóstico

```bash
#!/bin/bash
# diagnose.sh - Script de diagnóstico

echo "=== Clustering App Diagnostics ==="

echo "1. System Resources:"
free -h
df -h

echo "2. Application Status:"
pm2 status

echo "3. Database Connection:"
pg_isready -h localhost -p 5432

echo "4. Nginx Status:"
sudo systemctl status nginx

echo "5. SSL Certificate:"
sudo certbot certificates

echo "6. Recent Logs:"
pm2 logs clustering-app --lines 20
```

### Rollback de Deployment

```bash
#!/bin/bash
# rollback.sh - Script de rollback

BACKUP_DIR="/var/backups/clustering"
CURRENT_DIR="/var/www/clustering-app"

echo "Rolling back to previous version..."

# Parar aplicación
pm2 stop clustering-app

# Restaurar código anterior
if [ -d "$BACKUP_DIR/previous" ]; then
    rm -rf $CURRENT_DIR
    cp -r $BACKUP_DIR/previous $CURRENT_DIR
    cd $CURRENT_DIR
    npm ci --only=production
    npm run build
fi

# Restaurar base de datos si es necesario
# pg_restore -U clustering_user -d clustering_db backup.sql

# Reiniciar aplicación
pm2 start clustering-app

echo "Rollback completed"
```

---

Para más información sobre el proyecto, consulta:
- [README principal](../README.md)
- [Guía de contribución](./contributing.md)
- [Arquitectura del proyecto](./architecture.md)
