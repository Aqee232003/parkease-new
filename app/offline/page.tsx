"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff, Home, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function OfflinePage() {
  const [lastVisitedPage, setLastVisitedPage] = useState<string | null>(null)

  useEffect(() => {
    // Get the last visited page from localStorage
    const lastPage = localStorage.getItem("parkease-last-page")
    if (lastPage) {
      setLastVisitedPage(lastPage)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="bg-amber-100 p-4 rounded-full inline-flex mb-6"
        >
          <WifiOff className="h-12 w-12 text-amber-600" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>

        <p className="text-muted-foreground mb-6">
          Don't worry! ParkEase works offline. You can still access your saved parking spots and bookings.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>

          {lastVisitedPage && (
            <Button variant="outline" asChild className="w-full">
              <Link href={lastVisitedPage}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Previous Page
              </Link>
            </Button>
          )}

          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Try Reconnecting
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          ParkEase uses advanced offline capabilities to ensure you can still use essential features without an internet
          connection.
        </p>
      </motion.div>
    </div>
  )
}

