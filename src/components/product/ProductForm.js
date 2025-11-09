import React from "react";
import { Box, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function ProductForm({ control, errors }) {
  return (
    <Box>
      <Controller
        name="sku"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="SKU"
            sx={{ my: 2 }}
            error={!!errors.sku}
            helperText={errors.sku?.message}
          />
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Name"
            sx={{ my: 2 }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Category"
            sx={{ my: 2 }}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
        )}
      />

      <Controller
        name="unitCost"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="number"
            label="Unit Cost"
            sx={{ my: 2 }}
            inputProps={{ min: 0, step: 0.01 }}
            error={!!errors.unitCost}
            helperText={errors.unitCost?.message}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />

      <Controller
        name="reorderPoint"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="number"
            label="Reorder Point"
            sx={{ my: 2 }}
            inputProps={{ min: 0 }}
            error={!!errors.reorderPoint}
            helperText={errors.reorderPoint?.message}
            onChange={(e) => field.onChange(Number(e.target.value))}
          />
        )}
      />
    </Box>
  );
}
