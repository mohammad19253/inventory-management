import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";
import { productSchema } from "./schema/productSchema";
import axios from "@/services/axios";

export default function AddProductPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      unitCost: 0,
      reorderPoint: 0,
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
      await axios.post("/products", data);
      showToast("Product created successfully");
      reset();
      router.push("/products");
    } catch (err) {
      console.error(err);
      showToast("Failed to create product", "error");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}  >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Add Product
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ProductForm control={control} errors={errors} />

          <Stack direction="row" spacing={2} mt={2}>
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
