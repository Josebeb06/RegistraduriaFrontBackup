import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  archivos: any = {};

  fileTypes = [
    { key: 'foto', label: 'Fotografía' },
    { key: 'e6', label: 'Formulario E-6' },
    { key: 'cert', label: 'Certificado Consejo de Estado' },
    { key: 'cedula', label: 'Fotocopia Cédula' },
    { key: 'aval', label: 'Aval' },
  ];

  organizaciones = ['Partido Liberal', 'Partido Conservador', 'Partido Verde', 'Cambio Radical'];

  elecciones = [
    'Presidenciales',
    'Legislativas',
    'Locales y Regionales',
    'Consultas',
    'Especiales',
  ];

  cargosMap: any = {
    Presidenciales: ['Presidente'],
    Legislativas: ['Senador', 'Representante'],
    'Locales y Regionales': ['Gobernador', 'Alcalde', 'Consejero Local'],
    Consultas: ['Precandidato', 'Directivo Partido'],
    Especiales: ['Consejero Juventud', 'Autoridad Indígena'],
  };

  cargosDisponibles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.candidatoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      organizacion: ['', Validators.required],
      eleccion: ['', Validators.required],
      cargo: ['', Validators.required],
    });
  }

  onEleccionChange() {
    const eleccion = this.candidatoForm.get('eleccion')?.value;
    this.cargosDisponibles = this.cargosMap[eleccion] || [];
    this.candidatoForm.get('cargo')?.reset();
    this.cdr.detectChanges();
  }

  onFileChange(event: any, tipo: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      event.target.value = '';
      return;
    }

    this.archivos = { ...this.archivos, [tipo]: { file, name: file.name } };
    this.cdr.detectChanges();
  }

  removeFile(tipo: string) {
    if (this.archivos[tipo]?.preview) {
      URL.revokeObjectURL(this.archivos[tipo].preview);
    }
    delete this.archivos[tipo];
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.candidatoForm.invalid) {
      this.candidatoForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const faltantes = this.fileTypes.filter((f) => !this.archivos[f.key]);
    if (faltantes.length > 0) {
      alert('Debes subir todos los documentos requeridos');
      return;
    }

    const formData = new FormData();

    // ✅ El back espera el JSON con Content-Type application/json
    // Se envía como Blob igual que en el script .sh con ;type=application/json
    const data = {
      nombre: this.candidatoForm.value.nombre,
      numero: '1', // campo requerido por el DTO — ajustar según flujo
      activo: true,
      idLista: 1, // ajustar cuando haya selector de lista
      idPartido: 1, // ajustar cuando haya selector de partido
      idRegistrador: 1, // ajustar cuando haya sesión real
    };

    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    // ✅ Claves exactas que espera el back según el OpenAPI y el script .sh
    formData.append('foto', this.archivos['foto'].file);
    formData.append('formularioE6', this.archivos['e6'].file); // clave corregida
    formData.append('certificado', this.archivos['cert'].file);
    formData.append('cedula', this.archivos['cedula'].file);
    formData.append('aval', this.archivos['aval'].file);

    this.formSubmit.emit(formData);
  }

  resetForm() {
    Object.keys(this.archivos).forEach((key) => {
      if (this.archivos[key]?.preview) URL.revokeObjectURL(this.archivos[key].preview);
    });
    this.candidatoForm.reset();
    this.cargosDisponibles = [];
    this.archivos = {};
    this.cdr.detectChanges();
  }

  goBack() {
    window.history.back();
  }
}
