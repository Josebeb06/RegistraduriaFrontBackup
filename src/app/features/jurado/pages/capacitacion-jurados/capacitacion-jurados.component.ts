import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuradoCard } from '../../components/jurado-card/jurado-card.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { JuradoService } from '../../services/jurado.service';

@Component({
  selector: 'app-capacitacion-jurados',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './capacitacion-jurados.component.html',
  styleUrls: ['./capacitacion-jurados.component.scss'],
})
export class CapacitacionJuradosComponent implements OnInit {
  jurados: JuradoCard[] = [];

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  // Estadísticas calculadas
  get totalJurados(): number {
    return this.jurados.length;
  }
  get totalCapacitados(): number {
    return this.jurados.filter((j) => j.estadoCapacitacion === 'CAPACITADO').length;
  }
  get totalPendientes(): number {
    return this.jurados.filter((j) => j.estadoCapacitacion === 'PENDIENTE').length;
  }
  get totalNoPresentados(): number {
    return this.jurados.filter((j) => j.estadoCapacitacion === 'NO_PRESENTADO').length;
  }

  constructor(private juradoService: JuradoService) {}

  ngOnInit(): void {
    this.cargarJurados();
  }

  cargarJurados(): void {
    this.juradoService.getJurados().subscribe({
      next: (data) => {
        this.jurados = data;
      },
      error: () => {
        this.toastMessage = 'Error al cargar jurados';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  /**
   * Marca jurado como capacitado
   */
  onMarcarCapacitado(id: string): void {
    this.juradoService.actualizarEstadoCapacitacion(id, 'CAPACITADO').subscribe({
      next: () => {
        this.actualizarEstadoLocal(id, 'CAPACITADO');
        this.toastMessage = 'Jurado marcado como capacitado';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: () => {
        this.toastMessage = 'Error al actualizar estado';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  /**
   * Marca jurado como no presentado
   */
  onMarcarNoPresentado(id: string): void {
    this.juradoService.actualizarEstadoCapacitacion(id, 'NO_PRESENTADO').subscribe({
      next: () => {
        this.actualizarEstadoLocal(id, 'NO_PRESENTADO');
        this.toastMessage = 'Jurado marcado como no presentado';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: () => {
        this.toastMessage = 'Error al actualizar estado';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  /**
   * Actualiza el estado localmente sin recargar todo
   */
  private actualizarEstadoLocal(id: string, estado: 'CAPACITADO' | 'NO_PRESENTADO'): void {
    const jurado = this.jurados.find((j) => j.id === id);
    if (jurado) jurado.estadoCapacitacion = estado;
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}
