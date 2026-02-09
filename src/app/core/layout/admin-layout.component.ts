import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HeaderComponent, TranslocoPipe],
  template: `
    <div class="min-h-screen bg-neutral-50">
      <app-header></app-header>
      
      <div class="flex">
        <!-- Sidebar navigation for admins -->
        <aside class="w-64 bg-white shadow-sm border-r border-neutral-200 min-h-screen">
          <nav class="p-4">
            <ul class="space-y-1">
              <li>
                <a routerLink="/admin/dashboard" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                  {{ 'admin.dashboard' | transloco }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/patients" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {{ 'admin.patients' | transloco }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/results" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {{ 'admin.results' | transloco }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/employees" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {{ 'admin.employees' | transloco }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/groups" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {{ 'admin.groups' | transloco }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/audit-log" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                  {{ 'admin.auditLog' | transloco }}
                </a>
              </li>
              <li>
                <a routerLink="/admin/settings" 
                   routerLinkActive="bg-primary-50 text-primary-700"
                   class="flex items-center px-4 py-3 text-body rounded-lg hover:bg-neutral-50 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ 'admin.settings' | transloco }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {}
