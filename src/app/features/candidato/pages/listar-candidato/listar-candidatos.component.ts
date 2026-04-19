import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatoService } from '../../service/candidato.service';

/**
 * Página: Listar Candidatos
 *
 * Responsabilidad:
 * - Consumir el backend
 * - Mostrar lista de candidatos
 */
@Component({
  selector: 'app-listar-candidatos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-candidatos.component.html',
  styleUrls: ['./listar-candidatos.component.scss'],
})
export class ListarCandidatosComponent implements OnInit {
  candidatos: any[] = [];
  loading = true;
  error = false;

  constructor(private candidatoService: CandidatoService) {}

  /**
   * Al cargar la página → llamar backend
   */
  ngOnInit(): void {
    this.obtenerCandidatos();
  }

  /**
   * Consumir API
   */
  obtenerCandidatos() {
    this.loading = true;
    this.error = false;

    this.candidatoService.getCandidatos().subscribe({
      next: (data) => {
        this.candidatos = [...data]; // rompe referencia (fix Angular change detection)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = true;
        this.loading = false;
      },
    });
  }
}
