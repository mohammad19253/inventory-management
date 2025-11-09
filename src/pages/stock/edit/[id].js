import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/services/axios";
import StockForm from "../../../components/stock/StockForm";

export default function EditStockPage() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productId: "",
      warehouseId: "",
      quantity: "",
    },
  });

  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const handleCloseToast = () => setToast((p) => ({ ...p, open: false }));

  const {
    data: stock,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stock", id],
    queryFn: async () => {
      const res = await axios.get(`/stock/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!stock) return;
    reset({
      productId: stock.productId,
      warehouseId: stock.warehouseId,
      quantity: stock.quantity,
    });
  }, [stock]);

  const updateStock = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`/stock/${id}`, data);
      return res.data;
    },
    onSuccess: async () => {
      showToast("Stock record updated successfully");
      queryClient.invalidateQueries({ queryKey: ["/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/alerts/count"] });
      // "/alerts/count"
      router.push("/stock");
    },
    onError: (err) => {
      console.error(err);
      showToast("Failed to update stock record", "error");
    },
  });

  const onSubmit = (data) => updateStock.mutate(data);

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load stock record</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Edit Stock Record
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <StockForm control={control} errors={errors} />
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={updateStock.isLoading}
            >
              {updateStock.isLoading ? "Saving..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset(stock)}
              disabled={updateStock.isLoading}
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
