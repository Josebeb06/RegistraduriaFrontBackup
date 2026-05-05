import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private apiUrl = 'https://sessions-mobility-buffalo-downloaded.trycloudflare.com/partido';
  constructor(private http: HttpClient) {}

  crearPartido(data: any): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  listarPartidos(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
}
