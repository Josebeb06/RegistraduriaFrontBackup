import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './partido-form.component.html',
  styleUrls: ['./partido-form.component.scss'],
})
export class PartidoFormComponent {
  @Output() formSubmit = new EventEmitter<any>();

  partidoForm: FormGroup;

  archivos: any = {};

  // 📁 5 archivos EXACTOS del mockup
  fileTypes = [
    { key: 'logo', label: 'Logosímbolo' },
    { key: 'estatutos', label: 'Estatutos' },
    { key: 'plataforma', label: 'Plataforma ideológica' },
    { key: 'registro', label: 'Registro de afiliados y directivos' },
    { key: 'certificado', label: 'Certificado de representatividad electoral' },
  ];

  constructor(private fb: FormBuilder) {
    this.partidoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      sigla: ['', Validators.required],
    });
  }

  // 📁 SUBIR PDF
  onFileChange(event: any, tipo: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      event.target.value = '';
      return;
    }

    this.archivos = {
      ...this.archivos,
      [tipo]: {
        file,
        name: file.name,
      },
    };
  }

  // ❌ ELIMINAR
  removeFile(tipo: string) {
    delete this.archivos[tipo];
  }

  // 📤 SUBMIT
  onSubmit() {
    if (this.partidoForm.invalid) {
      this.partidoForm.markAllAsTouched();
      return;
    }

    const faltantes = this.fileTypes.filter((f) => !this.archivos[f.key]);

    if (faltantes.length > 0) {
      alert('Debes subir todos los documentos requeridos');
      return;
    }

    const formData = new FormData();

    Object.entries(this.partidoForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    Object.keys(this.archivos).forEach((key) => {
      formData.append(key, this.archivos[key].file);
    });

    this.formSubmit.emit(formData);
  }

  resetForm() {
    this.partidoForm.reset();
    this.archivos = {};
  }

  goBack() {
    window.history.back();
  }
}
