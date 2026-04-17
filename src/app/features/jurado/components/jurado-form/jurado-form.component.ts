import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

/**
 * Componente reutilizable: Formulario de Jurado
 *
 * Responsabilidad:
 * - Capturar datos del jurado a registrar
 * - Validar inputs según tipo de jurado
 * - Emitir datos al componente padre (page)
 *
 * DTO BACKEND (CreateJuradoDTO) — pendiente confirmar con back:
 * {
 *   juradoTipo: 'PRESIDENTE' | 'SECRETARIO' | 'VOCAL' | 'DOMICILIARIO',
 *   ciudadanoId: string (UUID),        ← se resuelve con numeroDoc en el back
 *   eleccionId: string (UUID),
 *   mesaId: string (UUID),
 *   empresaLogisticaId?: string (UUID), ← solo si es DOMICILIARIO
 *   fechaCapacitacion: string (ISO date)
 * }
 */
@Component({
  selector: 'app-jurado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jurado-form.component.html',
  styleUrls: ['./jurado-form.component.scss'],
})
export class JuradoFormComponent implements OnInit {
  // Datos que llegan desde la page padre
  @Input() elecciones: { id: string; nombre: string }[] = [];
  @Input() mesas: { id: string; numeroMesa: number }[] = [];
  @Input() empresas: { id: string; nombre: string }[] = [];

  @Output() formSubmit = new EventEmitter<any>();

  juradoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.juradoForm = this.fb.group({
      juradoTipo: ['', [Validators.required]],
      numeroDoc: ['', [Validators.required, Validators.minLength(6)]],
      eleccionId: ['', [Validators.required]],
      mesaId: ['', [Validators.required]],
      empresaLogisticaId: [''],
      fechaCapacitacion: ['', [Validators.required]],
    });

    // Si cambia el tipo a DOMICILIARIO, exige empresa logística
    this.juradoTipo?.valueChanges.subscribe((tipo) => {
      const empresaControl = this.juradoForm.get('empresaLogisticaId');
      if (tipo === 'DOMICILIARIO') {
        empresaControl?.setValidators([Validators.required]);
      } else {
        empresaControl?.clearValidators();
        empresaControl?.setValue('');
      }
      empresaControl?.updateValueAndValidity();
    });
  }

  // Getters para validaciones en HTML
  get juradoTipo() {
    return this.juradoForm.get('juradoTipo');
  }
  get numeroDoc() {
    return this.juradoForm.get('numeroDoc');
  }
  get eleccionId() {
    return this.juradoForm.get('eleccionId');
  }
  get mesaId() {
    return this.juradoForm.get('mesaId');
  }
  get empresaLogisticaId() {
    return this.juradoForm.get('empresaLogisticaId');
  }
  get fechaCapacitacion() {
    return this.juradoForm.get('fechaCapacitacion');
  }

  /**
   * Submit del formulario
   */
  onSubmit(): void {
    if (this.juradoForm.invalid) {
      this.juradoForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.juradoForm.value);
  }

  /**
   * Reset del formulario (para usar desde el padre)
   */
  resetForm(): void {
    this.juradoForm.reset();
  }
}
