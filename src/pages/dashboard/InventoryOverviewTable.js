import React from "react";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import { DataTable } from "@/shared";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function InventoryOverviewTable({ data, loading }) {
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
    <Card sx={{ borderRadius: 1, boxShadow: 1, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Inventory Overview
        </Typography>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          showPagination={false}
          tableProps={{ size: "small" }}
        />
      </CardContent>
    </Card>
  );
}
