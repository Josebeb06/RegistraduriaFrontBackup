import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoFormComponent } from '../../components/partido-form/partido-form.component';
import { PartidoService } from '../../services/partido.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-crear-partido',
  standalone: true,
  imports: [CommonModule, PartidoFormComponent, ToastComponent],
  templateUrl: './crear-partido.component.html',
})
export class CrearPartidoComponent {
  @ViewChild(PartidoFormComponent)
  partidoFormComponent!: PartidoFormComponent;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private partidoService: PartidoService,
    private cdr: ChangeDetectorRef,
  ) {}

  onCrearPartido(data: FormData) {
    this.partidoService.crearPartido(data).subscribe({
      next: () => {
        this.toastMessage = 'Partido creado correctamente';
        this.toastType = 'success';
        this.showToast = true;

        this.partidoFormComponent.resetForm();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastMessage = 'Error al crear partido';
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
