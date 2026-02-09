import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClass"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading"
      (click)="onClick()">
      @if (loading) {
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      @if (icon && !loading) {
        <span class="mr-2">{{ icon }}</span>
      }
      {{ label }}
    </button>
  `
})
export class ButtonComponent {
  @Input() label = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() icon = '';
  @Input() ariaLabel = '';
  @Output() clicked = new EventEmitter<void>();

  get buttonClass(): string {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-btn transition-colors duration-200 focus-visible:ring-focus focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-white text-primary-700 border-2 border-primary-500 hover:bg-primary-50 active:bg-primary-100',
      danger: 'bg-danger-500 text-white hover:bg-danger-700',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-6 py-3 text-body min-h-[48px]',
      lg: 'px-8 py-4 text-body-lg min-h-[56px]',
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
