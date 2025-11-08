import { createTheme } from "@mui/material";
import localFont from "next/font/local";

export const roboto = localFont({
  src: [
    {
      path: "../../public/fonts/Roboto/Roboto-Regular.ttf",
    },
  ],
  variable: "--font-general-sans",
});

export const getAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: { default: "#f4f6f8", paper: "#fff" },
            primary: { main: "#1976d2" },
          }
        : {
            background: { default: "#0d1117", paper: "#161b22" },
            primary: { main: "#90caf9" },
          }),
    },
    shape: { borderRadius: 12 },
    components: {
      MuiAppBar: { styleOverrides: { root: { boxShadow: "none" } } },
    },
    typography: {
      fontFamily: `${roboto.style.fontFamily}, sans-serif`,
    },
  });
