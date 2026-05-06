import { Component, OnInit } from '@angular/core';
import { PartidoService } from '../../services/partido.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-partido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-partido.component.html',
  styleUrls: ['./listar-partido.component.scss'],
})
export class ListarPartidoComponent implements OnInit {
  partidos: any[] = [];

  constructor(private partidoService: PartidoService) {}

  ngOnInit(): void {
    this.cargarPartidos();
  }

  cargarPartidos() {
    this.partidoService.listarPartidos().subscribe({
      next: (data) => {
        this.partidos = data;
      },
      error: () => {
        console.error('Error al cargar partidos');
      },
    });
  }
}
