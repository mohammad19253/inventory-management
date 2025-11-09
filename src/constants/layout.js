import {
  Dashboard,
  Warehouse,
  Inventory2,
  CompareArrows,
  Notifications,
  Storage,
  Add,
  ListAlt,
  ShoppingCart,
} from "@mui/icons-material";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: <Dashboard /> },
  { label: "Transfers", href: "/transfers", icon: <CompareArrows /> },
  {
    label: "Products",
    icon: <Inventory2 />,
    children: [
      { label: "List", href: "/products", icon: <ListAlt /> },
      { label: "Add", href: "/products/add", icon: <Add /> },
    ],
  },
  {
    label: "Stock",
    icon: <Storage />,
    children: [
      { label: "List", href: "/stock", icon: <ListAlt /> },
      { label: "Alerts", href: "/stock/alerts", icon: <Notifications /> },
    ],
  },
  {
    label: "Orders",
    icon: <ShoppingCart />,
    children: [
      { label: "List", href: "/orders", icon: <ListAlt /> },
      { label: "Add", href: "/orders/add", icon: <Add /> },
    ],
  },
  { label: "Warehouses", href: "/warehouses", icon: <Warehouse /> },
];
