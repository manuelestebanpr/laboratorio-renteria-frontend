import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, initializeAuth, authInitializerProvider } from './auth.service';
import { LoginRequest, LoginResponse, RefreshResponse } from '../../models/auth.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jest.Mocked<Router>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: 'ADMIN' as const,
    permissions: ['users:read', 'users:write'],
    fullName: 'Test User',
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIiwicGVybWlzc2lvbnMiOlsidXNlcnM6cmVhZCIsInVzZXJzOndyaXRlIl0sImZ1bGxOYW1lIjoiVGVzdCBVc2VyIn0.signature',
    expiresIn: 3600,
    forcePasswordChange: false,
    user: mockUser,
  };

  const mockRefreshResponse: RefreshResponse = {
    accessToken: mockLoginResponse.accessToken,
    expiresIn: 3600,
  };

  beforeEach(() => {
    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login()', () => {
    it('should successfully login and store user data', fakeAsync(() => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);

      tick();

      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()).toEqual(mockUser);
      expect(service.accessToken()).toBe(mockLoginResponse.accessToken);
    }));

    it('should handle login error and clear session', fakeAsync(() => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

      tick();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
    }));

    it('should redirect to force-password-change when forcePasswordChange is true', fakeAsync(() => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const forceChangeResponse = {
        ...mockLoginResponse,
        forcePasswordChange: true,
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush(forceChangeResponse);

      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/force-password-change']);
    }));

    it('should redirect based on user role for PATIENT', fakeAsync(() => {
      const credentials: LoginRequest = {
        email: 'patient@example.com',
        password: 'password123',
      };

      const patientResponse = {
        ...mockLoginResponse,
        user: { ...mockUser, role: 'PATIENT' },
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush(patientResponse);

      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/patient']);
    }));

    it('should redirect based on user role for EMPLOYEE', fakeAsync(() => {
      const credentials: LoginRequest = {
        email: 'employee@example.com',
        password: 'password123',
      };

      const employeeResponse = {
        ...mockLoginResponse,
        user: { ...mockUser, role: 'EMPLOYEE' },
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush(employeeResponse);

      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
    }));

    it('should redirect to login for unknown role', fakeAsync(() => {
      const credentials: LoginRequest = {
        email: 'unknown@example.com',
        password: 'password123',
      };

      const unknownResponse = {
        ...mockLoginResponse,
        user: { ...mockUser, role: 'UNKNOWN' },
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush(unknownResponse);

      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('logout()', () => {
    it('should clear session and redirect to login on successful logout', fakeAsync(() => {
      // First login
      service['_accessToken'].set(mockLoginResponse.accessToken);
      service['_currentUser'].set(mockUser);

      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      req.flush({});

      tick();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should clear session and redirect even if logout request fails', fakeAsync(() => {
      // First login
      service['_accessToken'].set(mockLoginResponse.accessToken);
      service['_currentUser'].set(mockUser);

      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/logout`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      tick();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));
  });

  describe('refresh()', () => {
    it('should successfully refresh token and update user', fakeAsync(() => {
      service.refresh().subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        expect(service.accessToken()).toBe(mockRefreshResponse.accessToken);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockRefreshResponse);

      tick();

      expect(service.currentUser()?.email).toBe('test@example.com');
    }));

    it('should handle refresh failure and logout', fakeAsync(() => {
      service.refresh().subscribe(() => {
        expect(service.isAuthenticated()).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
      req.flush({ message: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });

      tick();

      expect(service.isAuthenticated()).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('should return void observable on success', fakeAsync(() => {
      let result: void | undefined;

      service.refresh().subscribe((value) => {
        result = value;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
      req.flush(mockRefreshResponse);

      tick();

      expect(result).toBeUndefined();
    }));
  });

  describe('hasPermission()', () => {
    it('should return true when user has permission', () => {
      service['_accessToken'].set(mockLoginResponse.accessToken);
      service['_currentUser'].set(mockUser);

      expect(service.hasPermission('users:read')).toBe(true);
      expect(service.hasPermission('users:write')).toBe(true);
    });

    it('should return false when user does not have permission', () => {
      service['_accessToken'].set(mockLoginResponse.accessToken);
      service['_currentUser'].set(mockUser);

      expect(service.hasPermission('users:delete')).toBe(false);
      expect(service.hasPermission('admin:full')).toBe(false);
    });

    it('should return false when user is not authenticated', () => {
      expect(service.hasPermission('users:read')).toBe(false);
    });

    it('should return false when user has empty permissions', () => {
      service['_accessToken'].set(mockLoginResponse.accessToken);
      service['_currentUser'].set({ ...mockUser, permissions: [] });

      expect(service.hasPermission('users:read')).toBe(false);
    });
  });

  describe('decodeToken()', () => {
    it('should correctly extract user from valid JWT', fakeAsync(() => {
      service.refresh().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
      req.flush(mockRefreshResponse);

      tick();

      const user = service.currentUser();
      expect(user).not.toBeNull();
      expect(user?.id).toBe('1');
      expect(user?.email).toBe('test@example.com');
      expect(user?.role).toBe('ADMIN');
      expect(user?.fullName).toBe('Test User');
      expect(user?.permissions).toEqual(['users:read', 'users:write']);
    }));

    it('should handle token without permissions field', fakeAsync(() => {
      const tokenWithoutPermissions = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJub3Blcm1zQGV4YW1wbGUuY29tIiwicm9sZSI6IlBBVElFTlQiLCJmdWxsTmFtZSI6Ik5vIFBlcm1zIn0.signature';

      service.refresh().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
      req.flush({
        accessToken: tokenWithoutPermissions,
        expiresIn: 3600,
      });

      tick();

      const user = service.currentUser();
      expect(user?.permissions).toEqual([]);
    }));

    it('should handle invalid token gracefully', fakeAsync(() => {
      service.refresh().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/refresh`);
      req.flush({
        accessToken: 'invalid-token',
        expiresIn: 3600,
      });

      tick();

      const user = service.currentUser();
      expect(user).toBeDefined();
    }));
  });

  describe('computed signals', () => {
    it('should reflect authentication state changes', fakeAsync(() => {
      expect(service.isAuthenticated()).toBe(false);

      service.login({ email: 'test@example.com', password: 'password123' }).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush(mockLoginResponse);

      tick();

      expect(service.isAuthenticated()).toBe(true);
    }));

    it('should compute permissions as a Set', () => {
      service['_currentUser'].set(mockUser);

      const permissions = service.permissions();
      expect(permissions).toBeInstanceOf(Set);
      expect(permissions.has('users:read')).toBe(true);
      expect(permissions.has('users:write')).toBe(true);
    });
  });

  describe('initializeAuth factory', () => {
    it('should return a function that calls refresh', () => {
      const refreshSpy = jest.spyOn(service, 'refresh').mockReturnValue(of(void 0));

      const initFn = initializeAuth(service);
      initFn().subscribe();

      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe('authInitializerProvider', () => {
    it('should be configured correctly', () => {
      expect(authInitializerProvider.provide).toBeDefined();
      expect(authInitializerProvider.useFactory).toBe(initializeAuth);
      expect(authInitializerProvider.deps).toContain(AuthService);
      expect(authInitializerProvider.multi).toBe(true);
    });
  });
});

// Helper for observable
import { of } from 'rxjs';