import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { catchError, throwError } from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthenticationService);
  const user = authenticationService.connectedUser.value;

  if (user && !req.url.includes('auth')) {
    req = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + user.accessToken)
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        !req.url.includes('auth') &&
        error.status === 401
      ) {
        authenticationService.logout();
        // Ici tu peux éventuellement rediriger vers la page login si tu veux
        return throwError(() => error);
      } else {
        return throwError(() => error);
      }
    })
  );
};
