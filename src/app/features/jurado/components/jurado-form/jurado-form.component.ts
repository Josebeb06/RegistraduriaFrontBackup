import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateEleccionJuradoDTO } from '../../services/jurado.service';

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
      numeroMesa: [null, [Validators.required, Validators.min(1), Validators.max(32)]],
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

    const formValue = this.juradoForm.value;

    // ✅ FIX REAL: crear LocalDateTime válido SIN zona UTC
    const fecha = new Date(formValue.fechaCapacitacion);
    fecha.setHours(8, 0, 0);

    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const hh = String(fecha.getHours()).padStart(2, '0');
    const min = String(fecha.getMinutes()).padStart(2, '0');
    const ss = String(fecha.getSeconds()).padStart(2, '0');

    const fechaFormateada = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;

    const dto: CreateEleccionJuradoDTO = {
      tipoJurado: formValue.tipoJurado,
      cedulaCiudadano: formValue.cedulaCiudadano,
      numeroMesa: Number(formValue.numeroMesa),
      fechaCapacitacion: fechaFormateada,
    };

    this.formSubmit.emit(dto);
  }

  resetForm(): void {
    this.juradoForm.reset();
  }
}
