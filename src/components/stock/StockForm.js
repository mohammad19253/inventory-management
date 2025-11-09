import React from "react";
import { TextField, MenuItem, Box, CircularProgress } from "@mui/material";
import { Controller } from "react-hook-form";
import useProductOptions from "@/hooks/useProductOptions";
import useWarehouseOptions from "@/hooks/useWarehouseOptions";

export default function StockForm({ control, errors }) {
  const { options: productOptions, isLoading: loadingProducts } =
    useProductOptions();
  const { options: warehouseOptions, isLoading: loadingWarehouses } =
    useWarehouseOptions();

  return (
    <Box>
      {/* Product */}
      <Controller
        name="productId"
        control={control}
        render={({ field }) =>
          loadingProducts ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              {...field}
              select
              fullWidth
              label="Product"
              error={!!errors.productId}
              helperText={errors.productId?.message}
              sx={{ my: 2 }}
            >
              <MenuItem value="" disabled>
                Select product
              </MenuItem>
              {productOptions.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }
      />

      {/* Warehouse */}
      <Controller
        name="warehouseId"
        control={control}
        render={({ field }) =>
          loadingWarehouses ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              {...field}
              select
              fullWidth
              label="Warehouse"
              error={!!errors.warehouseId}
              helperText={errors.warehouseId?.message}
              sx={{ my: 2 }}
            >
              <MenuItem value="" disabled>
                Select warehouse
              </MenuItem>
              {warehouseOptions.map((w) => (
                <MenuItem key={w.value} value={w.value}>
                  {w.label}
                </MenuItem>
              ))}
            </TextField>
          )
        }
      />

      {/* Quantity */}
      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            fullWidth
            label="Quantity"
            sx={{ my: 2 }}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
            inputProps={{ min: 1 }}
            onChange={(e) => {
              const val = Number(e.target.value);
              field.onChange(isNaN(val) ? "" : val);
            }}
          />
        )}
      />
    </Box>
  );
}
