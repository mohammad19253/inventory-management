import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import StockReorderBarChart from "@/pages/stock/alerts/stockReorderChart";

export default function StockReorderChartCard({ data, height = 250 }) {
  return (
    <Card sx={{ borderRadius: 1, boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Stock vs Reorder Point per Product
        </Typography>
        <StockReorderBarChart height={height} data={data} />
      </CardContent>
    </Card>
  );
}
