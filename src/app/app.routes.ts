import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { PatientLayoutComponent } from './core/layout/patient-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth routes (public)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'password-reset',
    loadComponent: () => import('./features/auth/password-reset-request/password-reset-request.component').then(m => m.PasswordResetRequestComponent),
  },
  {
    path: 'password-reset/confirm',
    loadComponent: () => import('./features/auth/password-reset-confirm/password-reset-confirm.component').then(m => m.PasswordResetConfirmComponent),
  },
  {
    path: 'force-password-change',
    loadComponent: () => import('./features/auth/force-password-change/force-password-change.component').then(m => m.ForcePasswordChangeComponent),
    canActivate: [authGuard],
  },
  
  // Patient portal (lazy loaded)
  {
    path: 'patient',
    component: PatientLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/patient/patient.routes').then(m => m.PATIENT_ROUTES),
  },
  
  // Admin portal (lazy loaded)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  
  // Fallback
  { path: '**', redirectTo: '/login' },
];
