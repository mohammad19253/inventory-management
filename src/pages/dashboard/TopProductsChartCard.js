import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Chart } from "@/components/shared";
import { ResponsiveContainer } from "recharts";

export default function TopProductsChartCard({ data, color }) {
  return (
    <Card sx={{ borderRadius: 1, boxShadow: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Top 5 Products by Quantity
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <Chart
            type="bar"
            data={data}
            dataKey="quantity"
            xKey="name"
            color={color}
          />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
