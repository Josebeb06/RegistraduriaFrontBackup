// candidato-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrearCandidatoComponent } from './pages/crear-candidato/crear-candidato.component';
import { ListarCandidatosComponent } from './pages/listar-candidato/listar-candidatos.component';

/**
 * Rutas de la feature: Candidato
 *
 * Define las rutas internas del módulo de candidatos. Estas rutas
 * se cargan de forma perezosa (lazy loading) desde el routing principal.
 *
 * Estructura de rutas:
 * - '' → Redirige a 'crear'
 * - 'crear' → CrearCandidatoComponent
 * - 'listar' → ListarCandidatosComponent
 *
 * Ejemplo de configuración en app-routing.module.ts:
 * {
 *   path: 'candidatos',
 *   loadChildren: () => import('./features/candidato/candidato.module').then(m => m.CandidatoModule)
 * }
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'crear',
    pathMatch: 'full',
  },
  {
    path: 'crear',
    component: CrearCandidatoComponent,
  },
  {
    path: 'listar',
    component: ListarCandidatosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatoRoutingModule {}
