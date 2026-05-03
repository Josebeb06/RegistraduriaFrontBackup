import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

/**
 * Servicio: CambioCentroService
 *
 * Responsabilidad:
 * - Simular operaciones de:
 *   - Buscar ciudadano
 *   - Cambiar centro de votación
 *
 * Actualmente MOCK (sin backend)
 * Preparado para conectar API REST después
 */
@Injectable({
  providedIn: 'root',
})
export class CambioCentroService {
  private apiUrl = '/api/cambio-centro';

  constructor(private http: HttpClient) {}

  /**
   * MOCK: Buscar ciudadano por cédula
   */
  buscarCiudadano(cedula: string): Observable<any> {
    const MOCK_CITIZENS: any = {
      '1234567890': {
        name: 'Carlos Andrés Martínez Peña',
        center: 'IE Colegio Nacional Camilo Torres · Bogotá',
      },
      '9876543210': {
        name: 'María Fernanda López Rodríguez',
        center: 'IE Liceo Antioqueño · Medellín',
      },
      '1122334455': {
        name: 'José Luis Gómez Vargas',
        center: 'Universidad del Valle — Campus Meléndez',
      },
      '5544332211': {
        name: 'Ana Patricia Sánchez Torres',
        center: 'IE Santa Librada · Cali',
      },
    };

    const citizen = MOCK_CITIZENS[cedula];

    if (!citizen) {
      return throwError(() => new Error('Ciudadano no encontrado')).pipe(delay(1000));
    }

    return of({
      ...citizen,
      cedula,
    }).pipe(delay(1200));
  }

  /**
   * MOCK: Cambiar centro de votación
   */
  cambiarCentro(data: { cedula: string; nuevoCentro: string }): Observable<any> {
    return of({
      success: true,
      message: 'Centro actualizado correctamente',
      data,
      timestamp: new Date(),
    }).pipe(
      delay(1400),
      catchError((error) => {
        console.error('Error en cambio de centro:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * (FUTURO) Endpoint real
   *
   * Ejemplo cuando tengas backend:
   *
   * return this.http.post(`${this.apiUrl}/cambiar`, data)
   */
}
