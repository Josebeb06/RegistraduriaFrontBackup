import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { JuradoService, ResponseEleccionJuradoDTO } from '../../services/jurado.service';

@Component({
  selector: 'app-capacitacion-jurados',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './capacitacion-jurados.component.html',
  styleUrls: ['./capacitacion-jurados.component.scss'],
})
export class CapacitacionJuradosComponent implements OnInit {
  jurados: ResponseEleccionJuradoDTO[] = [];

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  // 🔹 Estadísticas calculadas con campo "asignado" del back
  get totalJurados(): number {
    return this.jurados.length;
  }
  get totalAsignados(): number {
    return this.jurados.filter((j) => j.asignado).length;
  }
  get totalPendientes(): number {
    return this.jurados.filter((j) => !j.asignado).length;
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

  onCloseToast(): void {
    this.showToast = false;
  }
}
