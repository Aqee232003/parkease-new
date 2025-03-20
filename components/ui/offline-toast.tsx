"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { WifiOff, Wifi, Check, AlertTriangle } from "lucide-react"

type OfflineAction = {
  type: "booking" | "payment" | "search" | "data-sync"
  status: "pending" | "success" | "error"
  message: string
}

export function OfflineToastProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [isOnline, setIsOnline] = useState(true)
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([])
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false)
  const [hasShownOnlineToast, setHasShownOnlineToast] = useState(false)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (hasShownOfflineToast && !hasShownOnlineToast) {
        toast({
          title: "You're back online",
          description: "Your data will now sync with the server.",
          icon: <Wifi className="h-4 w-4 text-green-500" />,
        })
        setHasShownOnlineToast(true)

        // Process any pending offline actions
        if (offlineActions.length > 0) {
          toast({
            title: "Syncing offline data",
            description: `${offlineActions.length} actions will be processed.`,
            icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          })
        }
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      if (!hasShownOfflineToast) {
        toast({
          title: "You're offline",
          description: "You can still use the app. Changes will sync when you're back online.",
          icon: <WifiOff className="h-4 w-4 text-amber-500" />,
          duration: 5000,
        })
        setHasShownOfflineToast(true)
      }
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast, hasShownOfflineToast, hasShownOnlineToast, offlineActions.length])

  // Function to add offline actions
  const addOfflineAction = (action: OfflineAction) => {
    setOfflineActions((prev) => [...prev, action])

    // Show toast for the action
    toast({
      title:
        action.status === "pending"
          ? "Offline Action Queued"
          : action.status === "success"
            ? "Action Completed"
            : "Action Failed",
      description: action.message,
      icon:
        action.status === "pending" ? (
          <WifiOff className="h-4 w-4 text-amber-500" />
        ) : action.status === "success" ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        ),
      duration: 3000,
    })
  }

  // Create context value
  const contextValue = {
    isOnline,
    addOfflineAction,
    offlineActions,
  }

  // Expose the context to window for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).parkEaseOfflineContext = contextValue
    }
  }, [isOnline, offlineActions])

  return children
}

// Helper function to use from anywhere in the app
export function showOfflineToast(action: OfflineAction) {
  if (typeof window !== "undefined" && (window as any).parkEaseOfflineContext) {
    ;(window as any).parkEaseOfflineContext.addOfflineAction(action)
  }
}

