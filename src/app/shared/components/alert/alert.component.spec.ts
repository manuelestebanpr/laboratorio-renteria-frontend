import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should display message text', () => {
      component.message = 'This is an important message';
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.text-body p'));
      expect(messageElement.nativeElement.textContent).toContain('This is an important message');
    });

    it('should display title when provided', () => {
      component.title = 'Alert Title';
      component.message = 'Alert message';
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toContain('Alert Title');
    });

    it('should not display title section when not provided', () => {
      component.title = '';
      component.message = 'Just a message';
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement).toBeFalsy();
    });
  });

  describe('alert types', () => {
    it('should have info type by default', () => {
      expect(component.type).toBe('info');
    });

    it('should apply info type classes', () => {
      component.type = 'info';
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.className).toContain('bg-primary-50');
      expect(alertDiv.nativeElement.className).toContain('border-primary-200');
    });

    it('should apply success type classes', () => {
      component.type = 'success';
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.className).toContain('bg-success-50');
      expect(alertDiv.nativeElement.className).toContain('border-success-200');
    });

    it('should apply warning type classes', () => {
      component.type = 'warning';
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.className).toContain('bg-warning-50');
      expect(alertDiv.nativeElement.className).toContain('border-warning-200');
    });

    it('should apply error type classes', () => {
      component.type = 'error';
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.className).toContain('bg-danger-50');
      expect(alertDiv.nativeElement.className).toContain('border-danger-200');
    });
  });

  describe('icons', () => {
    it('should display info icon for info type', () => {
      component.type = 'info';
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.text-primary-700'));
      expect(icon).toBeTruthy();
    });

    it('should display success icon for success type', () => {
      component.type = 'success';
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.text-success-700'));
      expect(icon).toBeTruthy();
    });

    it('should display warning icon for warning type', () => {
      component.type = 'warning';
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.text-warning-700'));
      expect(icon).toBeTruthy();
    });

    it('should display error icon for error type', () => {
      component.type = 'error';
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.text-danger-700'));
      expect(icon).toBeTruthy();
    });
  });

  describe('dismissible', () => {
    it('should not show dismiss button by default', () => {
      const dismissButton = fixture.debugElement.query(By.css('button[aria-label="Cerrar alerta"]'));
      expect(dismissButton).toBeFalsy();
    });

    it('should show dismiss button when dismissible is true', () => {
      component.dismissible = true;
      fixture.detectChanges();

      const dismissButton = fixture.debugElement.query(By.css('button[aria-label="Cerrar alerta"]'));
      expect(dismissButton).toBeTruthy();
    });

    it('should emit dismissed event when dismiss button is clicked', () => {
      component.dismissible = true;
      fixture.detectChanges();

      jest.spyOn(component.dismissed, 'emit');

      const dismissButton = fixture.debugElement.query(By.css('button'));
      dismissButton.nativeElement.click();

      expect(component.dismissed.emit).toHaveBeenCalled();
    });

    it('should call dismiss method when button is clicked', () => {
      component.dismissible = true;
      fixture.detectChanges();

      jest.spyOn(component, 'dismiss');

      const dismissButton = fixture.debugElement.query(By.css('button'));
      dismissButton.nativeElement.click();

      expect(component.dismiss).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have role alert', () => {
      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv).toBeTruthy();
    });

    it('should have aria-live polite for non-error types', () => {
      component.type = 'info';
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.getAttribute('aria-live')).toBe('polite');
    });

    it('should have aria-live assertive for error type', () => {
      component.type = 'error';
      fixture.detectChanges();

      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.getAttribute('aria-live')).toBe('assertive');
    });

    it('should have aria-label for dismiss button', () => {
      component.dismissible = true;
      fixture.detectChanges();

      const dismissButton = fixture.debugElement.query(By.css('button'));
      expect(dismissButton.nativeElement.getAttribute('aria-label')).toBe('Cerrar alerta');
    });

    it('should have screen reader only text for dismiss button', () => {
      component.dismissible = true;
      fixture.detectChanges();

      const srOnlyText = fixture.debugElement.query(By.css('.sr-only'));
      expect(srOnlyText.nativeElement.textContent).toBe('Cerrar');
    });
  });

  describe('styling classes', () => {
    it('should have rounded corners', () => {
      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.className).toContain('rounded-lg');
    });

    it('should have padding', () => {
      const alertDiv = fixture.debugElement.query(By.css('[role="alert"]'));
      expect(alertDiv.nativeElement.className).toContain('p-4');
    });

    it('should have flex layout', () => {
      const flexContainer = fixture.debugElement.query(By.css('.flex.items-start'));
      expect(flexContainer).toBeTruthy();
    });
  });

  describe('computed classes', () => {
    it('should compute alertClasses correctly', () => {
      component.type = 'success';
      const classes = component.alertClasses;

      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('p-4');
      expect(classes).toContain('bg-success-50');
    });

    it('should compute titleClasses correctly', () => {
      component.type = 'warning';
      const classes = component.titleClasses;

      expect(classes).toContain('text-heading-sm');
      expect(classes).toContain('text-warning-800');
    });

    it('should compute messageClasses correctly', () => {
      component.type = 'error';
      const classes = component.messageClasses;

      expect(classes).toContain('text-body');
      expect(classes).toContain('text-danger-700');
    });

    it('should compute dismissButtonClasses correctly', () => {
      component.type = 'info';
      const classes = component.dismissButtonClasses;

      expect(classes).toContain('text-primary-500');
      expect(classes).toContain('hover:bg-primary-100');
    });
  });
});