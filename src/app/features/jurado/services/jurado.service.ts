import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JuradoCard } from '../components/jurado-card/jurado-card.component';

/**
 * Servicio: JuradoService
 *
 * Responsabilidad:
 * - Conectar el frontend con la API REST del backend
 * - Manejar operaciones CRUD de jurados
 * - Manejar sorteo automático y actualización de capacitación
 *
 * Backend Base URL:
 * http://10.43.100.131:8080/jurado
 *
 * 🔹 Endpoints pendientes de confirmar con back:
 * GET    /jurado/jurados                          → listar todos
 * POST   /jurado/add                              → crear jurado manual
 * DELETE /jurado/{id}                             → eliminar jurado
 * POST   /jurado/sorteo/{eleccionId}              → ejecutar sorteo
 * PATCH  /jurado/{id}/capacitacion/{estado}       → actualizar estado capacitación
 */
@Injectable({
  providedIn: 'root',
})
export class JuradoService {
  private apiUrl = 'http://10.43.100.131:8080/jurado';

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtener todos los jurados
   * GET /jurado/jurados
   */
  getJurados(): Observable<JuradoCard[]> {
    return this.http.get<JuradoCard[]>(`${this.apiUrl}/jurados`).pipe(catchError(this.handleError));
  }

  /**
   * 🔹 Crear jurado manualmente
   * POST /jurado/add
   *
   * Body (CreateJuradoDTO):
   * {
   *   juradoTipo: string,
   *   numeroDoc: string,
   *   eleccionId: string,
   *   mesaId: string,
   *   empresaLogisticaId?: string,
   *   fechaCapacitacion: string
   * }
   */
  crearJurado(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(catchError(this.handleError));
  }

  /**
   * 🔹 Eliminar jurado por ID
   * DELETE /jurado/{id}
   */
  eliminarJurado(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * 🔹 Ejecutar sorteo automático de jurados para una elección
   * POST /jurado/sorteo/{eleccionId}
   *
   * Response: lista de jurados asignados
   * [{ nombres, apellidos, juradoTipo }]
   */
  ejecutarSorteo(
    eleccionId: string,
  ): Observable<{ nombres: string; apellidos: string; juradoTipo: string }[]> {
    return this.http
      .post<
        { nombres: string; apellidos: string; juradoTipo: string }[]
      >(`${this.apiUrl}/sorteo/${eleccionId}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * 🔹 Actualizar estado de capacitación de un jurado
   * PATCH /jurado/{id}/capacitacion/{estado}
   *
   * estado: 'CAPACITADO' | 'NO_PRESENTADO' | 'PENDIENTE'
   */
  actualizarEstadoCapacitacion(
    id: string,
    estado: 'CAPACITADO' | 'NO_PRESENTADO' | 'PENDIENTE',
  ): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/${id}/capacitacion/${estado}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * 🔹 Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en JuradoService:', error);
    return throwError(() => new Error('Error en la petición al servidor'));
  }
}
