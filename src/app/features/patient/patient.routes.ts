import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { 
    path: 'profile', 
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) 
  },
  { 
    path: 'results', 
    loadComponent: () => import('./results/results-list.component').then(m => m.ResultsListComponent) 
  },
  { 
    path: 'results/:id', 
    loadComponent: () => import('./results/result-detail.component').then(m => m.ResultDetailComponent) 
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./contact-update/contact-update.component').then(m => m.ContactUpdateComponent) 
  },
];
