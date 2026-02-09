import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should display the label text', () => {
      component.label = 'Click Me';
      fixture.detectChanges();

      expect(buttonElement.textContent?.trim()).toContain('Click Me');
    });

    it('should have default type as button', () => {
      expect(component.type).toBe('button');
      expect(buttonElement.type).toBe('button');
    });

    it('should apply submit type when specified', () => {
      component.type = 'submit';
      fixture.detectChanges();

      expect(buttonElement.type).toBe('submit');
    });

    it('should apply reset type when specified', () => {
      component.type = 'reset';
      fixture.detectChanges();

      expect(buttonElement.type).toBe('reset');
    });
  });

  describe('variants', () => {
    it('should have primary variant by default', () => {
      expect(component.variant).toBe('primary');
    });

    it('should apply secondary variant classes', () => {
      component.variant = 'secondary';
      fixture.detectChanges();

      expect(buttonElement.className).toContain('bg-white');
      expect(buttonElement.className).toContain('text-primary-700');
    });

    it('should apply danger variant classes', () => {
      component.variant = 'danger';
      fixture.detectChanges();

      expect(buttonElement.className).toContain('bg-danger-500');
    });
  });

  describe('sizes', () => {
    it('should have md size by default', () => {
      expect(component.size).toBe('md');
    });

    it('should apply sm size classes', () => {
      component.size = 'sm';
      fixture.detectChanges();

      expect(buttonElement.className).toContain('text-sm');
      expect(buttonElement.className).toContain('px-4');
    });

    it('should apply lg size classes', () => {
      component.size = 'lg';
      fixture.detectChanges();

      expect(buttonElement.className).toContain('text-body-lg');
      expect(buttonElement.className).toContain('px-8');
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('svg.animate-spin'));
      expect(spinner).toBeTruthy();
    });

    it('should not show loading spinner when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('svg.animate-spin'));
      expect(spinner).toBeFalsy();
    });

    it('should disable button when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.getAttribute('aria-busy')).toBe('true');
    });

    it('should have aria-busy attribute set correctly', () => {
      component.loading = false;
      fixture.detectChanges();
      expect(buttonElement.getAttribute('aria-busy')).toBe('false');

      component.loading = true;
      fixture.detectChanges();
      expect(buttonElement.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('disabled state', () => {
    it('should disable button when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(buttonElement.disabled).toBe(true);
    });

    it('should enable button when disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      expect(buttonElement.disabled).toBe(false);
    });

    it('should apply disabled classes when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(buttonElement.className).toContain('disabled:opacity-50');
    });
  });

  describe('icon', () => {
    it('should display icon when provided and not loading', () => {
      component.icon = '🔒';
      component.loading = false;
      fixture.detectChanges();

      expect(buttonElement.textContent?.trim()).toContain('🔒');
    });

    it('should not display icon when loading', () => {
      component.icon = '🔒';
      component.loading = true;
      fixture.detectChanges();

      const iconSpan = fixture.debugElement.query(By.css('span.mr-2'));
      expect(iconSpan).toBeFalsy();
    });
  });

  describe('aria-label', () => {
    it('should have aria-label when provided', () => {
      component.ariaLabel = 'Close dialog';
      fixture.detectChanges();

      expect(buttonElement.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('should not have aria-label when not provided', () => {
      component.ariaLabel = '';
      fixture.detectChanges();

      expect(buttonElement.getAttribute('aria-label')).toBe('');
    });
  });

  describe('click events', () => {
    it('should emit clicked event when clicked', () => {
      jest.spyOn(component.clicked, 'emit');

      buttonElement.click();

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      jest.spyOn(component.clicked, 'emit');

      buttonElement.click();

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      jest.spyOn(component.clicked, 'emit');

      buttonElement.click();

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should call onClick method when clicked', () => {
      jest.spyOn(component, 'onClick');

      buttonElement.click();

      expect(component.onClick).toHaveBeenCalled();
    });
  });

  describe('button classes', () => {
    it('should generate correct button class string', () => {
      component.variant = 'primary';
      component.size = 'md';
      
      const classes = component.buttonClass;
      
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('justify-center');
      expect(classes).toContain('rounded-btn');
      expect(classes).toContain('bg-primary-500');
    });

    it('should include focus ring classes', () => {
      const classes = component.buttonClass;
      
      expect(classes).toContain('focus-visible:ring-focus');
      expect(classes).toContain('focus-visible:ring-primary-500');
    });
  });
});