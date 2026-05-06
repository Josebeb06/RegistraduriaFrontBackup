import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Citizen {
  name: string;
  center: string;
  cedula: string;
}

@Component({
  selector: 'app-cambio-centro-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cambio-centro-form.component.html',
  styleUrls: ['./cambio-centro-form.component.scss'],
})
export class CambioCentroFormComponent {
  cedula: string = '';
  selectedCentro: string = '';

  loadingSearch = false;
  loadingSubmit = false;

  currentCitizen: Citizen | null = null;

  showCitizenCard = false;
  showCentroField = false;
  showConfirmButtons = false;
  showHistory = false;

  errorCedula = '';
  errorCentro = '';

  successMessage = '';
  errorMessage = '';

  MOCK_CITIZENS: any = {
    '1234567890': {
      name: 'Carlos Andrés Martínez Peña',
      center: 'IE Colegio Nacional Camilo Torres · Bogotá',
    },
    '9876543210': {
      name: 'María Fernanda López Rodríguez',
      center: 'IE Liceo Antioqueño · Medellín',
    },
  };

  buscarCiudadano() {
    this.clearErrors();

    if (!this.cedula) {
      this.errorCedula = 'Ingrese el número de cédula del ciudadano.';
      return;
    }

    if (this.cedula.length < 6) {
      this.errorCedula = 'La cédula debe tener al menos 6 dígitos.';
      return;
    }

    this.loadingSearch = true;

    setTimeout(() => {
      this.loadingSearch = false;

      const citizen = this.MOCK_CITIZENS[this.cedula];

      if (!citizen) {
        this.errorCedula = 'No se encontró ningún ciudadano.';
        return;
      }

      this.currentCitizen = {
        ...citizen,
        cedula: this.cedula,
      };

      this.showCitizenCard = true;
      this.showCentroField = true;
      this.showConfirmButtons = true;
      this.showHistory = true;
    }, 1200);
  }

  cambiarCentro() {
    this.clearErrors();

    if (!this.selectedCentro) {
      this.errorCentro = 'Seleccione un centro de votación.';
      return;
    }

    this.loadingSubmit = true;

    setTimeout(() => {
      this.loadingSubmit = false;

      this.successMessage = `Centro actualizado para ${this.currentCitizen?.name}`;

      this.showConfirmButtons = false;
    }, 1500);
  }

  resetForm() {
    this.cedula = '';
    this.selectedCentro = '';
    this.currentCitizen = null;

    this.showCitizenCard = false;
    this.showCentroField = false;
    this.showConfirmButtons = false;
    this.showHistory = false;

    this.clearErrors();
  }

  clearErrors() {
    this.errorCedula = '';
    this.errorCentro = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}
