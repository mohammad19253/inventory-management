import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import StockForm from "../../components/stock/StockForm";
import axios from "@/services/axios";
import { stockSchema } from "../../schemas/stockSchema";
import { useQueryClient } from "@tanstack/react-query";

export default function AddStockPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      productId: "",
      warehouseId: "",
      quantity: 1,
    },
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const handleCloseToast = () => setToast((p) => ({ ...p, open: false }));

  const onSubmit = async (data) => {
    try {
      setLoadingSubmit(true);
      await axios.post("/stock", data);
          queryClient.invalidateQueries({ queryKey: ["/alerts", "/alerts/count"] });
      showToast("Stock record added successfully");
      router.push("/stock");
      reset();
    } catch (error) {
      console.error(error);
      showToast("Failed to add stock record", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Add Stock Record
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <StockForm control={control} errors={errors} />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loadingSubmit}>
              {loadingSubmit ? "Saving..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset()}
              disabled={loadingSubmit}
            >
              Reset
            </Button>
          </Stack>
        </form>
      </Paper>

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
