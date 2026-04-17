import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EleccionService {
  /**
   * IMPORTANTE: endpoint real del backend
   */
  private apiUrl = 'http://10.43.100.131:8080/eleccion';

  constructor(private http: HttpClient) {}

  /**
   * Crear elección
   */
  crearEleccion(data: any) {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(
      catchError((error) => {
        console.error('Error HTTP:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Obtener elecciones
   */
  obtenerElecciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/elecciones`).pipe(catchError(this.handleError));
  }

  /**
   * Manejo de errores
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en EleccionService:', error);

    return throwError(() => new Error('Error en la petición'));
  }
}
