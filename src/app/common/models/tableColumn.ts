export interface TableColumn {
  type: TableColumnType;
  field: string;
  title: string;
  sortable: boolean; // Indicates if the column can be sorted
  filterValues: { text: string, value: string }[]; // Array of filter values with title and value
}

type TableColumnType = 'text' | 'boolean' | 'date';
