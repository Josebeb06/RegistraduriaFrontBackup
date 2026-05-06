import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CambioCentroRoutingModule } from './cambio-centro-routing.module';

// Pages
import { CambioCentroPageComponent } from './pages/cambio-centro-page/cambio-centro-page.component';

// Components
import { CitizenCardComponent } from './components/citizen-card/citizen-card.component';
import { HistoryCardComponent } from './components/history-card/history-card.component';

/**
 * Módulo: CambioCentro
 *
 * Maneja la funcionalidad de traslado de centro de votación.
 *
 * Estructura:
 * - pages/: vistas completas
 * - components/: reutilizables
 * - services/: lógica de negocio
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CambioCentroRoutingModule,

    // Standalone components
    CambioCentroPageComponent,
    CitizenCardComponent,
    HistoryCardComponent,
  ],
})
export class CambioCentroModule {}
