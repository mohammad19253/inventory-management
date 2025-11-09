import { z } from "zod";

export const stockSchema = z.object({
  productId: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Product is required")
  ),
  warehouseId: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Warehouse is required")
  ),

  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),
});
