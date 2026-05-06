import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/crear-partido/crear-partido.component').then((m) => m.CrearPartidoComponent),
  },
  {
    path: 'listar',
    loadComponent: () =>
      import('./pages/listar-partido/listar-partido.component').then(
        (m) => m.ListarPartidoComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartidoRoutingModule {}
