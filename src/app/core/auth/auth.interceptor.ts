import { HttpInterceptorFn, HttpErrorResponse, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, switchMap, throwError, Observable, of, filter, take } from 'rxjs';
import { AuthService } from './auth.service';

// Use BehaviorSubject to handle concurrent refresh requests
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

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
    refreshTokenSubject.next(null);

    return authService.refresh().pipe(
      switchMap((): Observable<HttpEvent<unknown>> => {
        isRefreshing = false;
        const newToken = authService.accessToken();
        refreshTokenSubject.next(newToken);

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
        refreshTokenSubject.next(null);
        authService.logout();
        return throwError(() => error);
      })
    );
  }

  // If already refreshing, queue this request and retry when refresh completes
  return refreshTokenSubject.pipe(
    filter(token => token !== null || !isRefreshing),
    take(1),
    switchMap((token) => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(req);
      }
      // Refresh failed, logout already triggered
      return throwError(() => new Error('Token refresh failed'));
    })
  );
}
