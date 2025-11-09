import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function SummaryCard({ label, value, Icon }) {
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    day: `D${i + 1}`,
    value: Math.floor(Math.random() * 100) + value,
  }));

  return (
    <Card
      sx={{
        borderRadius: 1,
        boxShadow: 1,
        transition: "0.3s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    >
      <CardContent >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            {Icon && <Icon />}
          </Avatar>
          <Typography variant="subtitle1">{label}</Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
        <Box sx={{ mt: 1, height: 30 }}>
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
  );
}
