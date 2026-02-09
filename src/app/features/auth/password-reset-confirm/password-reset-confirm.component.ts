import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-password-reset-confirm',
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
              {{ 'auth.resetConfirm' | transloco }}
            </h1>
          </div>

          @if (isSuccess) {
            <app-alert 
              type="success" 
              message="Your password has been reset. Please log in with your new password."
              class="mb-6">
            </app-alert>
            <div class="text-center">
              <a routerLink="/login" class="text-primary-600 hover:text-primary-700">
                {{ 'auth.login' | transloco }}
              </a>
            </div>
          } @else {
            @if (errorMessage) {
              <app-alert 
                type="error" 
                [message]="errorMessage"
                class="mb-6">
              </app-alert>
            }

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
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
                [label]="'auth.resetConfirm' | transloco"
                [loading]="isLoading"
                class="w-full">
              </app-button>
            </form>
          }
        </div>
      </div>
    </div>
  `
})
export class PasswordResetConfirmComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  token = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage = 'Invalid or missing reset token';
      }
    });
  }

  getError(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return 'Password must be at least 8 characters';
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
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // TODO: Implement password reset confirm API call
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 1000);
  }
}
