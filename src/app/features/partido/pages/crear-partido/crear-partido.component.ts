import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoFormComponent } from '../../components/partido-form/partido-form.component';

@Component({
  selector: 'app-crear-partido',
  standalone: true,
  imports: [CommonModule, PartidoFormComponent],
  templateUrl: './crear-partido.component.html',
})
export class CrearPartidoComponent {}
