import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const user = authService.getCurrentPersonSync();

  if (user && user.roles?.includes('ROLE_ADMIN')) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
