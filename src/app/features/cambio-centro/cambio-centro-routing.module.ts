import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CambioCentroPageComponent } from './pages/cambio-centro-page/cambio-centro-page.component';

/**
 * Rutas de la feature: Cambio de Centro
 *
 * Estructura:
 * - '' → carga la página principal
 *
 * Lazy loading desde app.routes.ts
 */
const routes: Routes = [
  {
    path: '',
    component: CambioCentroPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioCentroRoutingModule {}
