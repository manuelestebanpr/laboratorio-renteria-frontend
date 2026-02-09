import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <h1 class="text-heading font-bold text-neutral-800 mb-6">{{ 'patient.results' | transloco }}</h1>
      <p class="text-body text-neutral-600">Results list page - Coming soon</p>
    </div>
  `
})
export class ResultsListComponent {}
