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
import DeleteIcon from "@mui/icons-material/Delete"; // ✅ NEW
import { DataTable } from "@/components/shared";
import axios from "@/services/axios";
import Link from "next/link";
import { format } from "date-fns";

export default function OrdersPage({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders.list);
  const [total, setTotal] = useState(initialOrders.total);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ NEW: for delete dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async (pageNum = page, pageSizeNum = pageSize) => {
    setLoading(true);
    try {
      const res = await axios.get("/orders", {
        params: { page: pageNum, pageSize: pageSizeNum },
      });
      setOrders(res.data.list);
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
    fetchOrders(page, pageSize);
  }, [page, pageSize]);

  // ✅ NEW: open/close delete dialog
  const handleOpenDelete = (id) => {
    setSelectedOrderId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedOrderId(null);
  };

  // ✅ NEW: delete request logic
  const handleDelete = async () => {
    if (!selectedOrderId) return;
    setLoading(true);
    try {
      await axios.delete(`/orders/${selectedOrderId}`);
      await fetchOrders(page, pageSize);
      setSuccessToast(true);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
      handleCloseDelete();
    }
  };

  const columns = [
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "qty", header: "Quantity" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "note", header: "Note" },
    {
      accessorFn: (row) =>
        format(new Date(row.createdAt), "yyyy/MM/dd HH:mm:ss"),
      id: "createdAt",
      header: "Created At",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Box>
          <IconButton
            component={Link}
            href={`/orders/edit/${row.original.id}`}
            size="small"
            color="primary"
          >
            <EditIcon />
          </IconButton>

          {/* ✅ NEW delete button */}
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
          Orders
        </Typography>
        <Button variant="contained" component={Link} href="/orders/add">
          New Order
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalRows={total}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* ✅ Delete confirmation dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Success toast */}
      <Snackbar
        open={successToast}
        autoHideDuration={2500}
        onClose={() => setSuccessToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessToast(false)}>
          Order deleted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export async function getServerSideProps() {
  try {
    const res = await axios.get(`/orders`, {
      params: { page: 1, pageSize: 10 },
    });

    return {
      props: {
        initialOrders: res.data,
      },
    };
  } catch (error) {
    console.error("SSR Fetch Error:", error);
    return {
      props: {
        initialOrders: { list: [], total: 0 },
      },
    };
  }
}
