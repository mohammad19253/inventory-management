import { useState } from "react";
import Link from "next/link";
import {
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export const Sidebar = ({
  mobileOpen,
  onDrawerToggle,
  drawerWidth,
  navItems,
}) => {
  const [openItems, setOpenItems] = useState({});

  const handleToggle = (label) => {
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item) => {
    if (item.children) {
      return (
        <Box key={item.label}>
          <ListItemButton onClick={() => handleToggle(item.label)}>
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {openItems[item.label] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openItems[item.label]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItemButton
                  key={child.label}
                  component={Link}
                  href={child.href}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText primary={child.label} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItemButton key={item.label} component={Link} href={item.href}>
        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    );
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        color="primary.main"
        sx={{ mb: 2 }}
      >
        Inventory Management
      </Typography>
      <List>{navItems.map(renderNavItem)}</List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
