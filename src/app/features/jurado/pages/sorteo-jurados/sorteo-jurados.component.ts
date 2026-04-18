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
      this.toastMessage = 'Seleccione una elección primero';
      this.toastType = 'error';
      this.showToast = true;
      return;
    }

    this.juradoService.crearJurado(this.eleccionSorteoId, data).subscribe({
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
   * Sorteo automático
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
