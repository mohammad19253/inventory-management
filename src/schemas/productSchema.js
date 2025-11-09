import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().nonempty("SKU is required"),
  name: z.string().nonempty("Name is required"),
  category: z.string().nonempty("Category is required"),
  unitCost: z
    .number({ invalid_type_error: "Unit cost must be a number" })
    .min(0, "Unit cost cannot be negative"),
  reorderPoint: z
    .number({ invalid_type_error: "Reorder point must be a number" })
    .min(0, "Reorder point cannot be negative"),
});
