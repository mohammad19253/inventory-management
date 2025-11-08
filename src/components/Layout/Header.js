import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon, DarkMode, LightMode } from "@mui/icons-material";
import { useTheme as useNextTheme } from "next-themes";

export const Header = ({ onMenuClick, drawerWidth, headerContent }) => {
  const theme = useTheme();
  const { setTheme } = useNextTheme();

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {headerContent && <Box>{headerContent}</Box>}

          <IconButton
            onClick={() =>
              setTheme(theme.palette.mode === "light" ? "dark" : "light")
            }
            color="inherit"
          >
            {theme.palette.mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
