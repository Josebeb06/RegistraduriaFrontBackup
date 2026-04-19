import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import {
  JuradoService,
  ResponseEleccionJuradoDTO,
  DashboardEleccionDTO,
} from '../../services/jurado.service';
import { EleccionService } from '../../../eleccion/services/eleccion.service';

@Component({
  selector: 'app-capacitacion-jurados',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './capacitacion-jurados.component.html',
  styleUrls: ['./capacitacion-jurados.component.scss'],
})
export class CapacitacionJuradosComponent implements OnInit {
  elecciones: { idEleccion: number; nombre: string }[] = [];
  eleccionSeleccionada: number | null = null;

  dashboard: DashboardEleccionDTO | null = null;
  jurados: ResponseEleccionJuradoDTO[] = [];

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  loading = true;
  error = false;

  constructor(
    private juradoService: JuradoService,
    private eleccionService: EleccionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarElecciones();
  }

  cargarElecciones(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.eleccionService.obtenerElecciones().subscribe({
      next: (data) => {
        queueMicrotask(() => {
          this.elecciones = data.map((e: any) => ({
            idEleccion: e.idEleccion,
            nombre: e.nombre,
          }));

          if (this.elecciones.length > 0) {
            this.eleccionSeleccionada = this.elecciones[0].idEleccion;
            this.onSeleccionarEleccion();
          }

          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        queueMicrotask(() => {
          this.error = true;
          this.loading = false;

          this.mostrarToast('Error al cargar elecciones', 'error');
          this.cdr.detectChanges();
        });
      },
    });
  }

  onSeleccionarEleccion(): void {
    if (!this.eleccionSeleccionada) return;

    this.cargarDashboard();
    this.cargarJurados();
  }

  cargarDashboard(): void {
    this.juradoService.getDashboard(this.eleccionSeleccionada!).subscribe({
      next: (data) => {
        queueMicrotask(() => {
          this.dashboard = data;
          this.cdr.detectChanges();
        });
      },
      error: () => this.mostrarToast('Error al cargar dashboard', 'error'),
    });
  }

  cargarJurados(): void {
    this.juradoService.getJuradosPorEleccion(this.eleccionSeleccionada!).subscribe({
      next: (data) => {
        queueMicrotask(() => {
          this.jurados = [...data];
          this.cdr.detectChanges();
        });
      },
      error: () => this.mostrarToast('Error al cargar jurados', 'error'),
    });
  }

  getEstadoClass(estado: string): string {
    const clases: Record<string, string> = {
      CAPACITADO: 'badge--capacitado',
      PENDIENTE: 'badge--pendiente',
      NO_PRESENTADO: 'badge--no-presentado',
    };
    return clases[estado] ?? 'badge--pendiente';
  }

  private mostrarToast(mensaje: string, tipo: 'success' | 'error'): void {
    this.showToast = false;
    queueMicrotask(() => {
      this.toastMessage = mensaje;
      this.toastType = tipo;
      this.showToast = true;
      this.cdr.detectChanges();
    });
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}