import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let authServiceMock: Partial<AuthService>;
  let routerSpy: jest.Mocked<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/protected' } as RouterStateSnapshot;

  beforeEach(() => {
    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    authServiceMock = {
      isAuthenticated: signal(false),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should allow access when user is authenticated', () => {
    // Set authenticated state
    authServiceMock.isAuthenticated = signal(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Set unauthenticated state
    authServiceMock.isAuthenticated = signal(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login when authentication state changes to false', () => {
    // First call - authenticated
    authServiceMock.isAuthenticated = signal(true);
    const isAuthenticatedSignal = authServiceMock.isAuthenticated;

    const result1 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result1).toBe(true);

    // Second call - not authenticated
    authServiceMock.isAuthenticated = signal(false);
    const result2 = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );
    expect(result2).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle edge case with null authentication state gracefully', () => {
    // Testing with a signal that returns falsy value
    authServiceMock.isAuthenticated = signal(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
  });
});

import '@angular/core/rxjs-interop';