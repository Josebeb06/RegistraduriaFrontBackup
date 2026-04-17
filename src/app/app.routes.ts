import { Routes } from '@angular/router';

export const routes: Routes = [
  /**
   * LANDING (Registrador)
   * Se carga como módulo lazy
   */
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/registrador/landing-routing.module').then((m) => m.LANDING_ROUTES),
  },

  /**
   * CANDIDATOS
   */
  {
    path: 'candidato',
    loadChildren: () =>
      import('./features/candidato/candidato.module').then((m) => m.CandidatoModule),
  },

  /**
   * ELECCIONES
   */
  {
    path: 'eleccion',
    loadChildren: () => import('./features/eleccion/eleccion.module').then((m) => m.EleccionModule),
  },

  /**
   * RUTA FALLBACK (si escriben mal la URL)
   */
  {
    path: '**',
    redirectTo: '',
  },
];
