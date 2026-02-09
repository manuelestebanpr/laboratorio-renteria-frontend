import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (overlay) {
      <div class="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-card p-8 shadow-lg">
          <div [class]="spinnerClasses" role="status" aria-busy="true">
            <svg
              class="animate-spin"
              [class]="sizeClasses"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span class="sr-only">{{ loadingText }}</span>
          </div>
          @if (loadingText !== 'Cargando...') {
            <p class="mt-4 text-body text-center text-neutral-700">{{ loadingText }}</p>
          }
        </div>
      </div>
    } @else {
      <div [class]="spinnerClasses" role="status" aria-busy="true">
        <svg
          class="animate-spin"
          [class]="sizeClasses"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span class="sr-only">{{ loadingText }}</span>
      </div>
    }
  `,
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() overlay = false;
  @Input() loadingText = 'Cargando...';

  get spinnerClasses(): string {
    return 'inline-flex items-center justify-center text-primary-600';
  }

  get sizeClasses(): string {
    const sizes: Record<SpinnerSize, string> = {
      sm: 'h-5 w-5',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    };
    return sizes[this.size];
  }
}
