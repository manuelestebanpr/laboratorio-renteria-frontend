import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-neutral-50">
      <app-header></app-header>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Simple navigation for patients -->
          <nav class="w-full md:w-64 flex-shrink-0">
            <div class="bg-white rounded-card shadow-sm border border-neutral-200 p-4">
              <ul class="space-y-2">
                <li>
                  <a routerLink="/patient/profile" 
                     routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
                     class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors border-l-4 border-transparent">
                    <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    {{ 'patient.profile' | transloco }}
                  </a>
                </li>
                <li>
                  <a routerLink="/patient/results" 
                     routerLinkActive="bg-primary-50 text-primary-700 border-primary-500"
                     class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors border-l-4 border-transparent">
                    <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    {{ 'patient.results' | transloco }}
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <!-- Main content -->
          <main class="flex-1">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `
})
export class PatientLayoutComponent {}
