import { ReactQueryProvider } from "@/providers/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Layout } from "@/components/shared";
import { AlertBadge } from "@/components/alert-badge";
import { ThemeProvider } from "@/providers";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <ReactQueryProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        storageKey="inventory-theme"
      >
        <ThemeProvider>
          <Layout headerContent={<AlertBadge />}>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </NextThemesProvider>
    </ReactQueryProvider>
  );
}
