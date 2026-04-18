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

        this.mostrarToast('Candidato creado correctamente', 'success');
      },
      error: () => {
        this.mostrarToast('Error al crear candidato', 'error');
      },
    });
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error') {
    this.showToast = false;
    setTimeout(() => {
      this.toastMessage = mensaje;
      this.toastType = tipo;
      this.showToast = true;
    }, 0);
  }
  /**
   * Cerrar toast
   */
  onCloseToast() {
    this.showToast = false;
  }
}
