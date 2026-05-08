import type { Metadata, Viewport } from "next";
import { NativeMobileBridge } from "@/components/native-mobile-bridge";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Nutrivue",
  title: "Nutrivue",
  description: "A cleaner, more visual nutrition tracker.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nutrivue"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: "/icons/nutrivue-icon.svg",
    apple: "/icons/nutrivue-icon.svg"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfcf7"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NativeMobileBridge />
        {children}
      </body>
    </html>
  );
}
