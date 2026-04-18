import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  estado: string; // 🔹 Cambió: era asignado:boolean, ahora es estado:string
  nombreCiudadano: string;
  generoCiudadano: string;
}

export interface DashboardEleccionDTO {
  idEleccion: number;
  nombreEleccion: string;
  totalJurados: number;
  capacitados: number;
  pendientes: number;
  noPresentados: number;
}

@Injectable({
  providedIn: 'root',
})
export class JuradoService {
  private apiUrl = 'http://10.43.100.131:8080/eleccion-jurado';

  constructor(private http: HttpClient) {}

  getJurados(): Observable<ResponseEleccionJuradoDTO[]> {
    return this.http
      .get<ResponseEleccionJuradoDTO[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  getJuradosPorEleccion(idEleccion: number): Observable<ResponseEleccionJuradoDTO[]> {
    return this.http
      .get<ResponseEleccionJuradoDTO[]>(`${this.apiUrl}/eleccion/${idEleccion}`)
      .pipe(catchError(this.handleError));
  }

  crearJurado(
    idEleccion: number,
    data: CreateEleccionJuradoDTO,
  ): Observable<ResponseEleccionJuradoDTO> {
    return this.http
      .post<ResponseEleccionJuradoDTO>(`${this.apiUrl}/eleccion/${idEleccion}`, data)
      .pipe(catchError(this.handleError));
  }

  ejecutarSorteo(idEleccion: number): Observable<ResponseEleccionJuradoDTO[]> {
    return this.http
      .post<ResponseEleccionJuradoDTO[]>(`${this.apiUrl}/eleccion/${idEleccion}/sortear`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * 🔹 NUEVO: Dashboard de estadísticas por elección
   * GET /eleccion-jurado/eleccion/{idEleccion}/dashboard
   */
  getDashboard(idEleccion: number): Observable<DashboardEleccionDTO> {
    return this.http
      .get<DashboardEleccionDTO>(`${this.apiUrl}/eleccion/${idEleccion}/dashboard`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en JuradoService:', error);

    let mensaje = 'Error en la petición al servidor';

    if (error.status === 404) {
      mensaje = 'Ciudadano o elección no encontrada';
    } else if (error.status === 409) {
      mensaje = 'El ciudadano ya está asignado como jurado';
    } else if (error.status === 400) {
      mensaje = 'Datos inválidos en el formulario';
    }

    return throwError(() => new Error('Error en la petición al servidor'));
  }
}
