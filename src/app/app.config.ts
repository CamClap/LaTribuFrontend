import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './interceptors/autenthication.interceptor.spec';
import { AuthenticationService } from './services/authentication.service';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideAppInitializer(() => {
      const authenticationService = inject(AuthenticationService);
      authenticationService.init();
    })
  ]
};

