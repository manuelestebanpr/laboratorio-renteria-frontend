import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div class="w-full max-w-md">
        <div class="card">
          <div class="text-center mb-8">
            <h1 class="text-heading font-bold text-neutral-800 mb-2">
              {{ 'auth.resetRequest' | transloco }}
            </h1>
            <p class="text-body text-neutral-600">
              {{ 'auth.resetRequestDescription' | transloco }}
            </p>
          </div>

          @if (isSuccess()) {
            <app-alert 
              type="success" 
              [message]="'auth.resetRequestSuccess' | transloco"
              class="mb-6">
            </app-alert>
          }

          @if (errorMessage()) {
            <app-alert 
              type="error" 
              [message]="errorMessage()"
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
              [loading]="isLoading()"
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
  private transloco = inject(TranslocoService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return this.transloco.translate('common.required');
      if (control.errors['email']) return this.transloco.translate('common.invalidEmail');
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // TODO: Implement password reset request API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSuccess.set(true);
    }, 1000);
  }
}
