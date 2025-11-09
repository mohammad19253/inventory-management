import { useQuery } from "@tanstack/react-query";
import axios from "@/services/axios";

export default function useWarehouseOptions() {
  const {
    data: warehouses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const res = await axios.get("/warehouses");
      return res.data;
    },
  });

  const options = warehouses.map((w) => ({
    value: w.id,
    label: `${w.name} (${w.code})`,
  }));

  return { options, isLoading, error };
}
