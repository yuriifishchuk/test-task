import { NzTableSortOrder } from 'ng-zorro-antd/table';

export interface QueryParams {
  sort: {
    key: string | null,
    value: NzTableSortOrder;
  },
  filters: {
    key: string | null,
    value: string[] | null;
  }[]
}
