import { useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { generalSans, getAppTheme } from "@/config/theme";

export const ThemeProvider = ({ children }) => {
  const { theme } = useTheme();
  const muiTheme = getAppTheme(theme === "system" ? "light" : theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
