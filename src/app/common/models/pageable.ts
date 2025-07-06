export interface Pageable {
  page: number;             // current page number
  size: number;             // page size
  query?: string;           // search query
  sort?: Sort;              // sorting info
  filters?: Filter[];       // array of filters
}

export interface Sort {
  field: string;            // field to sort by
  direction: 'ascend' | 'descend' | string; // sorting direction, empty string for no sorting
}

export interface Filter {
  field: string | null;     // field to filter on
  value: string[] | null;   // value to compare
}

export type PageableResult<T> = {
  content: T[];
  completed: boolean;
}
