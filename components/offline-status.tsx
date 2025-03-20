"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine)

    // Add event listeners
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
      <WifiOff className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">You're offline</AlertTitle>
      <AlertDescription className="text-amber-700">
        You can still use ParkEase, but some features may be limited until you reconnect.
      </AlertDescription>
    </Alert>
  )
}

