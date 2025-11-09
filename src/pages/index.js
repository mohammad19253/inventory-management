import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import DashboardHeader from "./dashboard/DashboardHeader";
import SummaryCard from "./dashboard/SummaryCard"; // make sure this points to your single card component
import StockReorderChartCard from "./dashboard/StockReorderChartCard";
import TopProductsChartCard from "./dashboard/TopProductsChartCard";
import InventoryOverviewTable from "./dashboard/InventoryOverviewTable";
import { SUMMARY_CARDS } from "@/constants";

export default function Dashboard() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/warehouses").then((r) => r.json()),
      fetch("/api/stock").then((r) => r.json()),
    ])
      .then(([productsData, warehousesData, stockData]) => {
        setProducts(productsData);
        setWarehouses(warehousesData);
        setStock(stockData.list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const totalValue = stock.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productId);
    return sum + (product ? product.unitCost * s.quantity : 0);
  }, 0);

  const inventoryOverview = products.map((p) => {
    const productStock = stock.filter((s) => s.productId === p.id);
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    return { ...p, totalQuantity, isLowStock: totalQuantity < p.reorderPoint };
  });

  const totalInventoryQuantity = inventoryOverview.reduce(
    (sum, p) => sum + p.totalQuantity,
    0
  );

  const cardData = {
    products: products.length,
    warehouses: warehouses.length,
    totalValue: totalValue.toFixed(2),
    totalCount: totalInventoryQuantity.toFixed(2),
  };

  const topProductsChartData = [...inventoryOverview]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)
    .map((item) => ({ name: item.name, quantity: item.totalQuantity }));

  const stockReorderChartData = inventoryOverview.map((p) => ({
    name: p.name,
    stock: p.totalQuantity,
    reorderPoint: p.reorderPoint,
  }));

  return (
    <Box sx={{ p: { xs: 1, sm: 3, md: 4 } }}>
      <DashboardHeader />

      <Grid container spacing={2} sx={{ p: { xs: 1, sm: 3, md: 4 } }}>
        <Grid container xs={12} md={12} lg={6} spacing={1} p={3} sx={{ p: { xs: 1, sm: 3, md: 4 } }}>
          {SUMMARY_CARDS.map((card) => (
            <Grid item xs={12} md={6} >
              <SummaryCard
                key={card.key}
                label={card.label}
                value={cardData[card.key]}
                Icon={card.icon}
              />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <StockReorderChartCard data={stockReorderChartData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopProductsChartCard
            data={topProductsChartData}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <InventoryOverviewTable data={inventoryOverview} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
}
