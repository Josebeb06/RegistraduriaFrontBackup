import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  /**
   * LANDING (Registrador)
   * Se carga como módulo lazy
   */
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/registrador/landing-routing.module').then((m) => m.LANDING_ROUTES),
    canActivate: [AuthGuard], // ← PROTEGIDA
  },

  // AUTH (LOGIN) - SIN PROTECCIÓN
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  /**
   * PARTIDOS
   */
  {
    path: 'partidos',
    loadChildren: () => import('./features/partido/partido.module').then((m) => m.PartidoModule),
  },
  /**
   * CANDIDATOS
   */
  {
    path: 'candidato',
    loadChildren: () =>
      import('./features/candidato/candidato.module').then((m) => m.CandidatoModule),
    canActivate: [AuthGuard], // ← PROTEGIDA
  },

  /**
   * ELECCIONES
   */
  {
    path: 'eleccion',
    loadChildren: () => import('./features/eleccion/eleccion.module').then((m) => m.EleccionModule),
    canActivate: [AuthGuard], // ← PROTEGIDA
  },

  /**
   * JURADOS
   */
  {
    path: 'jurado',
    loadChildren: () => import('./features/jurado/jurado.module').then((m) => m.JuradoModule),
    canActivate: [AuthGuard], // ← PROTEGIDA
  },

  /**
   * RUTA FALLBACK (si escriben mal la URL)
   */
  {
    path: '**',
    redirectTo: '',
  },
];
