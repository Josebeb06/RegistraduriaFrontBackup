import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartidoRoutingModule } from './partido-routing.module';

// 👇 IMPORTAS el componente, NO lo declaras
import { CrearPartidoComponent } from './pages/crear-partido/crear-partido.component';
import { ListarPartidoComponent } from './pages/listar-partido/listar-partido.component';

@NgModule({
  imports: [CommonModule, PartidoRoutingModule, CrearPartidoComponent, ListarPartidoComponent],
})
export class PartidoModule {}
