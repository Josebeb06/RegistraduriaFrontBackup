import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Servicio: JuradoService
 *
 * Conecta el frontend con la API REST del backend para gestión de jurados.
 *
 * Base URL: http://10.43.100.131:8080/eleccion-jurado
 *
 * Endpoints reales (según api-docs.json):
 * GET  /eleccion-jurado                              → listar todos
 * GET  /eleccion-jurado/eleccion/{idEleccion}        → listar por elección
 * POST /eleccion-jurado/eleccion/{idEleccion}        → crear jurado manual
 * POST /eleccion-jurado/eleccion/{idEleccion}/sortear → ejecutar sorteo
 */

export interface CreateEleccionJuradoDTO {
  tipoJurado: string;
  cedulaCiudadano: string;
  numeroMesa: number;
  fechaCapacitacion: string;
}

export interface ResponseEleccionJuradoDTO {
  idAsignacionJurado: number;
  nombreEleccion: string;
  tipoJurado: string;
  numeroMesa: number;
  fechaCapacitacion: string;
  asignado: boolean;
  nombreCiudadano: string;
  generoCiudadano: string;
}

@Injectable({
  providedIn: 'root',
})
export class JuradoService {
  private apiUrl = 'http://10.43.100.131:8080/eleccion-jurado';

  constructor(private http: HttpClient) {}

  /**
   * Listar todos los jurados
   * GET /eleccion-jurado
   */
  getJurados(): Observable<ResponseEleccionJuradoDTO[]> {
    return this.http
      .get<ResponseEleccionJuradoDTO[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Listar jurados de una elección específica
   * GET /eleccion-jurado/eleccion/{idEleccion}
   */
  getJuradosPorEleccion(idEleccion: number): Observable<ResponseEleccionJuradoDTO[]> {
    return this.http
      .get<ResponseEleccionJuradoDTO[]>(`${this.apiUrl}/eleccion/${idEleccion}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crear jurado manualmente para una elección
   * POST /eleccion-jurado/eleccion/{idEleccion}
   */
  crearJurado(
    idEleccion: number,
    data: CreateEleccionJuradoDTO,
  ): Observable<ResponseEleccionJuradoDTO> {
    return this.http
      .post<ResponseEleccionJuradoDTO>(`${this.apiUrl}/eleccion/${idEleccion}`, data)
      .pipe(catchError(this.handleError));
  }

  /**
   * Ejecutar sorteo de jurados para una elección
   * POST /eleccion-jurado/eleccion/{idEleccion}/sortear
   */
  ejecutarSorteo(idEleccion: number): Observable<ResponseEleccionJuradoDTO[]> {
    return this.http
      .post<ResponseEleccionJuradoDTO[]>(`${this.apiUrl}/eleccion/${idEleccion}/sortear`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en JuradoService:', error);
    return throwError(() => new Error('Error en la petición al servidor'));
  }
}
