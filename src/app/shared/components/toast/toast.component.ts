import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Auto cerrar en 3 segundos
    setTimeout(() => {
      this.close.emit();
    }, 3000);
  }
}
