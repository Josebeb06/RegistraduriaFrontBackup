import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseEleccionJuradoDTO } from '../../services/jurado.service';

/**
 * Componente: JuradoCard
 * Muestra la información de un jurado usando el ResponseEleccionJuradoDTO real del back.
 */
export type JuradoCard = ResponseEleccionJuradoDTO;

@Component({
  selector: 'app-jurado-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jurado-card.component.html',
  styleUrls: ['./jurado-card.component.scss'],
})
export class JuradoCardComponent {
  @Input() jurado!: JuradoCard;
  @Output() verDetalle = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      PRESIDENTE: 'Presidente de Mesa',
      SECRETARIO: 'Secretario de Mesa',
      VOCAL: 'Vocal',
      DOMICILIARIO: 'Jurado Domiciliario',
    };
    return labels[tipo] ?? tipo;
  }

  getAsignadoLabel(asignado: boolean): string {
    return asignado ? 'Asignado' : 'Pendiente';
  }

  onVerDetalle(): void {
    this.verDetalle.emit(this.jurado.idAsignacionJurado);
  }

  onEliminar(): void {
    this.eliminar.emit(this.jurado.idAsignacionJurado);
  }
}
