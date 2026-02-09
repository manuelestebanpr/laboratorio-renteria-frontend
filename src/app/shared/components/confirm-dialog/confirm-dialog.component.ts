import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

type ConfirmType = 'danger' | 'normal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [open]="open"
      [title]="title"
      size="sm"
      [closeOnBackdrop]="!isProcessing"
      [showCloseButton]="!isProcessing"
      (closed)="onCancel()"
      [hasFooter]="true"
    >
      <p class="text-body text-neutral-700">{{ message }}</p>

      <div footer class="flex justify-end space-x-3">
        <app-button
          [label]="cancelLabel"
          variant="secondary"
          [disabled]="isProcessing"
          (clicked)="onCancel()"
        />
        <app-button
          [label]="confirmLabel"
          [variant]="type === 'danger' ? 'danger' : 'primary'"
          [loading]="isProcessing"
          (clicked)="onConfirm()"
        />
      </div>
    </app-modal>
  `,
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmar';
  @Input() message = '¿Está seguro de que desea continuar?';
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  @Input() type: ConfirmType = 'normal';
  @Input() isProcessing = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    if (!this.isProcessing) {
      this.confirmed.emit();
    }
  }

  onCancel(): void {
    if (!this.isProcessing) {
      this.cancelled.emit();
    }
  }
}
