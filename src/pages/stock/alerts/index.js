import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/shared";
 
import axios from "@/services/axios";
import { statusColor } from "../../../utils";
import StockReorderChart from "./stockReorderChart";

export default function AlertsPage() {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };
  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));
  const {
    data: alerts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/alerts"],
    queryFn: async () => {
      const res = await axios.get("/alerts");
      return res.data;
    },
  });

  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(`/alerts/${id}`, payload);
      return res.data;
    },
    onSuccess: async () => {
      showToast("Alert updated successfully", "success");
      await queryClient.invalidateQueries(["alerts", "count", "list"]);
    },
    onError: () => {
      showToast("Failed to update alert", "error");
    },
  });

  const filtered = alerts.filter(
    (a) =>
      !filter ||
      a.productName.toLowerCase().includes(filter.toLowerCase()) ||
      a.productId.toString().includes(filter.toLowerCase())
  );

  const columns = [
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "totalStock", header: "Stock" },
    { accessorKey: "reorderPoint", header: "Reorder Point" },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={statusColor(row.original.status)}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const alert = row.original;

        const handleMarkAsRead = async () => {
          updateAlertMutation.mutate({
            id: alert.id,
            payload: { dismissed: !alert.dismissed },
          });
        };

        return (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setSelected(alert);
                setDialogOpen(true);
              }}
            >
              Order
            </Button>

            <Button size="small" variant="text" onClick={handleMarkAsRead}>
              {alert.dismissed ? "Unread" : "Mark as Read"}
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleRecordOrder = async () => {
    const qty = Number(document.getElementById("orderQty").value || 0);
    const note = document.getElementById("orderNotes").value || "";

    if (!selected || !qty) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    try {
      // 1️⃣ Create the actual order
      await axios.post("/orders", {
        productId: selected.productId,
        qty,
        status: "inprogress",
        note, // Save note in order
      });

      // 2️⃣ Optionally, mark alert as dismissed or log action
      await updateAlertMutation.mutateAsync({
        id: selected.id,
        payload: {
          actions: [
            {
              type: "ordered",
              at: new Date().toISOString(),
              actor: "ui",
              qty,
              note,
            },
          ],
          dismissed: false,
        },
      });

      showToast("Order created successfully", "success");
      setDialogOpen(false);
      setSelected(null);
      queryClient.invalidateQueries(["alerts", "list"]);
      queryClient.invalidateQueries(["orders", "list"]); // Refresh orders if needed
    } catch (err) {
      console.error(err);
      showToast("Failed to create order", "error");
    }
  };

  const chartData = filtered.map((a) => ({
    name: a.productName,
    stock: a.totalStock,
    reorderPoint: a.reorderPoint,
  }));

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Low Stock Alerts
        </Typography>

        <Box>
          <TextField
            size="small"
            placeholder="Search product or id"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mr: 2 }}
          />
        </Box>
      </Box>

      {error && <Typography color="error">{error.message}</Typography>}

      <DataTable
        columns={columns}
        data={filtered}
        showPagination={false}
        loading={isLoading}
      />
      <Divider sx={{ my: 4 }} />
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Stock vs Reorder Point per Product
          </Typography>
          <StockReorderChart height={250} data={chartData} />
        </CardContent>
      </Card>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Place Reorder</DialogTitle>
        <DialogContent>
          <Typography>Product: {selected?.productName}</Typography>
          <Typography>Total stock: {selected?.totalStock}</Typography>

          <TextField
            label="Order quantity"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            id="orderQty"
          />
          <TextField
            label="Notes (internal)"
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2 }}
            id="orderNotes"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRecordOrder}
            disabled={updateAlertMutation.isPending}
          >
            {updateAlertMutation.isPending ? "Saving..." : "Record Order"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
export async function getServerSideProps() {
  try {
    const res = await axios.get(`/alerts`);
    const data = await res.data;

    return {
      props: {
        initialAlerts: data.alerts || [],
      },
    };
  } catch (err) {
    console.error("SSR Scan failed:", err);
    return {
      props: {
        initialAlerts: [],
      },
    };
  }
}
