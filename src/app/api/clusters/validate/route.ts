/**
 * @fileoverview API route para validación de parámetros de clustering
 * @module app/api/clusters/validate/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateClusteringParams } from '@/lib/validation';
import type { ClusteringParameters } from '@/types';

/**
 * Maneja peticiones POST para validar parámetros de clustering
 * 
 * Valida los parámetros recibidos usando esquemas Zod y validaciones
 * de negocio, retornando errores, warnings y sugerencias.
 * 
 * @param request - Request de Next.js con los parámetros a validar
 * @returns Respuesta JSON con resultado de validación
 * 
 * @example
 * ```typescript
 * // Request body
 * {
 *   "params": { minClusterSize: 6, minSamples: 2 },
 *   "mode": "basic"
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": {
 *     "isValid": true,
 *     "errors": {},
 *     "warnings": [],
 *     "suggestions": []
 *   }
 * }
 * ```
 * 
 * @category API
 * @subcategory Validation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { params, mode = 'basic' } = body;

    // Validar que params existe
    if (!params) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Parámetros de clustering requeridos',
          },
        },
        { status: 400 }
      );
    }

    // Validar que mode es válido
    if (!['basic', 'advanced', 'super-advanced'].includes(mode)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Modo de validación inválido. Debe ser: basic, advanced o super-advanced',
          },
        },
        { status: 400 }
      );
    }

    // Realizar validación
    const validationResult = validateClusteringParams(
      params as Partial<ClusteringParameters>,
      mode as 'basic' | 'advanced' | 'super-advanced'
    );

    // Retornar resultado
    return NextResponse.json(
      {
        success: true,
        data: validationResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en validación de parámetros:', error);

    // Manejar errores de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'El cuerpo de la petición no es un JSON válido',
          },
        },
        { status: 400 }
      );
    }

    // Error genérico
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error interno del servidor durante la validación',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Maneja peticiones GET para obtener información sobre la validación
 * 
 * Retorna información sobre los esquemas de validación disponibles
 * y los modos soportados.
 * 
 * @returns Respuesta JSON con información de validación
 * 
 * @category API
 * @subcategory Validation
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        modes: ['basic', 'advanced', 'super-advanced'],
        description: 'API de validación de parámetros de clustering HDBSCAN',
        endpoints: {
          POST: '/api/clusters/validate - Valida parámetros de clustering',
        },
      },
    },
    { status: 200 }
  );
}

