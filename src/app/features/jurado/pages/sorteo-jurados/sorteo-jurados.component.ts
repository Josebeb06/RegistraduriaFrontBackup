import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuradoFormComponent } from '../../components/jurado-form/jurado-form.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import {
  JuradoService,
  CreateEleccionJuradoDTO,
  ResponseEleccionJuradoDTO,
} from '../../services/jurado.service';
import { EleccionService } from '../../../eleccion/services/eleccion.service';

@Component({
  selector: 'app-sorteo-jurados',
  standalone: true,
  imports: [CommonModule, FormsModule, JuradoFormComponent, ToastComponent],
  templateUrl: './sorteo-jurados.component.html',
  styleUrls: ['./sorteo-jurados.component.scss'],
})
export class SorteoJuradosComponent implements OnInit {
  // Elecciones del back para el select
  elecciones: { idEleccion: number; nombre: string }[] = [];

  // Elección seleccionada para el sorteo y para el form
  eleccionSorteoId: number | null = null;

  // Sorteo
  sorteando = false;
  resultadoSorteo: ResponseEleccionJuradoDTO[] = [];

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private juradoService: JuradoService,
    private eleccionService: EleccionService,
  ) {}

  ngOnInit(): void {
    this.cargarElecciones();
  }

  cargarElecciones(): void {
    this.eleccionService.obtenerElecciones().subscribe({
      next: (data) => {
        this.elecciones = data.map((e: any) => ({
          idEleccion: e.idEleccion,
          nombre: e.nombre,
        }));
      },
      error: () => {
        this.toastMessage = 'Error al cargar elecciones';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  /**
   * Registro manual — idEleccion va en la URL
   */
  onRegistrarJurado(data: CreateEleccionJuradoDTO): void {
    if (!this.eleccionSorteoId) {
      this.mostrarToast('Seleccione una elección primero', 'error');
      return;
    }

    this.juradoService.crearJurado(this.eleccionSorteoId, data).subscribe({
      next: () => {
        this.mostrarToast('Jurado registrado correctamente', 'success');
      },
      error: (err) => {
        this.mostrarToast(err.message || 'Error al registrar jurado', 'error');
      },
    });
  }

  onEjecutarSorteo(): void {
    if (!this.eleccionSorteoId) return;

    this.sorteando = true;
    this.resultadoSorteo = [];

    this.juradoService.ejecutarSorteo(this.eleccionSorteoId).subscribe({
      next: (resultado) => {
        this.resultadoSorteo = resultado;
        this.sorteando = false;
        this.mostrarToast('Sorteo ejecutado correctamente', 'success');
      },
      error: (err) => {
        this.sorteando = false;
        this.mostrarToast(err.message || 'Error al ejecutar el sorteo', 'error');
      },
    });
  }

  /** ✅ FIX TOAST */
  mostrarToast(mensaje: string, tipo: 'success' | 'error') {
    this.showToast = false;
    setTimeout(() => {
      this.toastMessage = mensaje;
      this.toastType = tipo;
      this.showToast = true;
    }, 0);
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}
