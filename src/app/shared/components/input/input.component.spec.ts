import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.id = 'test-input';
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render input element with correct id', () => {
      expect(inputElement).toBeTruthy();
      expect(inputElement.id).toBe('test-input');
    });

    it('should display label when provided', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.textContent).toContain('Test Label');
    });

    it('should not display label when not provided', () => {
      component.label = '';
      fixture.detectChanges();

      const labelElement = fixture.debugElement.query(By.css('label'));
      expect(labelElement).toBeFalsy();
    });

    it('should show required indicator when required is true', () => {
      component.label = 'Test Label';
      component.required = true;
      fixture.detectChanges();

      const requiredIndicator = fixture.debugElement.query(By.css('.text-danger-500'));
      expect(requiredIndicator).toBeTruthy();
    });

    it('should have correct type attribute', () => {
      component.type = 'email';
      component.ngOnInit();
      fixture.detectChanges();

      expect(inputElement.type).toBe('email');
    });

    it('should apply placeholder when provided', () => {
      component.placeholder = 'Enter text here';
      fixture.detectChanges();

      expect(inputElement.placeholder).toBe('Enter text here');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should handle null/undefined in writeValue', () => {
      component.writeValue(null);
      expect(component.value).toBe('');

      component.writeValue(undefined);
      expect(component.value).toBe('');
    });

    it('should call onChange when input value changes', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      const event = { target: { value: 'new value' } } as unknown as Event;
      component.onInput(event);

      expect(onChangeSpy).toHaveBeenCalledWith('new value');
      expect(component.value).toBe('new value');
    });

    it('should call onTouched when input loses focus', () => {
      const onTouchedSpy = jest.fn();
      component.registerOnTouched(onTouchedSpy);

      component.onBlur();

      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should update disabled state via setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);

      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });

    it('should reflect disabled state in DOM', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(inputElement.disabled).toBe(true);
    });
  });

  describe('password visibility', () => {
    beforeEach(() => {
      component.type = 'password';
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show password toggle button for password type', () => {
      const toggleButton = fixture.debugElement.query(By.css('button[type="button"]'));
      expect(toggleButton).toBeTruthy();
    });

    it('should toggle password visibility when button is clicked', () => {
      expect(component.showPassword).toBe(false);
      expect(component.currentType).toBe('password');

      component.togglePasswordVisibility();
      fixture.detectChanges();

      expect(component.showPassword).toBe(true);
      expect(component.currentType).toBe('text');
    });

    it('should toggle back to password type', () => {
      component.togglePasswordVisibility();
      fixture.detectChanges();

      expect(component.currentType).toBe('text');

      component.togglePasswordVisibility();
      fixture.detectChanges();

      expect(component.currentType).toBe('password');
    });

    it('should not show toggle button for non-password types', () => {
      component.type = 'text';
      component.ngOnInit();
      fixture.detectChanges();

      const toggleButton = fixture.debugElement.query(By.css('button[type="button"]'));
      expect(toggleButton).toBeFalsy();
    });
  });

  describe('error state', () => {
    it('should display error message when error is provided', () => {
      component.error = 'This field is required';
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.form-error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toBe('This field is required');
    });

    it('should not display error message when error is empty', () => {
      component.error = '';
      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(By.css('.form-error'));
      expect(errorElement).toBeFalsy();
    });

    it('should have aria-invalid attribute when error is present', () => {
      component.error = 'Error message';
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should have aria-invalid as false when no error', () => {
      component.error = '';
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-invalid')).toBe('false');
    });

    it('should link error message with aria-describedby', () => {
      component.id = 'username';
      component.error = 'Username is required';
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-describedby')).toBe('username-error');
    });

    it('should not have aria-describedby when no error', () => {
      component.id = 'username';
      component.error = '';
      fixture.detectChanges();

      expect(inputElement.getAttribute('aria-describedby')).toBeNull();
    });
  });

  describe('input types', () => {
    it('should support text type', () => {
      component.type = 'text';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.currentType).toBe('text');
    });

    it('should support email type', () => {
      component.type = 'email';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.currentType).toBe('email');
    });

    it('should support tel type', () => {
      component.type = 'tel';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.currentType).toBe('tel');
    });

    it('should support number type', () => {
      component.type = 'number';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.currentType).toBe('number');
    });

    it('should support date type', () => {
      component.type = 'date';
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.currentType).toBe('date');
    });
  });

  describe('integration with forms', () => {
    it('should work with form control', () => {
      const formControl = new FormControl('');
      
      component.registerOnChange((value: string) => formControl.setValue(value));
      
      const event = { target: { value: 'form value' } } as unknown as Event;
      component.onInput(event);

      expect(formControl.value).toBe('form value');
    });
  });

  describe('styling', () => {
    it('should have form-input class', () => {
      expect(inputElement.classList.contains('form-input')).toBe(true);
    });

    it('should have w-full on container', () => {
      const container = fixture.debugElement.query(By.css('.w-full'));
      expect(container).toBeTruthy();
    });

    it('should have relative positioning for password input wrapper', () => {
      component.type = 'password';
      component.ngOnInit();
      fixture.detectChanges();

      const wrapper = fixture.debugElement.query(By.css('.relative'));
      expect(wrapper).toBeTruthy();
    });
  });
});