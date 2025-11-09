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
import OrderForm from "../../../components/orders/OrderForm";
import axios from "@/services/axios";

export default function EditOrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productId: "",
      qty: "",
    },
  });
  const [toast, setToast] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });
  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await axios.get(`/orders/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!order) return;
    reset({
      productId: order.productId,
      qty: order.qty,
    });
  }, [order]);

  const updateOrder = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`/orders/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      showToast("Order updated successfully");
      router.push("/orders");
    },
    onError: (err) => {
      console.error(err);
      showToast("Failed to update order", "error");
    },
  });

  const onSubmit = (data) => updateOrder.mutate(data);

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
        <Alert severity="error">Failed to load order</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3}  sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Edit Order
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <OrderForm control={control} errors={errors} />
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={updateOrder.isLoading}
            >
              {updateOrder.isLoading ? "Saving..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset(order)}
              disabled={updateOrder.isLoading}
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
