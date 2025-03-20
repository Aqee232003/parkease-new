import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import PWASetup from "@/components/pwa-setup"
import { UserProvider } from "@/components/user-provider"
import { Toaster } from "@/components/ui/toaster"
import { OfflineToastProvider } from "@/components/ui/offline-toast"
import { PageTransition } from "@/components/ui/page-transition"
import { EnhancedNav } from "@/components/navigation/enhanced-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ParkEase - Offline Parking Management",
  description: "Find and book parking spots even without internet",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-512x512.png",
    apple: "/icons/apple-icon-180x180.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserProvider>
            <OfflineToastProvider>
              <PWASetup />
              <EnhancedNav>
                <PageTransition>{children}</PageTransition>
              </EnhancedNav>
              <Toaster />
            </OfflineToastProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

