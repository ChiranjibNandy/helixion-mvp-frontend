import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Screen-reader label for the nav landmark. Defaults to "Pagination". */
  "aria-label"?: string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * Builds a visible page list with at-most two ellipsis slots.
 * Keeps: first page, last page, current ± 1.
 * This is pure logic — no side-effects, easy to unit-test.
 */
function buildPageItems(page: number, totalPages: number): PageItem[] {
  const items: PageItem[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      items.push(i);
    } else if (items.at(-1) !== "ellipsis-start" && i < page) {
      items.push("ellipsis-start");
    } else if (items.at(-1) !== "ellipsis-end" && i > page) {
      items.push("ellipsis-end");
    }
  }

  return items;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  "aria-label": ariaLabel = "Pagination",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(page, totalPages);

  return (
    <nav aria-label={ariaLabel}>
      <ul className="flex items-center gap-1 list-none m-0 p-0">
        <li>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Go to previous page"
          >
            Previous
          </Button>
        </li>

        {items.map((item) => {
          if (item === "ellipsis-start" || item === "ellipsis-end") {
            return (
              <li key={item} aria-hidden="true">
                <span className="px-2 text-gray-400 select-none">…</span>
              </li>
            );
          }

          const isActive = item === page;
          return (
            <li key={item}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(item)}
                aria-label={`Go to page ${item}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "min-w-[36px]",
                  // Keeps inactive pages visually subtle without a full variant change
                  !isActive && "text-gray-600"
                )}
              >
                {item}
              </Button>
            </li>
          );
        })}

        <li>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label="Go to next page"
          >
            Next
          </Button>
        </li>
      </ul>
    </nav>
  );
}
