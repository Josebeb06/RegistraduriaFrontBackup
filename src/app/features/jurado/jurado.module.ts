import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { JuradoRoutingModule } from './jurado-routing.module';

// Pages
import { SorteoJuradosComponent } from './pages/sorteo-jurados/sorteo-jurados.component';
import { ListarJuradosComponent } from './pages/listar-jurados/listar-jurados.component';
import { CapacitacionJuradosComponent } from './pages/capacitacion-jurados/capacitacion-jurados.component';

// Components
import { JuradoFormComponent } from './components/jurado-form/jurado-form.component';
import { JuradoCardComponent } from './components/jurado-card/jurado-card.component';

/**
 * Módulo de feature: Jurado
 *
 * Proporciona la lógica, componentes y servicios relacionados con la gestión
 * de jurados dentro del sistema electoral. Este módulo sigue la arquitectura
 * basada en features de Angular, promoviendo separación de responsabilidades
 * y escalabilidad.
 *
 * Estructura:
 * - pages/: Componentes contenedores asociados a vistas completas
 *   · sorteo-jurados     → Registro manual y sorteo automático de jurados
 *   · listar-jurados     → Listado con filtros de jurados registrados
 *   · capacitacion-jurados → Gestión del estado de capacitación
 * - components/: Componentes reutilizables dentro de la feature
 *   · jurado-form  → Formulario de registro de jurado
 *   · jurado-card  → Tarjeta de visualización de jurado
 * - services/: Servicios para interacción con backend
 *   · jurado.service → CRUD + sorteo + capacitación
 *
 * Este módulo está preparado para lazy loading desde el routing principal.
 * FormsModule se incluye por el uso de ngModel en filtros y selects.
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    JuradoRoutingModule,

    // Pages
    SorteoJuradosComponent,
    ListarJuradosComponent,
    CapacitacionJuradosComponent,

    // Components
    JuradoFormComponent,
    JuradoCardComponent,
  ],
})
export class JuradoModule {}
