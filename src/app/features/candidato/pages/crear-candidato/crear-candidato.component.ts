import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
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
  @ViewChild(CandidatoFormComponent)
  candidatoFormComponent!: CandidatoFormComponent;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  constructor(
    private candidatoService: CandidatoService,
    private cdr: ChangeDetectorRef,
  ) {}

  onCrearCandidato(data: any) {
    this.candidatoService.createCandidato(data).subscribe({
      next: () => {
        this.toastMessage = 'Candidato creado correctamente';
        this.toastType = 'success';
        this.showToast = true;

        // Reset del formulario correctamente
        this.candidatoFormComponent.resetForm();

        // Forzar actualización UI (zoneless)
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastMessage = 'Error al crear candidato';
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
