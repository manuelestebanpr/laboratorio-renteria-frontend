import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-white shadow-sm border-b border-neutral-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <span class="text-heading font-bold text-neutral-900 hidden sm:block">
                Laboratorio Renteria
              </span>
            </a>
          </div>

          <!-- Right side: Language selector + User menu -->
          <div class="flex items-center space-x-4">
            <!-- Language Selector -->
            <div class="relative">
              <select
                (change)="changeLanguage($event)"
                [value]="currentLang()"
                class="form-input py-2 px-3 text-body"
                [attr.aria-label]="'common.language' | transloco"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <!-- User Menu -->
            @if (isAuthenticated()) {
              <div class="flex items-center space-x-3">
                <div class="hidden md:block text-right">
                  <p class="text-body font-semibold text-neutral-900">
                    {{ user()?.firstName }} {{ user()?.lastName }}
                  </p>
                  <p class="text-sm text-neutral-500">{{ user()?.email }}</p>
                </div>
                <button
                  (click)="logout()"
                  class="btn-secondary text-sm px-4 py-2"
                  type="button"
                >
                  {{ 'common.logout' | transloco }}
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly user = computed(() => this.authService.user());
  readonly currentLang = computed(() => this.transloco.getActiveLang());

  changeLanguage(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const lang = select.value;
    this.transloco.setActiveLang(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
