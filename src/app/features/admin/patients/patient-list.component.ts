import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-heading-lg font-bold text-neutral-800">{{ 'admin.patients' | transloco }}</h1>
        <a routerLink="/admin/patients/create" class="btn btn-primary">
          {{ 'admin.createPatient' | transloco }}
        </a>
      </div>
      <div class="card">
        <p class="text-body text-neutral-600">Patient list - Coming soon</p>
      </div>
    </div>
  `
})
export class PatientListComponent {}
