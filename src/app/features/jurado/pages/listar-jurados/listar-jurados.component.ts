import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  JuradoCardComponent,
  JuradoCard,
} from '../../components/jurado-card/jurado-card.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { JuradoService } from '../../services/jurado.service';

@Component({
  selector: 'app-listar-jurados',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, JuradoCardComponent, ToastComponent],
  templateUrl: './listar-jurados.component.html',
  styleUrls: ['./listar-jurados.component.scss'],
})
export class ListarJuradosComponent implements OnInit {
  private juradoService = inject(JuradoService);

  jurados: JuradoCard[] = [];
  juradosFiltrados: JuradoCard[] = [];

  // Filtros
  filtroTipo = '';
  filtroEstado = '';
  filtroBusqueda = '';

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

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
   * Aplica filtros combinados
   */
  onFiltrar(): void {
    this.juradosFiltrados = this.jurados.filter((j) => {
      const coincideTipo = this.filtroTipo ? j.juradoTipo === this.filtroTipo : true;
      const coincideEstado = this.filtroEstado ? j.estadoCapacitacion === this.filtroEstado : true;
      const coincideBusqueda = this.filtroBusqueda
        ? `${j.nombres} ${j.apellidos} ${j.numeroDoc}`
            .toLowerCase()
            .includes(this.filtroBusqueda.toLowerCase())
        : true;
      return coincideTipo && coincideEstado && coincideBusqueda;
    });
  }

  onVerDetalle(id: string): void {
    // Pendiente: abrir modal o navegar a detalle
    console.log('Ver detalle jurado:', id);
  }

  onEliminar(id: string): void {
    this.juradoService.eliminarJurado(id).subscribe({
      next: () => {
        this.jurados = this.jurados.filter((j) => j.id !== id);
        this.onFiltrar();
        this.toastMessage = 'Jurado eliminado correctamente';
        this.toastType = 'success';
        this.showToast = true;
      },
      error: () => {
        this.toastMessage = 'Error al eliminar jurado';
        this.toastType = 'error';
        this.showToast = true;
      },
    });
  }

  onCloseToast(): void {
    this.showToast = false;
  }
}
