import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-eleccion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './eleccion-form.component.html',
  styleUrls: ['./eleccion-form.component.scss'],
})
export class EleccionFormComponent {
  @Output() formSubmit = new EventEmitter<any>();

  eleccionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eleccionForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(5)]],
        tipo: ['', Validators.required],
        fechaInicio: ['', Validators.required],
        fechaFinalizacion: ['', Validators.required], // corregido
        listaAbierta: [false, Validators.required], // nuevo
        idRegistrador: [1, Validators.required], // temporal
      },
      { validators: this.validarFechas },
    );
  }

  // Validación personalizada (fecha fin > inicio)
  validarFechas(group: AbstractControl) {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFinalizacion')?.value;

    if (inicio && fin && new Date(fin) <= new Date(inicio)) {
      return { fechasInvalidas: true };
    }
    return null;
  }

  // Getters
  get nombre() {
    return this.eleccionForm.get('nombre');
  }
  get tipo() {
    return this.eleccionForm.get('tipo');
  }
  get fechaInicio() {
    return this.eleccionForm.get('fechaInicio');
  }
  get fechaFinalizacion() {
    return this.eleccionForm.get('fechaFinalizacion');
  }
  get listaAbierta() {
    return this.eleccionForm.get('listaAbierta');
  }
  get idRegistrador() {
    return this.eleccionForm.get('idRegistrador');
  }

  // Submit
  onSubmit() {
    if (this.eleccionForm.invalid) {
      this.eleccionForm.markAllAsTouched();
      return;
    }

    const formValue = this.eleccionForm.value;
    const payload = {
      ...formValue,
      fechaInicio: this.formatDate(formValue.fechaInicio),
      fechaFinalizacion: this.formatDate(formValue.fechaFinalizacion),
    };

    this.formSubmit.emit(payload);

    console.log('Elección enviada al backend:', payload);
  }

  private formatDate(date: string): string {
    return date.length === 16 ? `${date}:00` : date;
  }
}
