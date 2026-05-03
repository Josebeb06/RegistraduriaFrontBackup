import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-citizen-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citizen-card.component.html',
  styleUrls: ['./citizen-card.component.scss'],
})
export class CitizenCardComponent {
  @Input() name: string = '';
  @Input() cedula: string = '';
  @Input() center: string = '';
  @Input() visible: boolean = false;
}
