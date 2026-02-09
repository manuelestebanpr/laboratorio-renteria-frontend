import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonComponent,
    InputComponent,
    AlertComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div class="w-full max-w-md">
        <div class="card">
          <div class="text-center mb-8">
            <h1 class="text-heading-lg font-bold text-neutral-800 mb-2">
              Laboratorio Renteria
            </h1>
            <p class="text-body text-neutral-600">{{ 'auth.login' | transloco }}</p>
          </div>

          @if (errorMessage) {
            <app-alert 
              type="error" 
              [message]="errorMessage"
              class="mb-6">
            </app-alert>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              id="email"
              type="email"
              [label]="'auth.email' | transloco"
              formControlName="email"
              [error]="getError('email')"
              [required]="true">
            </app-input>

            <app-input
              id="password"
              type="password"
              [label]="'auth.password' | transloco"
              formControlName="password"
              [error]="getError('password')"
              [required]="true">
            </app-input>

            <div class="flex items-center justify-between">
              <a routerLink="/password-reset" class="text-primary-600 hover:text-primary-700 text-sm">
                {{ 'auth.forgotPassword' | transloco }}
              </a>
            </div>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [label]="'auth.login' | transloco"
              [loading]="isLoading"
              class="w-full">
            </app-button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isLoading = false;
  errorMessage = '';

  getError(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email address';
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'auth.loginError';
      },
    });
  }
}
