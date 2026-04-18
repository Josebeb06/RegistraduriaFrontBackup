import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
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
  @ViewChild(EleccionFormComponent)
  eleccionFormComponent!: EleccionFormComponent;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private eleccionService: EleccionService,
    private cdr: ChangeDetectorRef,
  ) {}

  onCrearEleccion(data: any) {
    this.eleccionService.crearEleccion(data).subscribe({
      next: () => {
        this.toastMessage = 'Elección creada correctamente';
        this.toastType = 'success';
        this.showToast = true;

        // Reset del formulario
        this.eleccionFormComponent.eleccionForm.reset({
          listaAbierta: false,
          idRegistrador: 1,
        });

        // Forzar actualización UI (zoneless)
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastMessage = 'Error al crear la elección';
        this.toastType = 'error';
        this.showToast = true;

        this.cdr.detectChanges();
      },
    });
  }

  onCloseToast() {
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
