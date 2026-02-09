import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-card shadow-sm border border-neutral-200 overflow-hidden"
      [class.hover:shadow-md]="hover"
    >
      @if (headerTemplate || title) {
        <div class="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          @if (headerTemplate) {
            <ng-container *ngTemplateOutlet="headerTemplate" />
          } @else {
            <h3 class="text-heading font-semibold text-neutral-900">{{ title }}</h3>
            @if (subtitle) {
              <p class="text-body text-neutral-500 mt-1">{{ subtitle }}</p>
            }
          }
        </div>
      }

      <div [class.p-6]="!noPadding" [class.p-0]="noPadding">
        <ng-content />
      </div>

      @if (footerTemplate) {
        <div class="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
          <ng-container *ngTemplateOutlet="footerTemplate" />
        </div>
      }
    </div>
  `,
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() hover = false;
  @Input() noPadding = false;

  @ContentChild('header') headerTemplate?: TemplateRef<unknown>;
  @ContentChild('footer') footerTemplate?: TemplateRef<unknown>;
}
