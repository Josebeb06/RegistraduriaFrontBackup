import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EleccionFormComponent } from '../../components/eleccion-form/eleccion-form.component';
import { EleccionService } from '../../services/eleccion.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-crear-eleccion',
  standalone: true,
  imports: [CommonModule, EleccionFormComponent, ToastComponent],
  templateUrl: './crear-eleccion.component.html',
  styleUrls: ['./crear-eleccion.component.scss'],
})
export class CrearEleccionComponent {
  // Estado del toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(private eleccionService: EleccionService) {}

  /**
   * Crear elección → conexión real con backend
   */
  onCrearEleccion(data: any) {
    this.eleccionService.crearEleccion(data).subscribe({
      next: (response) => {
        console.log('Elección creada:', response);

        this.toastMessage = 'Elección creada correctamente';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: (error) => {
        console.error('Error:', error);

        this.toastMessage = 'Error al crear la elección';
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
