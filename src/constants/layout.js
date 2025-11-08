import {
  Dashboard,
  Warehouse,
  Inventory2,
  CompareArrows,
  Notifications,Storage
} from "@mui/icons-material";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: <Dashboard /> },
  { label: "Transfers", href: "/transfers", icon: <CompareArrows /> },
  { label: "Products", href: "/products", icon: <Inventory2 /> },
  { label: "Stock", href: "/stock", icon: <Storage /> }, // changed icon
  { label: "Warehouses", href: "/warehouses", icon: <Warehouse /> },
  { label: "Alerts", href: "/alerts", icon: <Notifications /> },
];