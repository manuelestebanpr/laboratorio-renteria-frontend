import { Component, Input, forwardRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full">
      @if (label) {
        <label [for]="id" class="block text-body font-semibold text-neutral-700 mb-2">
          {{ label }}
          @if (required) {
            <span class="text-danger-500">*</span>
          }
        </label>
      }
      <div class="relative">
        <input
          [id]="id"
          [type]="currentType"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-describedby]="error ? id + '-error' : null"
          [attr.aria-invalid]="!!error"
          class="form-input"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
        @if (type === 'password') {
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
            (click)="togglePasswordVisibility()">
            @if (showPassword) {
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            } @else {
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            }
          </button>
        }
      </div>
      @if (error) {
        <p [id]="id + '-error'" class="form-error">{{ error }}</p>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() id = '';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() error = '';
  @Input() disabled = false;

  value = '';
  showPassword = false;
  currentType: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' = 'text';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  ngOnInit(): void {
    this.currentType = this.type;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.currentType = this.showPassword ? 'text' : 'password';
  }
}
