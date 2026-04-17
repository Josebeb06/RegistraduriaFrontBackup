import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuradoFormComponent } from '../../components/jurado-form/jurado-form.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { JuradoService } from '../../services/jurado.service';

@Component({
  selector: 'app-sorteo-jurados',
  standalone: true,
  imports: [CommonModule, FormsModule, JuradoFormComponent, ToastComponent],
  templateUrl: './sorteo-jurados.component.html',
  styleUrls: ['./sorteo-jurados.component.scss'],
})
export class SorteoJuradosComponent implements OnInit {
  private juradoService = inject(JuradoService);

  // Datos para los selects del formulario
  elecciones: { id: string; nombre: string }[] = [];
  mesas: { id: string; numeroMesa: number }[] = [];
  empresas: { id: string; nombre: string }[] = [];

  // Sorteo
  eleccionSorteoId = '';
  sorteando = false;
  resultadoSorteo: { nombres: string; apellidos: string; juradoTipo: string }[] = [];

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    // Temporal: datos mock hasta conectar con back
    this.elecciones = [
      { id: '1', nombre: 'Elecciones Presidenciales 2026' },
      { id: '2', nombre: 'Elecciones Congreso 2026' },
    ];
    this.mesas = [
      { id: '1', numeroMesa: 1 },
      { id: '2', numeroMesa: 2 },
    ];
    this.empresas = [
      { id: '1', nombre: 'Logística Nacional S.A.' },
      { id: '2', nombre: 'Envíos Seguros Ltda.' },
    ];
  }

  /**
   * Registro manual de jurado
   */
  onRegistrarJurado(data: any): void {
    this.juradoService.crearJurado(data).subscribe({
      next: () => {
        this.toastMessage = 'Jurado registrado correctamente';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: () => {
        this.toastMessage = 'Error al registrar jurado';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  /**
   * Sorteo automático de jurados
   */
  onEjecutarSorteo(): void {
    if (!this.eleccionSorteoId) return;
    this.sorteando = true;
    this.resultadoSorteo = [];

    this.juradoService.ejecutarSorteo(this.eleccionSorteoId).subscribe({
      next: (resultado) => {
        this.resultadoSorteo = resultado;
        this.sorteando = false;
        this.toastMessage = 'Sorteo ejecutado correctamente';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: () => {
        this.sorteando = false;
        this.toastMessage = 'Error al ejecutar el sorteo';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}
