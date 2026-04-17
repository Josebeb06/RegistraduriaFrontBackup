import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

/**
 * Componente reutilizable: Formulario de Candidato
 *
 * Responsabilidad:
 * - Capturar datos del candidato
 * - Validar inputs
 * - Emitir datos al componente padre (page)
 *
 * DTO BACKEND (CreateCandidatoDTO):
 * {
 *   nombre: string,
 *   numero: string,
 *   fotoUrl: string,
 *   partidoLogoUrl: string,
 *   idRegistrador: number
 * }
 */
@Component({
  selector: 'app-candidato-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidato-form.component.html',
  styleUrls: ['./candidato-form.component.scss'],
})
export class CandidatoFormComponent {
  @Output() formSubmit = new EventEmitter<any>();

  candidatoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.candidatoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      numero: ['', [Validators.required]],
      fotoUrl: ['', [Validators.required]],
      partidoLogoUrl: ['', [Validators.required]],
      idRegistrador: [1, [Validators.required]], // 🔹 Temporal (luego dinámico)
    });
  }

  // 🔹 Getters para validaciones en HTML
  get nombre() {
    return this.candidatoForm.get('nombre');
  }
  get numero() {
    return this.candidatoForm.get('numero');
  }
  get fotoUrl() {
    return this.candidatoForm.get('fotoUrl');
  }
  get partidoLogoUrl() {
    return this.candidatoForm.get('partidoLogoUrl');
  }
  get idRegistrador() {
    return this.candidatoForm.get('idRegistrador');
  }

  /**
   * 🔹 Submit del formulario
   */
  onSubmit() {
    if (this.candidatoForm.invalid) {
      this.candidatoForm.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.candidatoForm.value);
  }

  /**
   * 🔹 Reset del formulario (para usar desde el padre)
   */
  resetForm() {
    this.candidatoForm.reset({
      idRegistrador: 1,
    });
  }
}
