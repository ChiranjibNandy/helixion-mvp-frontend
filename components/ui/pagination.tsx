import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon
      />
      <span className="sr-only">More pages</span>
    </span>
  )
}


interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SIBLING_COUNT = 1;
const BUFFER_SLOTS = 2; // space for the first and last page numbers
const ELLIPSIS_SLOTS = 2; // "..." on each side when truncated
const CURRENT_PAGE_SLOT = 1; // the active page itself

type PageEntry = number | 'ellipsis-start' | 'ellipsis-end';

function getPageEntries(page: number, totalPages: number): PageEntry[] {
  const FIRST_PAGE = 1;
  const LAST_PAGE = totalPages;
  const totalNumberSlots = SIBLING_COUNT * 2 + BUFFER_SLOTS + ELLIPSIS_SLOTS + CURRENT_PAGE_SLOT;
  if (totalPages <= totalNumberSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - SIBLING_COUNT, FIRST_PAGE);
  const rightSibling = Math.min(page + SIBLING_COUNT, LAST_PAGE);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const entries: PageEntry[] = [FIRST_PAGE];

  if (showLeftEllipsis) {
    entries.push('ellipsis-start');
  } else if (leftSibling > 1) {
    entries.push(2);
  }

  for (let p = leftSibling === 1 ? 2 : leftSibling; p <= (rightSibling === totalPages ? totalPages - 1 : rightSibling); p++) {
    if (p > 1 && p < totalPages) entries.push(p);
  }

  if (showRightEllipsis) {
    entries.push('ellipsis-end');
  } else if (rightSibling < totalPages) {
    entries.push(totalPages - 1);
  }

  entries.push(LAST_PAGE);

  return entries.filter((entry, i) => entries[i - 1] !== entry);
}

function usePagination(page: number, totalPages: number): PageEntry[] {
  return React.useMemo(() => getPageEntries(page, totalPages), [page, totalPages]);
}

export default function PaginationController({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>

        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Pages */}
        {usePagination(page, totalPages).map((entry, i) =>
          typeof entry === 'number' ? (
            <PaginationItem key={entry}>
              <PaginationLink
                isActive={entry === page}
                onClick={() => onPageChange(entry)}
              >
                {entry}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={`${entry}-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}

