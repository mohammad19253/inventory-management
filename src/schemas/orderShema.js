import z from "zod";

export const orderSchema = z.object({
  productId: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Product is required")
  ),
  qty: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(1, "Quantity must be at least 1"),
    note:z.string().optional()
});
