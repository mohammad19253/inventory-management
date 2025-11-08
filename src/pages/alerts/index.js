import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DataTable from "@/components/DataTable";

const statusColor = (s) => {
  switch (s) {
    case "critical":
      return "error";
    case "low":
      return "warning";
    case "adequate":
      return "success";
    case "overstocked":
      return "default";
    default:
      return "default";
  }
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (e) {
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  }

  async function runScan() {
    setScanLoading(true);
    try {
      const res = await fetch("/api/alerts/scan", { method: "POST" });
      if (!res.ok) throw new Error("scan failed");
      await fetchAlerts();
    } catch (e) {
      setError("Scan failed");
    } finally {
      setScanLoading(false);
    }
  }

  async function updateAlert(id, payload) {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("update failed");
      const updated = await res.json();
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e) {
      setError("Failed to update alert");
    }
  }

  const filtered = alerts.filter(
    (a) =>
      !filter ||
      a.productName.toLowerCase().includes(filter.toLowerCase()) ||
      a.productId.toString().includes(filter.toLowerCase())
  );

  // Define react-table columns
  const columns = [
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "totalStock", header: "Stock" },
    { accessorKey: "reorderPoint", header: "Reorder Point" },
    { accessorKey: "recommendedOrder", header: "Recommended Order" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Chip label={row.original.status} color={statusColor(row.original.status)} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            onClick={() => {
              setSelected(row.original);
              setDialogOpen(true);
            }}
          >
            Order
          </Button>
          <Button
            size="small"
            onClick={() =>
              updateAlert(row.original.id, { dismissed: !row.original.dismissed })
            }
          >
            {row.original.dismissed ? "Undismiss" : "Dismiss"}
          </Button>
          <Button
            size="small"
            onClick={() =>
              updateAlert(row.original.id, {
                actions: [
                  {
                    type: "notified-purchasing",
                    at: new Date().toISOString(),
                    actor: "ui",
                  },
                ],
              })
            }
          >
            Notify
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Low Stock Alerts</Typography>
        <Box>
          <TextField
            size="small"
            placeholder="Search product or id"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={runScan}
            disabled={scanLoading}
          >
            {scanLoading ? "Scanning..." : "Run Inventory Scan"}
          </Button>
        </Box>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        showPagination={false}
      />

      {/* Reorder Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Place Reorder</DialogTitle>
        <DialogContent>
          <Typography>Product: {selected?.productName}</Typography>
          <Typography>Total stock: {selected?.totalStock}</Typography>
          <Typography>Recommended: {selected?.recommendedOrder}</Typography>
          <TextField
            label="Order quantity"
            type="number"
            defaultValue={selected?.recommendedOrder ?? 0}
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
            onClick={async () => {
              const qty = Number(document.getElementById("orderQty").value || 0);
              const notes = document.getElementById("orderNotes").value || "";
              await updateAlert(selected.id, {
                actions: [
                  {
                    type: "ordered",
                    at: new Date().toISOString(),
                    actor: "ui",
                    qty,
                    note: notes,
                  },
                ],
                dismissed: false,
              });
              setDialogOpen(false);
            }}
          >
            Record Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
