import { useQuery } from "@tanstack/react-query";
import axios from "@/services/axios";

export default function useProductOptions() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/products");
      return res.data;
    },
  });

  const options = products.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sku})`,
  }));

  return { options, isLoading, error };
}
