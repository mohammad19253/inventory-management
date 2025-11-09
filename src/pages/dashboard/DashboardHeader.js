import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Eye icon
import ListIcon from "@mui/icons-material/List"; // Optional list icon

export default function DashboardHeader() {
  return (
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

      <Button
        variant="contained"
        component={Link}
        href="/stock"
        startIcon={<VisibilityIcon />}
      >
        View Stock
      </Button>
    </Box>
  );
}
