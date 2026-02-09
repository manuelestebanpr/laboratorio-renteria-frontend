import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-password-reset-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
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
            <h1 class="text-heading font-bold text-neutral-800 mb-2">
              {{ 'auth.resetRequest' | transloco }}
            </h1>
            <p class="text-body text-neutral-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          @if (isSuccess) {
            <app-alert 
              type="success" 
              message="If an account exists with this email, a reset link has been sent."
              class="mb-6">
            </app-alert>
          }

          @if (errorMessage) {
            <app-alert 
              type="error" 
              [message]="errorMessage"
              class="mb-6">
            </app-alert>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              id="email"
              type="email"
              [label]="'auth.email' | transloco"
              formControlName="email"
              [error]="getError('email')"
              [required]="true">
            </app-input>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [label]="'auth.resetRequest' | transloco"
              [loading]="isLoading"
              class="w-full">
            </app-button>

            <div class="text-center">
              <a routerLink="/login" class="text-primary-600 hover:text-primary-700 text-sm">
                {{ 'auth.back' | transloco }}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PasswordResetRequestComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email address';
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // TODO: Implement password reset request API call
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 1000);
  }
}
