import { Injectable, inject, signal, computed, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RefreshResponse, User } from '../../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Signals for state management
  private _accessToken = signal<string | null>(null);
  private _currentUser = signal<User | null>(null);
  
  // Computed signals
  readonly accessToken = computed(() => this._accessToken());
  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly permissions = computed(() => new Set(this._currentUser()?.permissions ?? []));

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/v1/auth/login`, credentials)
      .pipe(
        tap(response => this.handleLoginSuccess(response)),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  refresh(): Observable<void> {
    return this.http.post<RefreshResponse>(`${this.apiUrl}/v1/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          this._accessToken.set(response.accessToken);
          // Extract user info from JWT payload
          const user = this.decodeToken(response.accessToken);
          this._currentUser.set(user);
        }),
        switchMap(() => of(void 0)),
        catchError(() => {
          this.logout();
          return of(void 0);
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/v1/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  hasPermission(permission: string): boolean {
    return this.permissions().has(permission);
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this._accessToken.set(response.accessToken);
    this._currentUser.set(response.user);
    
    // Redirect based on role and forcePasswordChange
    if (response.forcePasswordChange) {
      this.router.navigate(['/force-password-change']);
    } else {
      this.redirectBasedOnRole(response.user.role);
    }
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'PATIENT':
        this.router.navigate(['/patient']);
        break;
      case 'EMPLOYEE':
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private clearSession(): void {
    this._accessToken.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private decodeToken(token: string): User {
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions || [],
        fullName: payload.fullName,
      };
    } catch {
      return {} as User;
    }
  }
}

// Factory function for APP_INITIALIZER - must be after AuthService class
export function initializeAuth(authService: AuthService): () => Observable<void> {
  return () => authService.refresh();
}

// Provider for APP_INITIALIZER
export const authInitializerProvider = {
  provide: APP_INITIALIZER,
  useFactory: initializeAuth,
  deps: [AuthService],
  multi: true,
};
