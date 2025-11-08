import { Grid, TextField, MenuItem, Button, Alert, Paper, Box, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TRANSFER_SCHEMA } from '@/schemas/transferSchema';

export default function TransferForm({ warehouses, products, onSubmit, loading, error }) {
  const { handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(TRANSFER_SCHEMA),
    defaultValues: {
      fromWarehouseId: 0,
      toWarehouseId: 0,
      productId: 0,
      quantity: 1,
    },
  });

  const watchSource = watch('fromWarehouseId');
  const watchDestination = watch('toWarehouseId');
  const handleReset = () => reset();
  return (
    <Paper sx={{ p: 4, mb: 4 }}> {/* padding and margin */}
      <form onSubmit={handleSubmit((data) => { onSubmit(data); reset(); })}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Controller
              name="fromWarehouseId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Source Warehouse"
                  error={!!errors.fromWarehouseId}
                  helperText={errors.fromWarehouseId?.message}
                  {...field}
                >
                  <MenuItem value={0} disabled>Select warehouse</MenuItem>
                  {warehouses?.filter((w) => w.id !== watchDestination).map((w) => (
                    <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="toWarehouseId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Destination Warehouse"
                  error={!!errors.toWarehouseId}
                  helperText={errors.toWarehouseId?.message}
                  {...field}
                >
                  <MenuItem value={0} disabled>Select warehouse</MenuItem>
                  {warehouses?.filter((w) => w.id !== watchSource).map((w) => (
                    <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  fullWidth
                  label="Product"
                  error={!!errors.productId}
                  helperText={errors.productId?.message}
                  {...field}
                >
                  <MenuItem value={0} disabled>Select product</MenuItem>
                  {products?.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField
                   {...field}
                  type="number"
                  fullWidth
                  label="Quantity"
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  onChange={(e)=>field.onChange(Number(e.target.value))}
           
                />
              )}
            />
          </Grid>

         <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Transferring...' : 'Transfer Stock'}
              </Button>
              <Button onClick={handleReset} variant="outlined" disabled={loading}>
                Reset
              </Button>
          </Stack>
        </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
