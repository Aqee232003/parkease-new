"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Detect system preference for dark mode
  React.useEffect(() => {
    setMounted(true)

    // Check if user has high contrast mode enabled
    const prefersHighContrast = window.matchMedia("(prefers-contrast: more)").matches

    if (prefersHighContrast) {
      // Apply high contrast mode styles
      document.documentElement.classList.add("high-contrast")
    }

    // Listen for changes in color scheme preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light"
      // Only update if set to system
      if (localStorage.getItem("theme") === "system" || !localStorage.getItem("theme")) {
        document.documentElement.classList.toggle("dark", e.matches)
      }
    }

    darkModeMediaQuery.addEventListener("change", handleChange)

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  // Avoid rendering with wrong theme on first load
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

