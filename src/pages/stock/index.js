import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { DataTable } from "@/shared";
import axios from "@/services/axios";

export default function StockPage({ initialStock, products, warehouses }) {
  const [stock, setStock] = useState(initialStock.list);
  const [total, setTotal] = useState(initialStock.total);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);

  const fetchStock = async (pageNum = page, pageSizeNum = pageSize) => {
    setLoading(true);
    try {
      const res = await axios.get("/stock", {
        params: { page: pageNum, pageSize: pageSizeNum },
      });
      setStock(res.data.list);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  useEffect(() => {
    fetchStock(page, pageSize);
  }, [page, pageSize]);

  const handleOpenDelete = (id) => {
    setSelectedStockId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedStockId(null);
  };

  const handleDelete = async () => {
    if (!selectedStockId) return;
    setLoading(true);
    try {
      await axios.delete(`/stock/${selectedStockId}`);
      await fetchStock(page, pageSize);
      setSuccessToast(true);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
      handleCloseDelete();
    }
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  };

  const columns = [
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
        <Box>
          <IconButton
            component={Link}
            href={`/stock/edit/${row.original.id}`}
            size="small"
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleOpenDelete(row.original.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Stock Levels
        </Typography>
        <Button variant="contained" component={Link} href="/stock/add">
          Add Stock Record
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={stock}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRows={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete Stock Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock record? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success toast */}
      <Snackbar
        open={successToast}
        autoHideDuration={2500}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessToast(false)}>
          Stock record deleted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export async function getServerSideProps() {
  try {
    const [stockRes, productsRes, warehousesRes] = await Promise.all([
      axios.get(`/stock`, { params: { page: 1, pageSize: 10 } }),
      axios.get(`/products`),
      axios.get(`/warehouses`),
    ]);

    return {
      props: {
        initialStock: stockRes.data,
        products: productsRes.data,
        warehouses: warehousesRes.data,
      },
    };
  } catch (error) {
    console.error("SSR Fetch Error:", error);
    return {
      props: {
        initialStock: { list: [], total: 0 },
        products: [],
        warehouses: [],
      },
    };
  }
}
