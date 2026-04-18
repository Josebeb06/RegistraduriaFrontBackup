import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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

  get tipoJurado() { return this.juradoForm.get('tipoJurado'); }
  get cedulaCiudadano() { return this.juradoForm.get('cedulaCiudadano'); }
  get numeroMesa() { return this.juradoForm.get('numeroMesa'); }
  get fechaCapacitacion() { return this.juradoForm.get('fechaCapacitacion'); }

  onSubmit(): void {
    if (this.juradoForm.invalid) {
      this.juradoForm.markAllAsTouched();
      return;
    }

    const formValue = this.juradoForm.value;

    // 🔹 FIX: el back espera LocalDateTime, no solo fecha
    // Convierte "2026-05-01" → "2026-05-01T08:00:00"
    const fechaConHora = `${formValue.fechaCapacitacion}T08:00:00`;

    const dto: CreateEleccionJuradoDTO = {
      tipoJurado: formValue.tipoJurado,
      cedulaCiudadano: formValue.cedulaCiudadano,
      numeroMesa: Number(formValue.numeroMesa),
      fechaCapacitacion: fechaConHora,
    };

    this.formSubmit.emit(dto);
  }

  resetForm(): void {
    this.juradoForm.reset();
  }
}