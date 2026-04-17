import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EleccionRoutingModule } from './eleccion-routing.module';

// Pages (Componentes de presentación)
import { CrearEleccionComponent } from './pages/crear-eleccion/crear-eleccion.component';

// Components (Componentes reutilizables)
import { EleccionFormComponent } from './components/eleccion-form/eleccion-form.component';

/**
 * Módulo de feature: Elección
 *
 * Proporciona la lógica, componentes y servicios relacionados con la gestión
 * de elecciones. Este módulo sigue la arquitectura de features de Angular,
 * separando claramente componentes de presentación (pages) de componentes
 * reutilizables (components).
 *
 * Estructura:
 * - pages/: Componentes contenedores de una página específica
 * - components/: Componentes reutilizables dentro de la feature
 * - services/: Servicios de lógica de negocio
 *
 * Este módulo está preparado para lazy loading desde el routing principal.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EleccionRoutingModule,

    // Pages
    CrearEleccionComponent,

    // Components
    EleccionFormComponent,
  ],
})
export class EleccionModule {}
