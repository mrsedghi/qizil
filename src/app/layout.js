import "./globals.css";
import { NotistackProvider } from "./providers/NotistackProvider";
import NextTopLoader from "nextjs-toploader";
import SplashProvider from "./providers/SplashProvider";

export const metadata = {
  title: "قیزیل",
  description: "گنجینه شعر آذربایجان",
  manifest: "/manifest.json",
  themeColor: "#DB924C", // Match your theme color
  appleWebApp: {
    capable: true,
    title: "قیزیل",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="coffee" className="noisy-bg min-h-screen" lang="fa">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#DB924C" />
      </head>
      <body dir="rtl">
        <NextTopLoader
          color="#DB924C"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />
        <SplashProvider>
          <NotistackProvider>{children}</NotistackProvider>
        </SplashProvider>
      </body>
    </html>
  );
}
