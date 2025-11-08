import { useState } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable from "@/components/DataTable";
import { appConfig } from "@/config/app";

export default function Stock({
  initialStock,
  products,
  warehouses,
  initialPage,
  initialPageSize,
}) {
  const [stock, setStock] = useState(initialStock.list);
  const [totalRows, setTotalRows] = useState(initialStock.total);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);

  const handleClickOpen = (id) => {
    setSelectedStockId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const fetchPage = async (newPage, newPageSize = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stock?page=${newPage}&pageSize=${newPageSize}`
      );
      const data = await res.json();
      setStock(data.list);
      setTotalRows(data.total);
      setPage(newPage);
      setPageSize(newPageSize);
    } catch (e) {
      console.error("Failed to fetch stock page:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStockId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stock/${selectedStockId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete stock");

      // Fetch updated page after deletion
      await fetchPage(page, pageSize);
      handleClose();
    } catch (error) {
      console.error("Error deleting stock:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  };

  // Columns for react-table
  const columns = [
    { accessorKey: "index", header: "#" },
    {
      accessorFn: (row) => getProductName(row.productId),
      id: "product",
      header: "Product",
    },
    {
      accessorFn: (row) => getWarehouseName(row.warehouseId),
      id: "warehouse",
      header: "Warehouse",
    },
    { accessorKey: "quantity", header: "Quantity" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <IconButton
            color="primary"
            component={Link}
            href={`/stock/edit/${row.original.id}`}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleClickOpen(row.original.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Stock Levels</Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/stock/add"
        >
          Add Stock Record
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={stock}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRows={totalRows}
        onPageChange={fetchPage}
        onPageSizeChange={(newSize) => fetchPage(1, newSize)}
      />

      {/* Delete Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Stock Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock record? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// SSR
export async function getServerSideProps(context) {
  const page = parseInt(context.query.page || "1");
  const pageSize = parseInt(context.query.pageSize || "10");
  const baseUrl = appConfig.baseUrl;

  const [stockRes, productsRes, warehousesRes] = await Promise.all([
    fetch(`${baseUrl}/api/stock?page=${page}&pageSize=${pageSize}`),
    fetch(`${baseUrl}/api/products`),
    fetch(`${baseUrl}/api/warehouses`),
  ]);

  const stockData = await stockRes.json();
  const products = await productsRes.json();
  const warehouses = await warehousesRes.json();

  return {
    props: {
      initialStock: stockData,
      products,
      warehouses,
      initialPage: page,
      initialPageSize: pageSize,
    },
  };
}
