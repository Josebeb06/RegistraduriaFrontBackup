import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CreateEleccionDTO {
  nombre: string;
  fechaInicio: string; // format: date-time → "2026-05-04T00:00:00"
  fechaFinalizacion: string; // format: date-time
  fechaInicioUrna?: string; // opcional, solo si voto por urna
  fechaFinalizacionUrna?: string;
  fechaInicioDomicilio?: string; // opcional, solo si voto por domicilio
  fechaFinalizacionDomicilio?: string;
  tipo: string; // enum: CONGRESO | PRESIDENCIAL | GOBERNADORES | etc.
  listaAbierta: boolean;
  idAdministradorElectoral: number;
}

@Injectable({
  providedIn: 'root',
})
export class EleccionService {
  // Nginx hace proxy /api/* → backend en 10.43.100.131:8080
  private apiUrl = '/api/eleccion';

  constructor(private http: HttpClient) {}

  crearEleccion(data: CreateEleccionDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(catchError(this.handleError));
  }

  obtenerElecciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/elecciones`).pipe(catchError(this.handleError));
  }

  obtenerEleccionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en EleccionService:', error);
    return throwError(() => error);
  }
}
