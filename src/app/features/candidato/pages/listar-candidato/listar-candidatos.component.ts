import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatoService } from '../../service/candidato.service';

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

  constructor(
    private candidatoService: CandidatoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.obtenerCandidatos();
  }

  obtenerCandidatos() {
    this.loading = true;

    this.candidatoService.getCandidatos().subscribe({
      next: (data) => {
        console.log('Candidatos:', data);

        this.candidatos = [...data];

        this.loading = false;

        // FORZAR RENDER
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error:', err);
        this.error = true;
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }
}
