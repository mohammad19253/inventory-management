import { z } from 'zod';

export const TRANSFER_SCHEMA = z.object({
  fromWarehouseId: z.number().min(1, 'Source warehouse is required'),
  toWarehouseId: z.number().min(1, 'Destination warehouse is required'),
  productId: z.number().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
}).refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
  message: 'Destination cannot be the same as source',
  path: ['destinationWarehouseId'], 
});

 