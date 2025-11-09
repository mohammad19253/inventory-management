import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import axios from "@/services/axios";
import ProductForm from "../ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      unitCost: 0,
      reorderPoint: 0,
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
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(`/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      showToast("Product updated successfully");
      router.push("/products");
    },
    onError: (err) => {
      console.error(err);
      showToast("Failed to update product", "error");
    },
  });

  const onSubmit = (data) => updateProduct.mutate(data);

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }
  if (isError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Failed to load product</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}  >
      <Paper elevation={3} sx={{ p: 4 }}  >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Edit Product
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ProductForm control={control} errors={errors} />

          <Stack direction="row" spacing={2} mt={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={updateProduct.isLoading}
            >
              {updateProduct.isLoading ? "Saving..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => reset(product)}
              disabled={updateProduct.isLoading}
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
