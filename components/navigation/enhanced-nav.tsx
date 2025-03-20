"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSwipeable } from "react-swipeable"

interface EnhancedNavProps {
  children: React.ReactNode
}

export function EnhancedNav({ children }: EnhancedNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [history, setHistory] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  // Track navigation history
  useEffect(() => {
    if (pathname) {
      // If we're not at the end of the history, truncate the forward history
      if (currentIndex < history.length - 1) {
        setHistory((prev) => prev.slice(0, currentIndex + 1))
      }

      // Add current path to history if it's different from the last one
      if (history.length === 0 || history[history.length - 1] !== pathname) {
        setHistory((prev) => [...prev, pathname])
        setCurrentIndex((prev) => prev + 1)
      }
    }
  }, [pathname, history, currentIndex])

  // Update navigation state
  useEffect(() => {
    setCanGoBack(currentIndex > 0)
    setCanGoForward(currentIndex < history.length - 1)
  }, [currentIndex, history])

  // Handle back navigation
  const handleBack = () => {
    if (canGoBack) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      router.push(history[newIndex])
    }
  }

  // Handle forward navigation
  const handleForward = () => {
    if (canGoForward) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      router.push(history[newIndex])
    }
  }

  // Set up swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (canGoBack) handleBack()
    },
    onSwipedLeft: () => {
      if (canGoForward) handleForward()
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50,
  })

  return (
    <div {...swipeHandlers} className="min-h-screen">
      <div className="fixed top-0 left-0 z-50 flex items-center gap-1 p-2 bg-background/80 backdrop-blur-sm rounded-br-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          disabled={!canGoBack}
          className={cn("h-8 w-8 transition-opacity", !canGoBack && "opacity-50 cursor-not-allowed")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleForward}
          disabled={!canGoForward}
          className={cn("h-8 w-8 transition-opacity", !canGoForward && "opacity-50 cursor-not-allowed")}
          aria-label="Go forward"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {children}
    </div>
  )
}

