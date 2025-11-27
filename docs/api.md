# API Reference

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Autenticación](#autenticación)
- [Endpoints de Presets](#endpoints-de-presets)
- [Endpoints de Clustering](#endpoints-de-clustering)
- [Endpoints de Parámetros](#endpoints-de-parámetros)
- [Endpoints de Validación](#endpoints-de-validación)
- [Manejo de Errores](#manejo-de-errores)
- [Rate Limiting](#rate-limiting)
- [Ejemplos de Uso](#ejemplos-de-uso)

## Visión General

La API REST del proyecto proporciona endpoints para gestionar presets de clustering, validar parámetros, ejecutar algoritmos de clustering y obtener resultados.

### Base URL

```
Desarrollo: http://localhost:3000/api
Producción: https://tu-dominio.com/api
```

### Formato de Respuesta

Todas las respuestas siguen un formato consistente:

```typescript
// Respuesta exitosa
{
  "success": true,
  "data": any,
  "message"?: string
}

// Respuesta de error
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

## Autenticación

Actualmente la API no requiere autenticación. En futuras versiones se implementará autenticación basada en tokens.

```http
# Headers requeridos
Content-Type: application/json
Accept: application/json
```

## Endpoints de Presets

### Listar Presets

Obtiene una lista de todos los presets disponibles.

```http
GET /api/presets
```

**Parámetros de Query:**
- `public` (boolean, opcional): Filtrar solo presets públicos
- `limit` (number, opcional): Número máximo de resultados (default: 50)
- `offset` (number, opcional): Número de resultados a omitir (default: 0)

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "presets": [
      {
        "id": "uuid",
        "name": "Rápido",
        "description": "Configuración optimizada para velocidad",
        "parameters": {
          "min_cluster_size": 5,
          "eps": 0.5,
          "metric": "euclidean"
        },
        "is_public": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 10,
    "has_more": false
  }
}
```

### Obtener Preset Específico

```http
GET /api/presets/{id}
```

**Parámetros:**
- `id` (string): UUID del preset

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Balanceado",
    "description": "Equilibrio entre velocidad y precisión",
    "parameters": {
      "min_cluster_size": 10,
      "eps": 0.3,
      "metric": "euclidean",
      "algorithm": "auto",
      "leaf_size": 30
    },
    "is_public": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### Crear Nuevo Preset

```http
POST /api/presets
```

**Body:**

```json
{
  "name": "Mi Preset Personalizado",
  "description": "Configuración personalizada para mi caso de uso",
  "parameters": {
    "min_cluster_size": 15,
    "eps": 0.4,
    "metric": "manhattan"
  },
  "is_public": false
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "Mi Preset Personalizado",
    "description": "Configuración personalizada para mi caso de uso",
    "parameters": {
      "min_cluster_size": 15,
      "eps": 0.4,
      "metric": "manhattan"
    },
    "is_public": false,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "Preset creado exitosamente"
}
```

### Actualizar Preset

```http
PUT /api/presets/{id}
```

**Body:**

```json
{
  "name": "Preset Actualizado",
  "description": "Descripción actualizada",
  "parameters": {
    "min_cluster_size": 20,
    "eps": 0.35
  }
}
```

### Eliminar Preset

```http
DELETE /api/presets/{id}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Preset eliminado exitosamente"
}
```

## Endpoints de Clustering

### Validar Parámetros

Valida un conjunto de parámetros de clustering sin ejecutar el algoritmo.

```http
POST /api/clusters/validate
```

**Body:**

```json
{
  "parameters": {
    "min_cluster_size": 10,
    "eps": 0.5,
    "metric": "euclidean",
    "algorithm": "auto",
    "leaf_size": 30,
    "n_jobs": -1
  }
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "warnings": [
      {
        "field": "n_jobs",
        "message": "Usar -1 puede consumir todos los cores disponibles"
      }
    ],
    "suggestions": [
      {
        "field": "min_cluster_size",
        "current": 10,
        "suggested": 15,
        "reason": "Basado en el tamaño típico de datos"
      }
    ]
  }
}
```

### Ejecutar Clustering

Ejecuta el algoritmo de clustering con los parámetros especificados.

```http
POST /api/clusters/execute
```

**Body:**

```json
{
  "parameters": {
    "min_cluster_size": 10,
    "eps": 0.5,
    "metric": "euclidean"
  },
  "data": [
    [1.0, 2.0],
    [1.5, 1.8],
    [5.0, 8.0],
    [8.0, 8.0]
  ],
  "options": {
    "return_probabilities": true,
    "save_result": true
  }
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "result_id": "result-uuid",
    "labels": [0, 0, 1, 1],
    "probabilities": [0.95, 0.87, 0.92, 0.89],
    "n_clusters": 2,
    "n_noise_points": 0,
    "execution_time_ms": 150,
    "parameters_used": {
      "min_cluster_size": 10,
      "eps": 0.5,
      "metric": "euclidean"
    }
  }
}
```

### Obtener Resultado de Clustering

```http
GET /api/clusters/results/{id}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id": "result-uuid",
    "labels": [0, 0, 1, 1],
    "probabilities": [0.95, 0.87, 0.92, 0.89],
    "n_clusters": 2,
    "n_noise_points": 0,
    "execution_time_ms": 150,
    "parameters": {
      "min_cluster_size": 10,
      "eps": 0.5,
      "metric": "euclidean"
    },
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

## Endpoints de Parámetros

### Obtener Esquema de Parámetros

Obtiene el esquema completo de parámetros disponibles con sus tipos y restricciones.

```http
GET /api/parameters/schema
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "parameters": {
      "min_cluster_size": {
        "type": "integer",
        "min": 2,
        "max": 10000,
        "default": 5,
        "description": "Tamaño mínimo de cluster",
        "category": "core"
      },
      "eps": {
        "type": "number",
        "min": 0.001,
        "max": 100,
        "default": 0.5,
        "description": "Radio de vecindario",
        "category": "core"
      },
      "metric": {
        "type": "enum",
        "options": ["euclidean", "manhattan", "cosine", "hamming"],
        "default": "euclidean",
        "description": "Métrica de distancia",
        "category": "core"
      }
    },
    "categories": {
      "core": "Parámetros principales",
      "advanced": "Parámetros avanzados",
      "performance": "Optimización de rendimiento"
    }
  }
}
```

### Obtener Valores por Defecto

```http
GET /api/parameters/defaults
```

**Parámetros de Query:**
- `mode` (string, opcional): "basic" | "advanced" | "super_advanced"

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "mode": "basic",
    "parameters": {
      "min_cluster_size": 5,
      "eps": 0.5,
      "metric": "euclidean"
    }
  }
}
```

## Endpoints de Validación

### Validar Campo Específico

```http
POST /api/validation/field
```

**Body:**

```json
{
  "field": "min_cluster_size",
  "value": 10,
  "context": {
    "mode": "advanced",
    "other_params": {}
  }
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "formatted_value": 10,
    "warnings": [],
    "suggestions": []
  }
}
```

### Validar Configuración Completa

```http
POST /api/validation/config
```

**Body:**

```json
{
  "parameters": {
    "min_cluster_size": 10,
    "eps": 0.5,
    "metric": "euclidean"
  },
  "mode": "advanced"
}
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "errors": [],
    "warnings": [
      {
        "field": "eps",
        "message": "Valor alto puede resultar en pocos clusters"
      }
    ],
    "compatibility_score": 0.95,
    "estimated_performance": "good"
  }
}
```

## Manejo de Errores

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Error de validación de parámetros |
| `NOT_FOUND` | Recurso no encontrado |
| `INVALID_INPUT` | Entrada inválida |
| `RATE_LIMIT_EXCEEDED` | Límite de requests excedido |
| `INTERNAL_ERROR` | Error interno del servidor |

### Ejemplos de Respuestas de Error

#### Error de Validación

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Parámetros inválidos",
    "details": {
      "field_errors": {
        "min_cluster_size": ["Debe ser mayor que 1"],
        "eps": ["Debe ser un número positivo"]
      }
    }
  }
}
```

#### Recurso No Encontrado

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Preset no encontrado",
    "details": {
      "resource": "preset",
      "id": "invalid-uuid"
    }
  }
}
```

#### Rate Limit Excedido

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas requests. Intenta de nuevo en 60 segundos",
    "details": {
      "retry_after": 60,
      "limit": 100,
      "window": "1h"
    }
  }
}
```

## Rate Limiting

La API implementa rate limiting para prevenir abuso:

- **Requests generales**: 100 requests por hora por IP
- **Clustering execution**: 10 ejecuciones por hora por IP
- **Preset creation**: 20 creaciones por día por IP

### Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Ejemplos de Uso

### JavaScript/TypeScript

```typescript
// Cliente API básico
class ClusteringAPI {
  private baseURL = '/api';
  
  async getPresets(): Promise<Preset[]> {
    const response = await fetch(`${this.baseURL}/presets`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result.data.presets;
  }
  
  async validateParameters(params: ClusterParams): Promise<ValidationResult> {
    const response = await fetch(`${this.baseURL}/clusters/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameters: params })
    });
    
    const result = await response.json();
    return result.data;
  }
  
  async executeClustering(params: ClusterParams, data: number[][]): Promise<ClusterResult> {
    const response = await fetch(`${this.baseURL}/clusters/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parameters: params, data })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
}

// Uso
const api = new ClusteringAPI();

// Obtener presets
const presets = await api.getPresets();

// Validar parámetros
const validation = await api.validateParameters({
  min_cluster_size: 10,
  eps: 0.5,
  metric: 'euclidean'
});

// Ejecutar clustering
const result = await api.executeClustering(
  { min_cluster_size: 10, eps: 0.5, metric: 'euclidean' },
  [[1, 2], [3, 4], [5, 6]]
);
```

### Python

```python
import requests
import json

class ClusteringAPI:
    def __init__(self, base_url="http://localhost:3000/api"):
        self.base_url = base_url
    
    def get_presets(self):
        response = requests.get(f"{self.base_url}/presets")
        result = response.json()
        
        if not result["success"]:
            raise Exception(result["error"]["message"])
        
        return result["data"]["presets"]
    
    def validate_parameters(self, params):
        response = requests.post(
            f"{self.base_url}/clusters/validate",
            json={"parameters": params}
        )
        return response.json()["data"]
    
    def execute_clustering(self, params, data):
        response = requests.post(
            f"{self.base_url}/clusters/execute",
            json={"parameters": params, "data": data}
        )
        result = response.json()
        
        if not result["success"]:
            raise Exception(result["error"]["message"])
        
        return result["data"]

# Uso
api = ClusteringAPI()

# Obtener presets
presets = api.get_presets()

# Validar parámetros
validation = api.validate_parameters({
    "min_cluster_size": 10,
    "eps": 0.5,
    "metric": "euclidean"
})

# Ejecutar clustering
result = api.execute_clustering(
    {"min_cluster_size": 10, "eps": 0.5, "metric": "euclidean"},
    [[1, 2], [3, 4], [5, 6]]
)
```

### cURL

```bash
# Obtener presets
curl -X GET "http://localhost:3000/api/presets" \
  -H "Accept: application/json"

# Crear preset
curl -X POST "http://localhost:3000/api/presets" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Preset",
    "description": "Preset personalizado",
    "parameters": {
      "min_cluster_size": 10,
      "eps": 0.5,
      "metric": "euclidean"
    }
  }'

# Validar parámetros
curl -X POST "http://localhost:3000/api/clusters/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "min_cluster_size": 10,
      "eps": 0.5,
      "metric": "euclidean"
    }
  }'

# Ejecutar clustering
curl -X POST "http://localhost:3000/api/clusters/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "parameters": {
      "min_cluster_size": 5,
      "eps": 0.5,
      "metric": "euclidean"
    },
    "data": [[1, 2], [1.5, 1.8], [5, 8], [8, 8]]
  }'
```

---

Para más información sobre el proyecto, consulta:
- [README principal](../README.md)
- [Guía de contribución](./contributing.md)
- [Arquitectura del proyecto](./architecture.md)
