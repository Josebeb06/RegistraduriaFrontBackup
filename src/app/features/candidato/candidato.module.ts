import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CandidatoRoutingModule } from './candidato-routing.module';

// Pages (Componentes de presentación)
import { CrearCandidatoComponent } from './pages/crear-candidato/crear-candidato.component';
import { ListarCandidatosComponent } from './pages/listar-candidato/listar-candidatos.component';

// Components (Componentes reutilizables)
import { CandidatoFormComponent } from './components/candidato-form/candidato-form.component';

/**
 * Módulo de feature: Candidato
 *
 * Proporciona la lógica, componentes y servicios relacionados con la gestión
 * de candidatos dentro del sistema electoral. Este módulo sigue la arquitectura
 * basada en features de Angular, promoviendo separación de responsabilidades
 * y escalabilidad.
 *
 * Estructura:
 * - pages/: Componentes contenedores asociados a vistas completas
 * - components/: Componentes reutilizables dentro de la feature
 * - services/: Servicios para interacción con backend y lógica de negocio
 *
 * Este módulo está preparado para lazy loading desde el routing principal.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CandidatoRoutingModule,

    // Pages
    CrearCandidatoComponent,
    ListarCandidatosComponent,

    // Components
    CandidatoFormComponent,
  ],
})
export class CandidatoModule {}
