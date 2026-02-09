import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          (click)="previousPage()"
          [disabled]="currentPage === 0"
          class="relative inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          (click)="nextPage()"
          [disabled]="currentPage >= totalPages - 1"
          class="relative ml-3 inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-body font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-body text-neutral-700">
            Mostrando
            <span class="font-medium">{{ startItem }}</span>
            a
            <span class="font-medium">{{ endItem }}</span>
            de
            <span class="font-medium">{{ totalElements }}</span>
            resultados
          </p>
        </div>

        <div>
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <!-- Previous button -->
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 0"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              [attr.aria-label]="'Página anterior'"
            >
              <span class="sr-only">Anterior</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Page numbers -->
            @for (page of visiblePages; track page) {
              @if (page === -1) {
                <span
                  class="relative inline-flex items-center px-4 py-2 text-body font-semibold text-neutral-700 ring-1 ring-inset ring-neutral-300 focus:outline-offset-0"
                >
                  ...
                </span>
              } @else {
                <button
                  (click)="goToPage(page)"
                  [attr.aria-current]="page === currentPage ? 'page' : null"
                  [class]="pageButtonClasses(page)"
                >
                  {{ page + 1 }}
                </button>
              }
            }

            <!-- Next button -->
            <button
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages - 1"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-400 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              [attr.aria-label]="'Página siguiente'"
            >
              <span class="sr-only">Siguiente</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() totalElements = 0;
  @Input() pageSize = 10;
  @Input() maxVisiblePages = 5;

  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    return this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    const end = (this.currentPage + 1) * this.pageSize;
    return Math.min(end, this.totalElements);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const halfVisible = Math.floor(this.maxVisiblePages / 2);

    let startPage = Math.max(0, this.currentPage - halfVisible);
    const endPage = Math.min(this.totalPages - 1, startPage + this.maxVisiblePages - 1);

    if (endPage - startPage + 1 < this.maxVisiblePages) {
      startPage = Math.max(0, endPage - this.maxVisiblePages + 1);
    }

    // First page
    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) {
        pages.push(-1); // Ellipsis
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Last page
    if (endPage < this.totalPages - 1) {
      if (endPage < this.totalPages - 2) {
        pages.push(-1); // Ellipsis
      }
      pages.push(this.totalPages - 1);
    }

    return pages;
  }

  pageButtonClasses(page: number): string {
    const baseClasses =
      'relative inline-flex items-center px-4 py-2 text-body font-semibold ring-1 ring-inset ring-neutral-300 focus:z-20 focus:outline-offset-0';

    if (page === this.currentPage) {
      return `${baseClasses} z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600`;
    }

    return `${baseClasses} text-neutral-900 hover:bg-neutral-50`;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number): void {
    this.pageChange.emit(page);
  }
}
