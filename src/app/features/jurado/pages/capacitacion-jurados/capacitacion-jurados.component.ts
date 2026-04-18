import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { JuradoService, ResponseEleccionJuradoDTO, DashboardEleccionDTO } from '../../services/jurado.service';
import { EleccionService } from '../../../eleccion/services/eleccion.service';

@Component({
  selector: 'app-capacitacion-jurados',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './capacitacion-jurados.component.html',
  styleUrls: ['./capacitacion-jurados.component.scss'],
})
export class CapacitacionJuradosComponent implements OnInit {

  // 🔹 Elecciones para el selector de dashboard
  elecciones: { idEleccion: number; nombre: string }[] = [];
  eleccionSeleccionada: number | null = null;
  dashboard: DashboardEleccionDTO | null = null;

  // 🔹 Jurados de la elección seleccionada
  jurados: ResponseEleccionJuradoDTO[] = [];

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
      error: () => this.mostrarToast('Error al cargar elecciones', 'error'),
    });
  }

  onSeleccionarEleccion(): void {
    if (!this.eleccionSeleccionada) return;
    this.cargarDashboard();
    this.cargarJurados();
  }

  cargarDashboard(): void {
    this.juradoService.getDashboard(this.eleccionSeleccionada!).subscribe({
      next: (data) => { this.dashboard = data; },
      error: () => this.mostrarToast('Error al cargar dashboard', 'error'),
    });
  }

  cargarJurados(): void {
    this.juradoService.getJuradosPorEleccion(this.eleccionSeleccionada!).subscribe({
      next: (data) => { this.jurados = data; },
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