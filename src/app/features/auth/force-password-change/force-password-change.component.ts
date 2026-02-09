import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-force-password-change',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
              {{ 'auth.changePassword' | transloco }}
            </h1>
            <p class="text-body text-neutral-600">
              {{ 'auth.forceChangeReason' | transloco }}
            </p>
          </div>

          @if (errorMessage) {
            <app-alert 
              type="error" 
              [message]="errorMessage"
              class="mb-6">
            </app-alert>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <app-input
              id="currentPassword"
              type="password"
              [label]="'auth.currentPassword' | transloco"
              formControlName="currentPassword"
              [error]="getError('currentPassword')"
              [required]="true">
            </app-input>

            <app-input
              id="newPassword"
              type="password"
              [label]="'auth.newPassword' | transloco"
              formControlName="newPassword"
              [error]="getError('newPassword')"
              [required]="true">
            </app-input>

            <app-input
              id="confirmPassword"
              type="password"
              [label]="'auth.confirmPassword' | transloco"
              formControlName="confirmPassword"
              [error]="getError('confirmPassword')"
              [required]="true">
            </app-input>

            <app-button
              type="submit"
              variant="primary"
              size="lg"
              [label]="'auth.changePassword' | transloco"
              [loading]="isLoading"
              class="w-full">
            </app-button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ForcePasswordChangeComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private transloco = inject(TranslocoService);

  form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  isLoading = false;
  errorMessage = '';

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return this.transloco.translate('common.required');
      if (control.errors['minlength']) return this.transloco.translate('common.minLength', { minLength: 8 });
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.form.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = this.transloco.translate('auth.passwordsDoNotMatch');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // TODO: Implement password change API call
    setTimeout(() => {
      this.isLoading = false;
      const user = this.authService.currentUser();
      if (user?.role === 'PATIENT') {
        this.router.navigate(['/patient']);
      } else {
        this.router.navigate(['/admin']);
      }
    }, 1000);
  }
}
