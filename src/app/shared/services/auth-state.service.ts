import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UserData {
  id?: number;
  usuario?: string;
  username?: string;
  email?: string;
  rol?: string;
  tipo?: string; // 'registrador' | 'consejo' | 'admin'
  exp?: number; // Expiración del JWT (en segundos)
  iat?: number; // Issued at (en segundos)
  sub?: string; // Subject (usuario)
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private apiUrl = '/api';
  
  // Signal para reactividad
  currentUser = signal<UserData | null>(null);
  
  // BehaviorSubject para acceso más tradicional
  private userSubject = new BehaviorSubject<UserData | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Cargar usuario desde localStorage si existe
   */
  private loadUserFromStorage(): void {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.currentUser.set(user);
        this.userSubject.next(user);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        this.clearAuth();
      }
    }
  }

  loginRegistrador(usuario: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/registrador/login`, { usuario, password }, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          if (token && token.length > 0) {
            this.saveAuth(token, 'registrador');
          } else {
            throw new Error('Token vacío');
          }
        }),
      );
  }

  loginConsejoNacional(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/consejo-nacional/login`, { username, password }, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          if (token && token.length > 0) {
            this.saveAuth(token, 'consejo');
          } else {
            throw new Error('Token vacío');
          }
        }),
      );
  }

  loginAdministrador(usuario: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/administrador-electoral/login`, {
        usuario,
        password,
      }, { responseType: 'text' })
      .pipe(
        tap((token: string) => {
          if (token && token.length > 0) {
            this.saveAuth(token, 'admin');
          } else {
            throw new Error('Token vacío');
          }
        }),
      );
  }

  /**
   * Guardar token y usuario en localStorage
   */
  private saveAuth(token: string, tipo: string): void {
    localStorage.setItem('authToken', token);
    
    // Decodificar JWT para obtener datos del usuario (sin verificar firma)
    const userData = this.decodeToken(token);
    userData.tipo = tipo;
    
    localStorage.setItem('authUser', JSON.stringify(userData));
    this.currentUser.set(userData);
    this.userSubject.next(userData);

    // Disparar evento para que otros componentes se enteren
    window.dispatchEvent(new Event('authChange'));
  }

  /**
   * Decodificar JWT (sin verificar firma, solo lectura)
   */
  private decodeToken(token: string): UserData {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (e) {
      console.error('Error decoding token:', e);
      return {};
    }
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Verificar si token está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const decoded = this.decodeToken(token);
      if (!decoded.exp) return false; // Si no tiene exp, asumimos que es válido
      return decoded.exp * 1000 < Date.now(); // exp está en segundos, Date.now() en ms
    } catch {
      return true;
    }
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtener tipo de usuario actual
   */
  getUserType(): string | null {
    const user = this.currentUser();
    return user?.tipo || null;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.currentUser.set(null);
    this.userSubject.next(null);
    window.dispatchEvent(new Event('authChange'));
  }

  /**
   * Limpiar autenticación
   */
  private clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.currentUser.set(null);
    this.userSubject.next(null);
  }
}