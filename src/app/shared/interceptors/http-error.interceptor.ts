import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthStateService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error.status, error.message);

        // Si es 401 (Unauthorized), el token expiró o es inválido
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }

        // Si es 403 (Forbidden), no tiene permisos
        if (error.status === 403) {
          console.error('Acceso denegado - No tiene permisos');
        }

        // Si es 404, recurso no encontrado
        if (error.status === 404) {
          console.error('Recurso no encontrado');
        }

        // Si es 500, error del servidor
        if (error.status >= 500) {
          console.error('Error del servidor');
        }

        return throwError(() => error);
      }),
    );
  }
}