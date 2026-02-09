import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredPermission = route.data?.['permission'] as string;

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
