import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {
  // Relativo → nginx hace proxy /api/* → backend
  private apiUrl = '/api/candidato';

  constructor(private http: HttpClient) {}

  getCandidatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidatos`).pipe(
      catchError((error) => {
        console.error('Error getCandidatos:', error);
        return throwError(() => error);
      }),
    );
  }

  createCandidato(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(
      catchError((error) => {
        console.error('Error createCandidato:', error);
        return throwError(() => error);
      }),
    );
  }
}
