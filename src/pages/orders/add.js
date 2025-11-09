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
import OrderForm from "../../components/orders/OrderForm";

import axios from "@/services/axios";
import { orderSchema } from "../../schemas/orderShema";
import { useRouter } from "next/navigation";

export default function AddOrderPage() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      productId: "",
      qty: 1,
      status: "inprogress",
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

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const onSubmit = async (data) => {
    try {
      setLoadingSubmit(true);
      await axios.post("/orders", data);
      showToast("Order created successfully");

      router.push("/orders");
      reset();
    } catch (err) {
      console.error(err);
      showToast("Failed to create order", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          New Order
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <OrderForm control={control} errors={errors} />
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
