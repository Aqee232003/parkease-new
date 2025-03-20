"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface LazyLoadProps {
  children: React.ReactNode
  height?: string | number
  width?: string | number
  placeholder?: React.ReactNode
  threshold?: number
}

export function LazyLoad({ children, height = "100%", width = "100%", placeholder, threshold = 0.1 }: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  useEffect(() => {
    if (isVisible) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setHasLoaded(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const defaultPlaceholder = (
    <div className="flex items-center justify-center h-full w-full bg-muted/50 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div
      ref={ref}
      style={{
        height,
        width,
        position: "relative",
      }}
    >
      {!hasLoaded && (placeholder || defaultPlaceholder)}

      {isVisible && (
        <div className={`transition-opacity duration-300 ${hasLoaded ? "opacity-100" : "opacity-0"}`}>{children}</div>
      )}
    </div>
  )
}

