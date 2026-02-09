import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CardComponent } from './card.component';
import { CommonModule } from '@angular/common';

// Test host component for content projection
@Component({
  template: `
    <app-card
      [title]="title"
      [subtitle]="subtitle"
      [hover]="hover"
      [noPadding]="noPadding">
      <ng-template #header *ngIf="customHeader">
        <div class="custom-header">Custom Header Content</div>
      </ng-template>
      <p class="card-content">Main content goes here</p>
      <ng-template #footer *ngIf="customFooter">
        <div class="custom-footer">Custom Footer Content</div>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  imports: [CardComponent, CommonModule],
})
class TestHostComponent {
  @ViewChild('header', { static: false }) headerTemplate?: TemplateRef<unknown>;
  @ViewChild('footer', { static: false }) footerTemplate?: TemplateRef<unknown>;
  
  title = '';
  subtitle = '';
  hover = false;
  noPadding = false;
  customHeader = false;
  customFooter = false;
}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('basic rendering', () => {
    it('should render card container', () => {
      const cardDiv = fixture.debugElement.query(By.css('.bg-white'));
      expect(cardDiv).toBeTruthy();
    });

    it('should have correct base classes', () => {
      const cardDiv = fixture.debugElement.query(By.css('.bg-white'));
      expect(cardDiv.nativeElement.className).toContain('rounded-card');
      expect(cardDiv.nativeElement.className).toContain('shadow-sm');
      expect(cardDiv.nativeElement.className).toContain('border');
      expect(cardDiv.nativeElement.className).toContain('border-neutral-200');
    });
  });

  describe('title and subtitle', () => {
    it('should not display header when title and headerTemplate are empty', () => {
      component.title = '';
      component.headerTemplate = undefined;
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.border-b'));
      expect(header).toBeFalsy();
    });

    it('should display title in header when provided', () => {
      component.title = 'Card Title';
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toContain('Card Title');
    });

    it('should display subtitle when provided', () => {
      component.title = 'Card Title';
      component.subtitle = 'Card Subtitle';
      fixture.detectChanges();

      const subtitleElement = fixture.debugElement.query(By.css('p.text-neutral-500'));
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement.nativeElement.textContent).toContain('Card Subtitle');
    });

    it('should have correct title styling', () => {
      component.title = 'Styled Title';
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h3'));
      expect(titleElement.nativeElement.className).toContain('text-heading');
      expect(titleElement.nativeElement.className).toContain('font-semibold');
      expect(titleElement.nativeElement.className).toContain('text-neutral-900');
    });

    it('should have correct header background', () => {
      component.title = 'Title';
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.border-b'));
      expect(header.nativeElement.className).toContain('bg-neutral-50');
    });
  });

  describe('content projection', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should project content into card body', () => {
      const content = hostFixture.debugElement.query(By.css('.card-content'));
      expect(content).toBeTruthy();
      expect(content.nativeElement.textContent).toContain('Main content goes here');
    });

    it('should have padding by default', () => {
      hostComponent.noPadding = false;
      hostFixture.detectChanges();

      const contentDiv = hostFixture.debugElement.query(By.css('.p-6'));
      expect(contentDiv).toBeTruthy();
    });

    it('should have no padding when noPadding is true', () => {
      hostComponent.noPadding = true;
      hostFixture.detectChanges();

      const contentDiv = hostFixture.debugElement.query(By.css('.p-0'));
      expect(contentDiv).toBeTruthy();
    });
  });

  describe('custom header template', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should render custom header when headerTemplate is provided', () => {
      hostComponent.customHeader = true;
      hostFixture.detectChanges();

      const customHeader = hostFixture.debugElement.query(By.css('.custom-header'));
      expect(customHeader).toBeTruthy();
      expect(customHeader.nativeElement.textContent).toContain('Custom Header Content');
    });

    it('should prefer custom header over title prop', () => {
      hostComponent.customHeader = true;
      hostComponent.title = 'This should not show';
      hostFixture.detectChanges();

      const customHeader = hostFixture.debugElement.query(By.css('.custom-header'));
      const titleElement = hostFixture.debugElement.query(By.css('h3'));

      expect(customHeader).toBeTruthy();
      expect(titleElement).toBeFalsy();
    });
  });

  describe('custom footer template', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should not render footer when footerTemplate is not provided', () => {
      hostComponent.customFooter = false;
      hostFixture.detectChanges();

      const footer = hostFixture.debugElement.query(By.css('.border-t'));
      expect(footer).toBeFalsy();
    });

    it('should render custom footer when footerTemplate is provided', () => {
      hostComponent.customFooter = true;
      hostFixture.detectChanges();

      const customFooter = hostFixture.debugElement.query(By.css('.custom-footer'));
      expect(customFooter).toBeTruthy();
      expect(customFooter.nativeElement.textContent).toContain('Custom Footer Content');
    });

    it('should have correct footer styling', () => {
      hostComponent.customFooter = true;
      hostFixture.detectChanges();

      const footer = hostFixture.debugElement.query(By.css('.border-t'));
      expect(footer.nativeElement.className).toContain('bg-neutral-50');
      expect(footer.nativeElement.className).toContain('border-neutral-200');
    });
  });

  describe('hover effect', () => {
    it('should not have hover class by default', () => {
      component.hover = false;
      fixture.detectChanges();

      const cardDiv = fixture.debugElement.query(By.css('.bg-white'));
      expect(cardDiv.nativeElement.className).not.toContain('hover:shadow-md');
    });

    it('should have hover class when hover is true', () => {
      component.hover = true;
      fixture.detectChanges();

      const cardDiv = fixture.debugElement.query(By.css('.bg-white'));
      expect(cardDiv.nativeElement.className).toContain('hover:shadow-md');
    });
  });

  describe('overflow handling', () => {
    it('should have overflow-hidden class', () => {
      const cardDiv = fixture.debugElement.query(By.css('.bg-white'));
      expect(cardDiv.nativeElement.className).toContain('overflow-hidden');
    });
  });

  describe('inputs', () => {
    it('should have default empty title', () => {
      expect(component.title).toBe('');
    });

    it('should have default empty subtitle', () => {
      expect(component.subtitle).toBe('');
    });

    it('should have default hover as false', () => {
      expect(component.hover).toBe(false);
    });

    it('should have default noPadding as false', () => {
      expect(component.noPadding).toBe(false);
    });
  });

  describe('template outlet usage', () => {
    it('should support header template content child', () => {
      expect(component.headerTemplate).toBeUndefined();
    });

    it('should support footer template content child', () => {
      expect(component.footerTemplate).toBeUndefined();
    });
  });
});