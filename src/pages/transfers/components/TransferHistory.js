import DataTable from "@/components/DataTable";
import { format } from "date-fns";
export default function TransferHistory({
  transfers,
  loading,
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
}) {
  // Define columns for react-table
  const columns = [
    { accessorKey: "index", header: "No" },
    {
      accessorFn: (row) => row.product?.name,
      id: "product",
      header: "Product",
    },
    {
      accessorFn: (row) => row.fromWarehouse?.name,
      id: "fromWarehouse",
      header: "From Warehouse",
    },
    {
      accessorFn: (row) => row.toWarehouse?.name,
      id: "toWarehouse",
      header: "To Warehouse",
    },
    { accessorKey: "quantity", header: "Quantity" },
    {
      accessorFn: (row) => format(new Date(row.date), "yyyy/MM/dd HH:mm:ss"),
      id: "date",
      header: "Date",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={transfers}
      loading={loading}
      page={page}
      pageSize={pageSize}
      totalRows={totalRows}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
