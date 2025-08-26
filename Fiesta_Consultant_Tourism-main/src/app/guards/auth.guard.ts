// auth.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http
    .get('http://localhost:4000/api/verify-token', {
      withCredentials: true,
    })
    .pipe(
      map(() => true),
      catchError(() => {
        localStorage.setItem('returnUrl', state.url);
        router.navigate(['/login']);
        return of(false);
      })
    );
};
