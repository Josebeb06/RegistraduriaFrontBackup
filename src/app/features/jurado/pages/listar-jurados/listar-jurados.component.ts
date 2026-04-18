import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JuradoCardComponent } from '../../components/jurado-card/jurado-card.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { JuradoService, ResponseEleccionJuradoDTO } from '../../services/jurado.service';

@Component({
  selector: 'app-listar-jurados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, JuradoCardComponent, ToastComponent],
  templateUrl: './listar-jurados.component.html',
  styleUrls: ['./listar-jurados.component.scss'],
})
export class ListarJuradosComponent implements OnInit {
  jurados: ResponseEleccionJuradoDTO[] = [];
  juradosFiltrados: ResponseEleccionJuradoDTO[] = [];

  filtroTipo = '';
  filtroEstado = '';
  filtroBusqueda = '';

  juradoSeleccionado: ResponseEleccionJuradoDTO | null = null;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private juradoService: JuradoService) {}

  ngOnInit(): void {
    this.cargarJurados();
  }

  cargarJurados(): void {
    this.juradoService.getJurados().subscribe({
      next: (data) => {
        this.jurados = data;
        this.juradosFiltrados = data;
      },
      error: () => {
        this.toastMessage = 'Error al cargar jurados';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  onFiltrar(): void {
    this.juradosFiltrados = this.jurados.filter((j) => {
      const coincideTipo = this.filtroTipo ? j.tipoJurado === this.filtroTipo : true;

      const coincideEstado = this.filtroEstado ? j.estado === this.filtroEstado : true;

      const coincideBusqueda = this.filtroBusqueda
        ? j.nombreCiudadano.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
        : true;

      return coincideTipo && coincideEstado && coincideBusqueda;
    });
  }

  onVerDetalle(id: number): void {
    this.juradoSeleccionado = this.jurados.find((j) => j.idAsignacionJurado === id) ?? null;
  }

  onCerrarDetalle(): void {
    this.juradoSeleccionado = null;
  }

  onEliminar(id: number): void {
    this.jurados = this.jurados.filter((j) => j.idAsignacionJurado !== id);
    this.onFiltrar();
    this.toastMessage = 'Jurado eliminado';
    this.toastType = 'success';
    this.showToast = true;
  }

  /**
   * ✅ MAPEO REAL DEL BACK
   */
  getEstadoClass(estado: string): string {
    const clases: Record<string, string> = {
      CAPACITADO: 'badge--capacitado',
      PENDIENTE: 'badge--pendiente',
      NO_PRESENTADO: 'badge--no-presentado',
    };
    return clases[estado] ?? 'badge--pendiente';
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}
