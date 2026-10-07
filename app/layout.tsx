import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer"
import Navebar from "../components/Navebar"
import SiteHeaderAd from "../components/ads/SiteHeaderAd"
import SiteFooterAd from "../components/ads/SiteFooterAd"
import { Toaster } from 'react-hot-toast'


export const metadata: Metadata = {
  title: "CHEFFINGTON",
  description: "Eat Like a Chef — discover restaurants on Cheffington",
  icons: {
    icon: "/cheffington-logo.png",
    apple: "/cheffington-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="" suppressHydrationWarning>
        <Navebar />
        <SiteHeaderAd />
        {children}
        <Toaster position="top-right" />
        <SiteFooterAd />
        <Footer />
      </body>
    </html>
  );
}
