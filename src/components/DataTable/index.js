import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  useTheme,
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Pagination } from "../Pagination";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  showPagination = true,
  tableProps,
}) {
  const theme = useTheme();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Paper>
      <TableContainer>
        <MuiTable {...tableProps}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                sx={{ backgroundColor: theme.palette.primary.main }}
              >
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    align="center"
                    sx={{
                      color: theme.palette.primary.contrastText,
                      fontWeight: "bold",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? theme.palette.action.hover : "inherit",
                    }}
                  >
                    {columns.map((col, i) => (
                      <TableCell
                        key={i}
                        align="center"
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                      >
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? theme.palette.action.hover : "inherit",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        align="center"
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {showPagination && (
        <Pagination
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Paper>
  );
}
