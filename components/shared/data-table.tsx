'use client';

import { Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface Column<T> {
  key?: string;
  header: string;
  headerClassName?: string;
  className?: string;
  render: (row: T, index?: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data?: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  renderExpandedRow?: (row: T) => React.ReactNode;
  isRowExpanded?: (row: T) => boolean;
}

export function DataTable<T>({
  data = [],
  columns,
  className,
  emptyMessage = "No data available",
  loading,
  rowKey,
  onRowClick,
  rowClassName,
  renderExpandedRow,
  isRowExpanded,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-auto", className)}>
      <Table>
        <TableHeader className="bg-bgStatCard sticky top-0 z-10">
          <TableRow className="border-none hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key ?? col.header}
                className={cn("text-textSidebarMuted text-[10px] font-bold tracking-wider uppercase", col.headerClassName, col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12">
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-48 text-center">
                <p className="text-textSidebarMuted text-sm">{emptyMessage}</p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => {
              const key = rowKey ? rowKey(row) : String(i);
              const expanded = isRowExpanded ? isRowExpanded(row) : false;
              const clickable = !!onRowClick;
              return (
                <Fragment key={key}>
                  <TableRow
                    tabIndex={clickable ? 0 : undefined}
                    aria-expanded={clickable ? expanded : undefined}
                    className={cn(
                      "border-borderCard hover:bg-bgStatCard/60 transition-colors",
                      rowClassName ? rowClassName(row) : undefined
                    )}
                    onClick={clickable ? () => onRowClick(row) : undefined}
                    onKeyDown={clickable ? (e) => { if (e.key === 'Enter') onRowClick(row); } : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key ?? col.header} className={col.className}>
                        {col.render(row, i)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expanded && renderExpandedRow && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
