import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseEleccionJuradoDTO } from '../../services/jurado.service';

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
      URNA: 'Jurado de Urna',
      DOMICILIO: 'Jurado Domiciliario',
    };
    return labels[tipo] ?? tipo;
  }

  getEstadoClass(estado: string): string {
    const clases: Record<string, string> = {
      CAPACITADO: 'card__estado--capacitado',
      PENDIENTE: 'card__estado--pendiente',
      NO_PRESENTADO: 'card__estado--no-presentado',
    };
    return clases[estado] ?? 'card__estado--pendiente';
  }

  onVerDetalle(): void {
    this.verDetalle.emit(this.jurado.idAsignacionJurado);
  }

  onEliminar(): void {
    this.eliminar.emit(this.jurado.idAsignacionJurado);
  }
}