import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity"
          (click)="closeOnBackdrop && close()"
        />

        <!-- Modal panel -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div
            [class]="modalSizeClass"
            class="relative transform overflow-hidden rounded-card bg-white text-left shadow-xl transition-all"
          >
            <!-- Header -->
            <div class="bg-white px-6 py-4 border-b border-neutral-200">
              <div class="flex items-center justify-between">
                <h3 [id]="titleId" class="text-heading font-semibold text-neutral-900">
                  {{ title }}
                </h3>
                @if (showCloseButton) {
                  <button
                    type="button"
                    class="text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1"
                    (click)="close()"
                    [attr.aria-label]="'Cerrar'"
                  >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                }
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <ng-content />
            </div>

            <!-- Footer -->
            @if (hasFooter) {
              <div class="bg-neutral-50 px-6 py-4 border-t border-neutral-200">
                <ng-content select="[footer]" />
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() open = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop = true;
  @Input() showCloseButton = true;
  @Input() hasFooter = false;

  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalContent') modalContent?: ElementRef<HTMLDivElement>;

  private previousActiveElement: Element | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  get titleId(): string {
    return `modal-title-${this.title.replace(/\s+/g, '-').toLowerCase()}`;
  }

  get modalSizeClass(): string {
    const sizes: Record<ModalSize, string> = {
      sm: 'w-full max-w-sm',
      md: 'w-full max-w-lg',
      lg: 'w-full max-w-4xl',
    };
    return sizes[this.size];
  }

  ngAfterViewInit(): void {
    if (this.open) {
      this.setupFocusTrap();
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  close(): void {
    this.closed.emit();
    this.restoreFocus();
  }

  private setupFocusTrap(): void {
    this.previousActiveElement = document.activeElement;

    this.keydownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && this.closeOnBackdrop) {
        this.close();
      }
    };

    document.addEventListener('keydown', this.keydownHandler);
  }

  private removeEventListeners(): void {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  private restoreFocus(): void {
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }
}
