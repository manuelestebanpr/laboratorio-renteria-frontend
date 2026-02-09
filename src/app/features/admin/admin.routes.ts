import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/permission.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'patients', 
    loadComponent: () => import('./patients/patient-list.component').then(m => m.PatientListComponent),
    canActivate: [permissionGuard],
    data: { permission: 'PATIENT_LIST' }
  },
  { 
    path: 'patients/create', 
    loadComponent: () => import('./patients/patient-create.component').then(m => m.PatientCreateComponent),
    canActivate: [permissionGuard],
    data: { permission: 'PATIENT_CREATE' }
  },
  { 
    path: 'patients/:id', 
    loadComponent: () => import('./patients/patient-detail.component').then(m => m.PatientDetailComponent),
    canActivate: [permissionGuard],
    data: { permission: 'PATIENT_VIEW' }
  },
];
