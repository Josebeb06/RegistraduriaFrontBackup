import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz del Jurado para la card
 * Pendiente ajustar con la respuesta real del back
 *
 * DTO BACKEND (JuradoResponseDTO):
 * {
 *   id: string (UUID),
 *   juradoTipo: 'PRESIDENTE' | 'SECRETARIO' | 'VOCAL' | 'DOMICILIARIO',
 *   nombres: string,
 *   apellidos: string,
 *   numeroDoc: string,
 *   numeroMesa: number,
 *   eleccionNombre: string,
 *   empresaNombre?: string,
 *   fechaCapacitacion: string (ISO date),
 *   estadoCapacitacion: 'PENDIENTE' | 'CAPACITADO' | 'NO_PRESENTADO'
 * }
 */
export interface JuradoCard {
  id: string;
  juradoTipo: 'PRESIDENTE' | 'SECRETARIO' | 'VOCAL' | 'DOMICILIARIO';
  nombres: string;
  apellidos: string;
  numeroDoc: string;
  numeroMesa: number;
  eleccionNombre: string;
  empresaNombre?: string;
  fechaCapacitacion: string;
  estadoCapacitacion: 'PENDIENTE' | 'CAPACITADO' | 'NO_PRESENTADO';
}

@Component({
  selector: 'app-jurado-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jurado-card.component.html',
  styleUrls: ['./jurado-card.component.scss'],
})
export class JuradoCardComponent {
  // Datos del jurado que llegan desde la page padre
  @Input() jurado!: JuradoCard;

  // Eventos hacia la page padre
  @Output() verDetalle = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  /**
   * Label legible por tipo de jurado
   */
  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      PRESIDENTE: 'Presidente de Mesa',
      SECRETARIO: 'Secretario de Mesa',
      VOCAL: 'Vocal',
      DOMICILIARIO: 'Jurado Domiciliario',
    };
    return labels[tipo] ?? tipo;
  }

  /**
   * Label legible por estado de capacitación
   */
  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      CAPACITADO: 'Capacitado',
      NO_PRESENTADO: 'No Presentado',
    };
    return labels[estado] ?? estado;
  }

  /**
   * Emite el id del jurado para ver detalle
   */
  onVerDetalle(): void {
    this.verDetalle.emit(this.jurado.id);
  }

  /**
   * Emite el id del jurado para eliminar
   */
  onEliminar(): void {
    this.eliminar.emit(this.jurado.id);
  }
}
