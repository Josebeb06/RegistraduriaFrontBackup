import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateEleccionJuradoDTO } from '../../services/jurado.service';

/**
 * Componente: JuradoFormComponent
 *
 * Captura los datos para crear un jurado según CreateEleccionJuradoDTO real del back:
 * {
 *   tipoJurado: string,
 *   cedulaCiudadano: string,
 *   numeroMesa: number,
 *   fechaCapacitacion: string
 * }
 *
 * NOTA: idEleccion va en la URL, no en el body, por eso no está en el form.
 * La page padre es responsable de pasar el idEleccion al servicio.
 */
@Component({
  selector: 'app-jurado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './jurado-form.component.html',
  styleUrls: ['./jurado-form.component.scss'],
})
export class JuradoFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<CreateEleccionJuradoDTO>();

  juradoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.juradoForm = this.fb.group({
      tipoJurado: ['', [Validators.required]],
      cedulaCiudadano: ['', [Validators.required, Validators.minLength(6)]],
      numeroMesa: [null, [Validators.required, Validators.min(1)]],
      fechaCapacitacion: ['', [Validators.required]],
    });
  }

  get tipoJurado() {
    return this.juradoForm.get('tipoJurado');
  }
  get cedulaCiudadano() {
    return this.juradoForm.get('cedulaCiudadano');
  }
  get numeroMesa() {
    return this.juradoForm.get('numeroMesa');
  }
  get fechaCapacitacion() {
    return this.juradoForm.get('fechaCapacitacion');
  }

  onSubmit(): void {
    if (this.juradoForm.invalid) {
      this.juradoForm.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.juradoForm.value as CreateEleccionJuradoDTO);
  }

  resetForm(): void {
    this.juradoForm.reset();
  }
}
