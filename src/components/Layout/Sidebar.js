import Link from "next/link";
import {
  Drawer,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

export const Sidebar = ({
  mobileOpen,
  onDrawerToggle,
  drawerWidth,
  navItems,
}) => {
  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        color="primary.main"
        sx={{ mb: 2 }}
      >
        Inventory Pro
      </Typography>
      {navItems.map((item) => (
        <ListItemButton component={Link} href={item.href} key={item.label}>
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
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
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
