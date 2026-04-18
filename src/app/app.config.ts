import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { withFetch } from '@angular/common/http';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideHttpClient(withFetch()),
  ],
};
