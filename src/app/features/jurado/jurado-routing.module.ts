import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SorteoJuradosComponent } from './pages/sorteo-jurados/sorteo-jurados.component';
import { ListarJuradosComponent } from './pages/listar-jurados/listar-jurados.component';
import { CapacitacionJuradosComponent } from './pages/capacitacion-jurados/capacitacion-jurados.component';

/**
 * Rutas de la feature: Jurado
 *
 * Define las rutas internas del módulo de jurados. Estas rutas
 * se cargan de forma perezosa (lazy loading) desde el routing principal.
 *
 * Estructura de rutas:
 * - '' → Redirige a 'sorteo'
 * - 'sorteo'       → SorteoJuradosComponent
 * - 'listar'       → ListarJuradosComponent
 * - 'capacitacion' → CapacitacionJuradosComponent
 *
 * Ejemplo de configuración en app.routes.ts:
 * {
 *   path: 'jurado',
 *   loadChildren: () => import('./features/jurado/jurado.module').then(m => m.JuradoModule)
 * }
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'sorteo',
    pathMatch: 'full',
  },
  {
    path: 'sorteo',
    component: SorteoJuradosComponent,
  },
  {
    path: 'listar',
    component: ListarJuradosComponent,
  },
  {
    path: 'capacitacion',
    component: CapacitacionJuradosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuradoRoutingModule {}
