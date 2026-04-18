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

  // 🔹 Filtros
  filtroTipo = '';
  filtroEstado = '';
  filtroBusqueda = '';

  // 🔹 Modal detalle
  juradoSeleccionado: ResponseEleccionJuradoDTO | null = null;

  // 🔹 Toast
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

  /**
   * Filtros corregidos usando los valores reales del back
   * tipoJurado real: 'URNA' | 'DOMICILIO'
   * asignado real: boolean true | false
   */
  onFiltrar(): void {
    this.juradosFiltrados = this.jurados.filter((j) => {
      const coincideTipo = this.filtroTipo
        ? j.tipoJurado === this.filtroTipo
        : true;

      const coincideEstado = this.filtroEstado
      ? j.estado === this.filtroEstado
      : true;

      const coincideBusqueda = this.filtroBusqueda
        ? j.nombreCiudadano.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
        : true;

      return coincideTipo && coincideEstado && coincideBusqueda;
    });
  }

  /**
   * 🔹 Ver detalle abre modal con la info del jurado
   */
  onVerDetalle(id: number): void {
    this.juradoSeleccionado = this.jurados.find(
      (j) => j.idAsignacionJurado === id
    ) ?? null;
  }

  onCerrarDetalle(): void {
    this.juradoSeleccionado = null;
  }

  /**
   * 🔹 Eliminar local hasta que el back implemente el endpoint DELETE
   */
  onEliminar(id: number): void {
    this.jurados = this.jurados.filter((j) => j.idAsignacionJurado !== id);
    this.onFiltrar();
    this.toastMessage = 'Jurado eliminado';
    this.toastType = 'success';
    this.showToast = true;
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}