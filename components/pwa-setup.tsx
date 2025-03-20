"use client"

import { useEffect } from "react"
import { registerSW } from "@/lib/service-worker"
import { initDB, initializeData } from "@/lib/db"

export default function PWASetup() {
  useEffect(() => {
    const setupPWA = async () => {
      try {
        // Register service worker
        if ("serviceWorker" in navigator && typeof window !== "undefined") {
          registerSW()
        }

        // Initialize IndexedDB
        await initDB()

        // Initialize data (parking spots, cities)
        const success = await initializeData()
        if (success) {
          console.log("PWA setup complete")
        } else {
          console.warn("PWA setup completed with warnings")
        }
      } catch (error) {
        console.error("Error setting up PWA:", error)
        // Continue with the app even if setup fails
      }
    }

    setupPWA()
  }, [])

  return null
}

