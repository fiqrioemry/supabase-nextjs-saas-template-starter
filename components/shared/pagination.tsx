import { Button } from "@/components/ui/button";
import type { PaginationProps } from "@/lib/types/global";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export const Pagination = ({
  page,
  limit,
  total,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);

  if (totalPages === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(start + limit - 1, total);

  // generate pages to show (max 5 visible)
  const generatePages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 py-2 text-sm gap-3 w-full">
      {/* Info Section */}
      <div className="text-muted-foreground space-x-2">
        <span>Showing</span>
        <span className="font-medium text-primary">
          {start}-{end}
        </span>
        <span>of</span>
        <span className="font-medium text-primary">{total}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <Button
          size="icon"
          variant="outline"
          disabled={page === 1}
          className="disabled:opacity-50"
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Prev */}
        <Button
          size="icon"
          variant="outline"
          disabled={page === 1}
          className="disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page Numbers */}
        {generatePages().map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              size="sm"
              className="w-9 h-9"
              onClick={() => onPageChange(Number(p))}
            >
              {p}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          size="icon"
          variant="outline"
          disabled={page >= totalPages}
          className="disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last Page */}
        <Button
          size="icon"
          variant="outline"
          disabled={page >= totalPages}
          className="disabled:opacity-50"
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
