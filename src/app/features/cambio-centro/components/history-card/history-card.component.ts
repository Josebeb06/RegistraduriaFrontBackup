import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent {
  @Input() visible: boolean = false;

  @Input() nameOld: string = '—';
  @Input() nameNew: string = '—';

  @Input() centerOld: string = '—';
  @Input() centerNew: string = '—';

  @Input() operator: string = 'Registrador · Sesión activa';
  @Input() timestamp: string = '—';
}
