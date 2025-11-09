import React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useProductOptions from "@/hooks/useProductOptions";

export default function OrderForm({ control, errors, loadingSubmit }) {
  const { options: products, isLoading: loadingProducts } = useProductOptions();

  return (
    <Box>
      {/* Product select */}
      <Controller
        name="productId"
        control={control}
        render={({ field }) =>
          loadingProducts ? (
            <Box display="flex" justifyContent="center" mt={1}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              sx={{ my: 2 }}
              select
              fullWidth
              label="Product"
              error={!!errors.productId}
              helperText={errors.productId?.message}
              {...field}
            >
              <MenuItem value="" disabled>
                Select product
              </MenuItem>
              {products.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }
      />

      {/* Quantity input */}
      <Controller
        name="qty"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            sx={{ my: 2 }}
            type="number"
            fullWidth
            label="Quantity"
            error={!!errors.qty}
            helperText={errors.qty?.message}
            inputProps={{ min: 1 }}
            onChange={(e) => {
              const value = Number(e.target.value);
              field.onChange(isNaN(value) ? "" : value);
            }}
          />
        )}
      />

      {/* Note textarea */}
      <Controller
        name="note"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            sx={{ my: 2 }}
            label="Note"
            multiline
            rows={4}
            fullWidth
            error={!!errors.note}
            helperText={errors.note?.message}
          />
        )}
      />
    </Box>
  );
}
