import React, { useState, useEffect } from "react";
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

export default function ProductsPage({ initialProducts, initialTotal }) {
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
  });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const fetchProducts = async (pageNum = page, pageSizeNum = pageSize) => {
    setLoading(true);
    try {
      const res = await axios.get("/products/list", {
        params: { page: pageNum, pageSize: pageSizeNum },
      });
      setProducts(res.data.list);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, pageSize);
  }, [page, pageSize]);

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleOpenDelete = (id) =>
    setDeleteDialog({ open: true, productId: id });
  const handleCloseDelete = () =>
    setDeleteDialog({ open: false, productId: null });

  const handleDelete = async () => {
    if (!deleteDialog.productId) return;
    setLoading(true);
    try {
      await axios.delete(`/products/${deleteDialog.productId}`);
      showToast("Product deleted successfully");
      await fetchProducts(page, pageSize);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product", "error");
    } finally {
      setLoading(false);
      handleCloseDelete();
    }
  };

  const columns = [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "unitCost",
      header: "Unit Cost",
      cell: ({ row }) => `$${row.original.unitCost.toFixed(2)}`,
    },
    { accessorKey: "reorderPoint", header: "Reorder Point" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton
            color="primary"
            component={Link}
            href={`/products/edit/${row.original.id}`}
            size="small"
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Products
        </Typography>
        <Button variant="contained" component={Link} href="/products/add">
          Add Product
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRows={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <Dialog open={deleteDialog.open} onClose={handleCloseDelete}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} onClose={handleCloseToast}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get("/products/list", {
      params: { page: 1, pageSize: 10 },
    });
    const data = await res.data;

    return {
      props: {
        initialProducts: data.list || [],
        initialTotal: data.total || 0,
      },
    };
  } catch (err) {
    console.error("SSR fetch products failed:", err);
    return {
      props: {
        initialProducts: [],
        initialTotal: 0,
      },
    };
  }
}
