import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Servicio: CandidatoService
 *
 * Responsabilidad:
 * - Conectar el frontend con la API REST del backend
 * - Manejar operaciones CRUD de candidatos
 *
 * Backend Base URL:
 * http://localhost:8080/candidato
 */
@Injectable({
  providedIn: 'root',
})
export class CandidatoService {
  private apiUrl = 'https://sessions-mobility-buffalo-downloaded.trycloudflare.com/candidato';

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtener todos los candidatos
   * GET /candidato/candidatos
   */
  getCandidatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidatos`);
  }

  /**
   * Crear candidato
   * POST /candidato/add
   */
  createCandidato(data: FormData) {
    const token = localStorage.getItem('authToken');

    return this.http
      .post(`${this.apiUrl}/add`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .pipe(
        catchError((error) => {
          console.error('Error HTTP:', error);
          return throwError(() => error);
        }),
      );
  }
}
