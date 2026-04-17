import { Routes } from '@angular/router';
import { DashboardRegistradorComponent } from './pages/dashboard-registrador/dashboard-registrador.component';

/**
 * Routing de la feature LANDING (Registrador)
 *
 * Responsabilidad:
 * - Definir rutas internas de la landing
 * - Escalable a más dashboards (admin, votante, etc)
 */
export const LANDING_ROUTES: Routes = [
  {
    path: '',
    component: DashboardRegistradorComponent,
  },
];
