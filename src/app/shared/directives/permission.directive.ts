import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  effect,
} from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

/**
 * Structural directive to conditionally show/hide elements based on user permissions.
 * Usage: *appHasPermission="'PERMISSION_CODE'"
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permission: string | null = null;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasPermission(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  ngOnInit(): void {
    // Reactively update view when permissions change
    effect(() => {
      // Access permissions signal to track changes
      this.authService.permissions();
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    // Cleanup handled by Angular
  }

  private updateView(): void {
    if (!this.permission) {
      this.clearView();
      return;
    }

    const hasPermission = this.authService.hasPermission(this.permission);

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.clearView();
    }
  }

  private clearView(): void {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
