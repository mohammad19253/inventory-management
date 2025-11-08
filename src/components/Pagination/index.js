import {
  Stack,
  TablePagination,
  Pagination as MuiPagination,
} from "@mui/material";

export const Pagination = ({
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 200],
}) => {
  const totalPages = Math.ceil(totalRows / pageSize);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mt: 2, px: 2 }}
    >
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => onPageChange(newPage)}
        color="primary"
      />
      <TablePagination
        component="div"
        count={totalRows}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(Number(e.target.value))}
        rowsPerPageOptions={pageSizeOptions}
        labelRowsPerPage=""
        sx={{ minWidth: 120 }}
        slotProps={{
          select: {
            MenuProps: {
              disableScrollLock: true,
            },
          },
        }}
      />
    </Stack>
  );
};
