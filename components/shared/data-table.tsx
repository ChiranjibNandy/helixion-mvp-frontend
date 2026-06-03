import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader className="bg-bgStatCard sticky top-0 z-10">
          <TableRow className="border-none hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-textSidebarMuted text-[10px] font-bold tracking-wider uppercase ${column.className ?? ""}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-48 text-center"
              >
                <p className="text-textSidebarMuted text-sm">
                  {emptyMessage}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-borderCard hover:bg-bgStatCard/60 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render(row, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}