import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Layout } from "@/components";
import { ThemeProvider } from "@/providers";
import "@/styles/globals.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, IconButton } from "@mui/material";

export default function MyApp({ Component, pageProps }) {
  const [alertCount, setAlertCount] = useState(0);

  // Fetch alert count dynamically
  useEffect(() => {
    async function fetchAlertCount() {
      try {
        const res = await fetch("/api/alerts/count"); // endpoint returning number of alerts
        if (!res.ok) throw new Error("Failed to fetch alert count");
        const data = await res.json();
        setAlertCount(data.count);
      } catch (e) {
        console.error(e);
        setAlertCount(0);
      }
    }

    fetchAlertCount();

    // Optional: poll periodically
    const interval = setInterval(fetchAlertCount, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const headerContent = (
    <IconButton color="inherit">
      <Badge badgeContent={alertCount} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="inventory-theme"
    >
      <ThemeProvider>
        <Layout headerContent={headerContent}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </NextThemesProvider>
  );
}
