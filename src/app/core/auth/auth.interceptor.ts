import { HttpInterceptorFn, HttpErrorResponse, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.accessToken();

  // Clone request with auth header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: any,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;

    return authService.refresh().pipe(
      switchMap((): Observable<HttpEvent<unknown>> => {
        isRefreshing = false;
        const newToken = authService.accessToken();
        if (newToken) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
        return next(req);
      }),
      catchError((error): Observable<HttpEvent<unknown>> => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  return throwError(() => new Error('Token refresh failed'));
}
