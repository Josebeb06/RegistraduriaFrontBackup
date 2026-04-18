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
      next: () => {
        this.mostrarToast('Elección creada correctamente', 'success');
      },
      error: () => {
        this.mostrarToast('Error al crear la elección', 'error');
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
