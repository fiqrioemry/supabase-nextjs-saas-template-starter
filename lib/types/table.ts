export type TableColumnType =
  | "text"
  | "date"
  | "currency"
  | "status"
  | "custom";

export interface TableColumnConfig {
  key: string;
  label: string;
  type: TableColumnType;
  className?: string;
  render?: (row: any) => React.ReactNode;
}
