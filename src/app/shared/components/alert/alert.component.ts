import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

type AlertType = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="alertClasses"
      role="alert"
      [attr.aria-live]="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="flex items-start">
        <!-- Icon -->
        <div class="flex-shrink-0">
          @switch (type) {
            @case ('success') {
              <svg class="h-6 w-6 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @case ('warning') {
              <svg class="h-6 w-6 text-warning-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            @case ('error') {
              <svg class="h-6 w-6 text-danger-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @case ('info') {
              <svg class="h-6 w-6 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          }
        </div>

        <!-- Content -->
        <div class="ml-3 flex-1">
          @if (title) {
            <h3 [class]="titleClasses">{{ title }}</h3>
          }
          <div [class]="messageClasses">
            <p>{{ message }}</p>
          </div>
        </div>

        <!-- Dismiss button -->
        @if (dismissible) {
          <div class="ml-auto pl-3">
            <button
              type="button"
              class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              [class]="dismissButtonClasses"
              (click)="dismiss()"
              [attr.aria-label]="'common.closeAlert' | transloco"
            >
              <span class="sr-only">{{ 'common.close' | transloco }}</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class AlertComponent {
  @Input() type: AlertType = 'info';
  @Input() message = '';
  @Input() title = '';
  @Input() dismissible = false;

  @Output() dismissed = new EventEmitter<void>();

  get alertClasses(): string {
    const baseClasses = 'rounded-lg p-4';
    const typeClasses: Record<AlertType, string> = {
      success: 'bg-success-50 border border-success-200',
      warning: 'bg-warning-50 border border-warning-200',
      error: 'bg-danger-50 border border-danger-200',
      info: 'bg-primary-50 border border-primary-200',
    };
    return `${baseClasses} ${typeClasses[this.type]}`;
  }

  get titleClasses(): string {
    const typeClasses: Record<AlertType, string> = {
      success: 'text-success-800',
      warning: 'text-warning-800',
      error: 'text-danger-800',
      info: 'text-primary-800',
    };
    return `text-heading-sm font-medium mb-1 ${typeClasses[this.type]}`;
  }

  get messageClasses(): string {
    const typeClasses: Record<AlertType, string> = {
      success: 'text-success-700',
      warning: 'text-warning-700',
      error: 'text-danger-700',
      info: 'text-primary-700',
    };
    return `text-body ${typeClasses[this.type]}`;
  }

  get dismissButtonClasses(): string {
    const typeClasses: Record<AlertType, string> = {
      success: 'text-success-500 hover:bg-success-100 focus:ring-success-500',
      warning: 'text-warning-500 hover:bg-warning-100 focus:ring-warning-500',
      error: 'text-danger-500 hover:bg-danger-100 focus:ring-danger-500',
      info: 'text-primary-500 hover:bg-primary-100 focus:ring-primary-500',
    };
    return typeClasses[this.type];
  }

  dismiss(): void {
    this.dismissed.emit();
  }
}
