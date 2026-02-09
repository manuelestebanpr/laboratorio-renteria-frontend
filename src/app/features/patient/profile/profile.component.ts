import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  template: `
    <div class="card">
      <h1 class="text-heading font-bold text-neutral-800 mb-6">{{ 'patient.profile' | transloco }}</h1>
      <p class="text-body text-neutral-600">Patient profile page - Coming soon</p>
    </div>
  `
})
export class ProfileComponent {}
