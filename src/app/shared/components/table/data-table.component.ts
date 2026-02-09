import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, Directive, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Directive({
  selector: '[appTableCell]',
  standalone: true,
})
export class TableCellDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableCellDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-auto rounded-card border border-neutral-200">
      <table class="w-full text-left">
        <thead class="bg-neutral-100">
          <tr>
            @for (column of columns; track column.key) {
              <th
                [style.width]="column.width"
                class="px-6 py-4 text-body font-semibold text-neutral-700 uppercase tracking-wider"
                [class.cursor-pointer]="column.sortable"
                [class.hover:bg-neutral-200]="column.sortable"
                (click)="column.sortable && onSort(column.key)"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ column.header }}</span>
                  @if (column.sortable) {
                    <span class="text-neutral-400">
                      @if (sortColumn === column.key) {
                        @if (sortDirection === 'asc') {
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        } @else {
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        }
                      } @else {
                        <svg class="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                      }
                    </span>
                  }
                </div>
              </th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-200 bg-white">
          @if (loading) {
            @for (_ of [1, 2, 3]; track $index) {
              <tr>
                @for (column of columns; track column.key) {
                  <td class="px-6 py-4">
                    <div class="animate-pulse bg-neutral-200 h-4 rounded w-3/4" />
                  </td>
                }
              </tr>
            }
          } @else if (data.length === 0) {
            <tr>
              <td [attr.colspan]="columns.length" class="px-6 py-12 text-center">
                <p class="text-body text-neutral-500">{{ emptyMessage }}</p>
              </td>
            </tr>
          } @else {
            @for (row of data; track trackByFn($index, row)) {
              <tr
                class="hover:bg-neutral-50 transition-colors"
                [class.cursor-pointer]="rowClick.observed"
                (click)="onRowClick(row)"
              >
                @for (column of columns; track column.key) {
                  <td class="px-6 py-4 text-body text-neutral-800">
                    @if (getCellTemplate(column.key)) {
                      <ng-container
                        *ngTemplateOutlet="getCellTemplate(column.key)!; context: { $implicit: row }"
                      />
                    } @else {
                      {{ getCellValue(row, column.key) }}
                    }
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DataTableComponent<T extends Record<string, unknown>> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No hay datos disponibles';
  @Input() sortColumn = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() trackByKey = 'id';

  @Output() sort = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() rowClick = new EventEmitter<T>();

  @ContentChildren(TableCellDirective, { read: TemplateRef }) customCells!: QueryList<TemplateRef<unknown>>;

  onSort(columnKey: string): void {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (this.sortColumn === columnKey) {
      newDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sort.emit({ column: columnKey, direction: newDirection });
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  getCellValue(row: T, key: string): unknown {
    return row[key];
  }

  getCellTemplate(key: string): TemplateRef<unknown> | null {
    // This is a simplified implementation
    // In a real app, you'd use a custom directive to match columns with templates
    return null;
  }

  trackByFn(index: number, item: T): unknown {
    return item[this.trackByKey] ?? index;
  }
}
