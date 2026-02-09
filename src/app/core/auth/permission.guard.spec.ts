import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { permissionGuard } from './permission.guard';
import { AuthService } from './auth.service';
import { signal } from '@angular/core';

describe('permissionGuard', () => {
  let authServiceMock: Partial<AuthService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    authServiceMock = {
      isAuthenticated: signal(false),
      hasPermission: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  const createMockRoute = (permission?: string): ActivatedRouteSnapshot => {
    return {
      data: permission ? { permission } : {},
    } as ActivatedRouteSnapshot;
  };

  const mockState = { url: '/admin/users' } as RouterStateSnapshot;

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      authServiceMock.isAuthenticated = signal(false);
    });

    it('should redirect to login when no permission is required', () => {
      const route = createMockRoute();

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to login when permission is required', () => {
      const route = createMockRoute('users:read');

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(authServiceMock.hasPermission).not.toHaveBeenCalled();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      authServiceMock.isAuthenticated = signal(true);
    });

    it('should allow access when no permission is required', () => {
      const route = createMockRoute();

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should allow access when user has required permission', () => {
      const route = createMockRoute('users:read');
      (authServiceMock.hasPermission as jest.Mock).mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(true);
      expect(authServiceMock.hasPermission).toHaveBeenCalledWith('users:read');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to unauthorized when user lacks required permission', () => {
      const route = createMockRoute('users:delete');
      (authServiceMock.hasPermission as jest.Mock).mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(false);
      expect(authServiceMock.hasPermission).toHaveBeenCalledWith('users:delete');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });

    it('should handle multiple different permissions correctly', () => {
      const hasPermissionMock = authServiceMock.hasPermission as jest.Mock;
      
      // Test admin:full permission
      let route = createMockRoute('admin:full');
      hasPermissionMock.mockReturnValue(true);
      
      let result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );
      expect(result).toBe(true);

      // Test reports:read permission (denied)
      route = createMockRoute('reports:read');
      hasPermissionMock.mockReturnValue(false);
      
      result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenLastCalledWith(['/unauthorized']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty permission string', () => {
      authServiceMock.isAuthenticated = signal(true);
      const route = createMockRoute('');

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(authServiceMock.hasPermission).toHaveBeenCalledWith('');
    });

    it('should handle undefined permission in route data', () => {
      authServiceMock.isAuthenticated = signal(true);
      const route = { data: {} } as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(true);
    });

    it('should handle null permission in route data', () => {
      authServiceMock.isAuthenticated = signal(true);
      const route = { data: { permission: null } } as unknown as ActivatedRouteSnapshot;

      const result = TestBed.runInInjectionContext(() =>
        permissionGuard(route, mockState)
      );

      expect(result).toBe(true);
    });
  });
});