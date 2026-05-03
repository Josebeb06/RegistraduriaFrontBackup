import { Component, EventEmitter, Output } from '@angular/core';
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

  // 📁 Archivos con metadata completa
  archivos: any = {};

  // 📁 Tipos de archivos requeridos
  fileTypes = [
    { key: 'foto', label: 'Fotografía' },
    { key: 'e6', label: 'Formulario E-6' },
    { key: 'cert', label: 'Certificado Consejo de Estado' },
    { key: 'cedula', label: 'Fotocopia Cédula' },
    { key: 'aval', label: 'Aval' },
  ];

  // 🏛️ Organizaciones
  organizaciones = ['Partido Liberal', 'Partido Conservador', 'Partido Verde', 'Cambio Radical'];

  // 🗳️ Tipos de elección
  elecciones = [
    'Presidenciales',
    'Legislativas',
    'Locales y Regionales',
    'Consultas',
    'Especiales',
  ];

  // 🔁 Relación Elección → Cargos
  cargosMap: any = {
    Presidenciales: ['Presidente'],
    Legislativas: ['Senador', 'Representante'],
    'Locales y Regionales': ['Gobernador', 'Alcalde', 'Consejero Local'],
    Consultas: ['Precandidato', 'Directivo Partido'],
    Especiales: ['Consejero Juventud', 'Autoridad Indígena'],
  };

  cargosDisponibles: string[] = [];

  constructor(private fb: FormBuilder) {
    this.candidatoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      organizacion: ['', Validators.required],
      eleccion: ['', Validators.required],
      cargo: ['', Validators.required],
    });
  }

  // 🔄 Cambio de elección → carga cargos dinámicos
  onEleccionChange() {
    const eleccion = this.candidatoForm.get('eleccion')?.value;

    this.cargosDisponibles = this.cargosMap[eleccion] || [];

    // Resetear cargo cuando cambia elección
    this.candidatoForm.get('cargo')?.reset();
  }

  // 📁 Subida de archivo con preview inmediata
  onFileChange(event: any, tipo: string) {
    const file = event.target.files[0];
    if (!file) return;

    // 🔴 VALIDAR PDF
    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      event.target.value = '';
      return;
    }

    // 🔥 IMPORTANTE → actualización inmediata
    this.archivos = {
      ...this.archivos,
      [tipo]: {
        file,
        name: file.name,
      },
    };
  }

  // ❌ Eliminar archivo (arreglado)
  removeFile(tipo: string) {
    if (this.archivos[tipo]?.preview) {
      URL.revokeObjectURL(this.archivos[tipo].preview); // liberar memoria
    }

    delete this.archivos[tipo];
  }

  // 📤 Envío del formulario
  onSubmit() {
    if (this.candidatoForm.invalid) {
      this.candidatoForm.markAllAsTouched();
      return;
    }

    // ⚠️ Validar archivos obligatorios
    const faltantes = this.fileTypes.filter((f) => !this.archivos[f.key]);

    if (faltantes.length > 0) {
      alert('Debes subir todos los documentos requeridos');
      return;
    }

    const formData = new FormData();

    // 📦 Datos del formulario
    Object.entries(this.candidatoForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // 📁 Archivos
    Object.keys(this.archivos).forEach((key) => {
      formData.append(key, this.archivos[key].file);
    });

    this.formSubmit.emit(formData);
  }

  // 🔄 Reset completo
  resetForm() {
    // liberar memoria previews
    Object.keys(this.archivos).forEach((key) => {
      if (this.archivos[key]?.preview) {
        URL.revokeObjectURL(this.archivos[key].preview);
      }
    });

    this.candidatoForm.reset();
    this.cargosDisponibles = [];
    this.archivos = {};
  }

  goBack() {
    window.history.back();
  }
}
