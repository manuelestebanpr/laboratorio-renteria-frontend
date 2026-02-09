import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h1 class="text-heading-lg font-bold text-neutral-800">{{ 'admin.dashboard' | transloco }}</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <h3 class="text-heading-sm font-semibold text-neutral-600 mb-2">{{ 'admin.totalPatients' | transloco }}</h3>
          <p class="text-heading-xl font-bold text-primary-600">--</p>
        </div>
        <div class="card">
          <h3 class="text-heading-sm font-semibold text-neutral-600 mb-2">{{ 'admin.totalResults' | transloco }}</h3>
          <p class="text-heading-xl font-bold text-primary-600">--</p>
        </div>
        <div class="card">
          <h3 class="text-heading-sm font-semibold text-neutral-600 mb-2">Pending Requests</h3>
          <p class="text-heading-xl font-bold text-warning-600">--</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
