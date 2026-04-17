import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatoFormComponent } from '../../components/candidato-form/candidato-form.component';
import { CandidatoService } from '../../service/candidato.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-crear-candidato',
  standalone: true,
  imports: [CommonModule, CandidatoFormComponent, ToastComponent],
  templateUrl: './crear-candidato.component.html',
  styleUrls: ['./crear-candidato.component.scss'],
})
export class CrearCandidatoComponent {
  // Estado del toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private candidatoService: CandidatoService) {}

  /**
   * Crear candidato → conexión real con backend
   */
  onCrearCandidato(data: any) {
    this.candidatoService.createCandidato(data).subscribe({
      next: (response) => {
        console.log('Candidato creado:', response);

        this.toastMessage = 'Candidato creado correctamente';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: (err) => {
        console.error('Error:', err);

        this.toastMessage = 'Error al crear candidato';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  /**
   * Cerrar toast
   */
  onCloseToast() {
    this.showToast = false;
  }
}
