import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  loading = true;
  error = false;

  constructor(
    private juradoService: JuradoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarJurados();
  }

  cargarJurados(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.juradoService.getJurados().subscribe({
      next: (data) => {
        queueMicrotask(() => {
          this.jurados = [...data];
          this.juradosFiltrados = [...data];
          this.loading = false;

          this.cdr.detectChanges();
        });
      },
      error: () => {
        queueMicrotask(() => {
          this.error = true;
          this.loading = false;

          this.toastMessage = 'Error al cargar jurados';
          this.toastType = 'error';
          this.showToast = true;

          this.cdr.detectChanges();
        });
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

    this.cdr.detectChanges();
  }

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