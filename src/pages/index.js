import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SUMMARY_CARDS, TABLE_HEADERS } from "@/constants";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Chart from "@/components/Chart";
import DataTable from "@/components/DataTable";

export default function Dashboard() {
  const router = useRouter();
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const totalValue = stock.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productId);
    return sum + (product ? product.unitCost * s.quantity : 0);
  }, 0);

  const inventoryOverview = products.map((p) => {
    const productStock = stock.filter((s) => s.productId === p.id);
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    return { ...p, totalQuantity, isLowStock: totalQuantity < p.reorderPoint };
  });

  const CARD_DATA = {
    products: products.length,
    warehouses: warehouses.length,
    totalValue: totalValue.toFixed(2),
  };

  const chartData = [...inventoryOverview]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)
    .map((item) => ({ name: item.name, quantity: item.totalQuantity }));

  // React-table columns
  const columns = [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "totalQuantity", header: "Quantity", align: "right" },
    { accessorKey: "reorderPoint", header: "Reorder Point", align: "right" },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Chip
          label={row.original.isLowStock ? "Low Stock" : "In Stock"}
          color={row.original.isLowStock ? "warning" : "success"}
          icon={
            row.original.isLowStock ? <WarningAmberIcon /> : <TrendingUpIcon />
          }
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Button variant="contained" onClick={() => router.push("/transfers")}>
          Transfer Stock
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {SUMMARY_CARDS.map((card, index) => {
          const Icon = card.icon;
          const trendData = Array.from({ length: 7 }, (_, i) => ({
            day: `D${i + 1}`,
            value: Math.floor(Math.random() * 100) + CARD_DATA[card.key],
          }));
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 1,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      <Icon />
                    </Avatar>
                    <Typography variant="subtitle1">{card.label}</Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold">
                    {CARD_DATA[card.key]}
                  </Typography>
                  <Box sx={{ mt: 2, height: 50 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#4caf50"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}

        {/* Top Products Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top 5 Products by Quantity
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <Chart
                  type="bar"
                  data={chartData}
                  dataKey="quantity"
                  xKey="name"
                  color="#1976d2"
                />
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Overview Table */}
        <Grid item xs={12} md={8} flex={1}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Inventory Overview
              </Typography>
              <DataTable
                columns={columns}
                data={inventoryOverview}
                loading={loading}
                showPagination={false}
                tableProps={{ size: "small" }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
