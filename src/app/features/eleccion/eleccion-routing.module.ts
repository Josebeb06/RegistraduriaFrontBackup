import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrearEleccionComponent } from './pages/crear-eleccion/crear-eleccion.component';

/**
 * Rutas de la feature: Elección
 *
 * Define las rutas disponibles dentro del módulo de elecciones.
 * Estas rutas se cargan de forma perezosa (lazy loading) desde
 * el routing principal de la aplicación.
 *
 * Estructura de rutas:
 * - '' → CrearEleccionComponent (ruta base del módulo)
 *
 * Ejemplo de configuración en app-routing.module.ts:
 * {
 *   path: 'elecciones',
 *   loadChildren: () => import('./features/eleccion/eleccion.module').then(m => m.EleccionModule)
 * }
 */
const routes: Routes = [
  {
    path: 'crear',
    component: CrearEleccionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EleccionRoutingModule {}
