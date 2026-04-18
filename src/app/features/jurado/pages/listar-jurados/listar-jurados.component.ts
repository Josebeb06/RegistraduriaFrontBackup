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
  filtroAsignado = '';
  filtroBusqueda = '';

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
      const coincideAsignado =
        this.filtroAsignado !== '' ? j.asignado === (this.filtroAsignado === 'true') : true;
      const coincideBusqueda = this.filtroBusqueda
        ? j.nombreCiudadano.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
        : true;
      return coincideTipo && coincideAsignado && coincideBusqueda;
    });
  }

  onVerDetalle(id: number): void {
    console.log('Ver detalle jurado id:', id);
  }

  onEliminar(id: number): void {
    // 🔹 Pendiente: el back no tiene endpoint DELETE para jurados aún
    // Se elimina localmente hasta que el back lo implemente
    this.jurados = this.jurados.filter((j) => j.idAsignacionJurado !== id);
    this.onFiltrar();
    this.toastMessage = 'Jurado eliminado localmente (endpoint pendiente en back)';
    this.toastType = 'success';
    this.showToast = true;
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}
