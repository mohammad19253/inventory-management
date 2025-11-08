import { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { DRAWER_WIDTH } from "@/constants";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Main } from "./Main";
import { NAV_ITEMS } from "@/constants";

export const Layout = ({ children, headerContent }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        onMenuClick={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
        headerContent={headerContent}
      />
      <Sidebar
        navItems={NAV_ITEMS}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
      />
      <Main>{children}</Main>
    </Box>
  );
};
