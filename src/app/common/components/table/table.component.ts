import { Component, input, output } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { TableColumn } from '@models/tableColumn';
import { DatePipe } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { InfiniteScrollDirective } from '@directives/infinite-scroll.directive';
import { SearchDirective } from '@directives/search.directive';
import { HighlightPipe } from '@pipes/highlight.pipe';
import { QueryParams } from '@models/queryParams';

@Component({
  selector   : 'app-table',
  imports    : [NzTableModule, NzInputModule, NzIconModule, InfiniteScrollDirective, SearchDirective, HighlightPipe, DatePipe],
  templateUrl: './table.component.html',
  styleUrl   : './table.component.scss'
})
export class TableComponent {
  tableColumns = input.required<TableColumn[]>();
  tableData = input.required<Record<string, any>[]>();

  queryParamsChange = output<QueryParams>();
  loadMore = output();
  search = output<string>();

  /**
   * Handles the query parameters change event from the table.
   * @param params
   */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const {sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const currentFilters = filter.filter(f => f.value !== null);

    this.queryParamsChange.emit({
      sort: {
        key: currentSort?.key || null,
        value: currentSort?.value || null
      },
      filters: currentFilters
    });
  }
}
