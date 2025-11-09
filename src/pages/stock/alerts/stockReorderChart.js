"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: 1,
        p: 1.5,
        boxShadow: 3,
        minWidth: 140,
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Box
          key={entry.dataKey}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: entry.fill, fontWeight: 500, fontSize: 12 }}
          >
            {entry.name}:
          </Typography>
          <Typography variant="body2" fontWeight="bold" fontSize={12}>
            {entry.value.toLocaleString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function StockReorderBarChart({ data, height = 300 }) {
  const theme = useTheme();
  return (
    <Box sx={{ width: "100%", height: height, mt: 4, mb: 4 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar
            dataKey="stock"
            name="Stock"
            fill={theme.palette.primary.main}
            radius={[8, 8, 0, 0]}
            barSize={20}
          />
          <Bar
            dataKey="reorderPoint"
            name="Reorder Point"
            fill={theme.palette.error.main}
            radius={[8, 8, 0, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
