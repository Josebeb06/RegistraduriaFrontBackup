import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private apiUrl = 'http://10.43.100.131:8080/partido';

  constructor(private http: HttpClient) {}

  crearPartido(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  listarPartidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/partidos`);
  }
}
