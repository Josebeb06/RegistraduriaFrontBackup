import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/registrador';

  constructor(private http: HttpClient) {}

  /**
   * Login registrador
   * POST /registrador/login
   */
  login(data: { usuario: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      catchError((error) => {
        console.error('Error login:', error);
        return throwError(() => error);
      }),
    );
  }
}