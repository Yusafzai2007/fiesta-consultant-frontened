import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.http.get<any>('http://localhost:4000/api/verify-token', { withCredentials: true }).pipe(
      map((res) => {
        if (res.role === 'admin') {
          return true; // allow access
        } else {
          return this.router.createUrlTree(['/login']); // not admin → redirect
        }
      }),
      catchError(() => {
        // Token invalid or not present
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
