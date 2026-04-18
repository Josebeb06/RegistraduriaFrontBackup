import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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
  @ViewChild(JuradoFormComponent)
  juradoFormComponent!: JuradoFormComponent;

  // Elecciones
  elecciones: { idEleccion: number; nombre: string }[] = [];
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
    private cdr: ChangeDetectorRef,
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

        this.cdr.detectChanges(); // IMPORTANTE
      },
      error: () => {
        this.mostrarToast('Error al cargar elecciones', 'error');
      },
    });
  }

  // Registro manual
  onRegistrarJurado(data: CreateEleccionJuradoDTO): void {
    if (!this.eleccionSorteoId) {
      this.mostrarToast('Seleccione una elección primero', 'error');
      return;
    }

    this.juradoService.crearJurado(this.eleccionSorteoId, data).subscribe({
      next: () => {
        this.mostrarToast('Jurado registrado correctamente', 'success');

        // Reset form
        this.juradoFormComponent.resetForm();

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarToast(err?.error?.message || 'Error al registrar jurado', 'error');
      },
    });
  }

  // Sorteo automático
  onEjecutarSorteo(): void {
    if (!this.eleccionSorteoId) return;

    this.sorteando = true;
    this.resultadoSorteo = [];
    this.cdr.detectChanges(); // para mostrar loading

    this.juradoService.ejecutarSorteo(this.eleccionSorteoId).subscribe({
      next: (resultado) => {
        this.resultadoSorteo = resultado;
        this.sorteando = false;

        this.mostrarToast('Sorteo ejecutado correctamente', 'success');

        this.cdr.detectChanges(); // CLAVE (sin esto no se actualiza)
      },
      error: (err) => {
        this.sorteando = false;

        this.mostrarToast(err?.error?.message || 'Error al ejecutar el sorteo', 'error');

        this.cdr.detectChanges();
      },
    });
  }

  // 🔹 Toast FIX (zoneless compatible)
  mostrarToast(mensaje: string, tipo: 'success' | 'error') {
    this.showToast = false;

    setTimeout(() => {
      this.toastMessage = mensaje;
      this.toastType = tipo;
      this.showToast = true;

      this.cdr.detectChanges(); // ESTE ES EL FIX REAL
    }, 0);
  }

  onCloseToast(): void {
    this.showToast = false;
    this.cdr.detectChanges();
  }
}
