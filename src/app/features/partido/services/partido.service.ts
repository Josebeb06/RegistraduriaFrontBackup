import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  // Relativo → nginx hace proxy /api/* → backend
  private apiUrl = '/api/partido';

  constructor(private http: HttpClient) {}

  crearPartido(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(
      catchError((error) => {
        console.error('Error crearPartido:', error);
        return throwError(() => error);
      }),
    );
  }

  listarPartidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/partidos`).pipe(
      catchError((error) => {
        console.error('Error listarPartidos:', error);
        return throwError(() => error);
      }),
    );
  }
}
