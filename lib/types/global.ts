export interface BaseQuery {
  q: string;
  page: number;
  limit: number;
  sort?: string;
}

export interface Success {
  success: boolean;
  message: string;
  data: any;
  meta?: any;
}

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export type Theme =
  | "light"
  | "dark"
  | "system"
  | "bubblegum"
  | "claude"
  | "supabase";
