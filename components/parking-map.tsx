"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Navigation } from "lucide-react"

export function ParkingMap() {
  const mapRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  // Replace the entire useEffect block with this updated version that handles geolocation errors better
  useEffect(() => {
    // Function to initialize map with fallback coordinates if geolocation fails
    const initializeMap = (coords = { lat: 12.9716, lng: 77.5946 }) => {
      // Default to Bangalore coordinates
      setUserLocation(coords)
      setIsLoading(false)

      // In a real app, we would initialize a map library here
      // For this demo, we'll simulate a map with a canvas
      if (mapRef.current) {
        const ctx = mapRef.current.getContext("2d")

        // Draw a simple map placeholder
        setTimeout(() => {
          if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, mapRef.current.width, mapRef.current.height)

            // Draw background
            ctx.fillStyle = "#f0f0f0"
            ctx.fillRect(0, 0, mapRef.current.width, mapRef.current.height)

            // Draw some roads
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 8

            // Horizontal road
            ctx.beginPath()
            ctx.moveTo(0, mapRef.current.height / 2)
            ctx.lineTo(mapRef.current.width, mapRef.current.height / 2)
            ctx.stroke()

            // Vertical road
            ctx.beginPath()
            ctx.moveTo(mapRef.current.width / 2, 0)
            ctx.lineTo(mapRef.current.width / 2, mapRef.current.height)
            ctx.stroke()

            // Draw road outlines
            ctx.strokeStyle = "#cccccc"
            ctx.lineWidth = 1

            // Horizontal road outline
            ctx.beginPath()
            ctx.moveTo(0, mapRef.current.height / 2 - 4)
            ctx.lineTo(mapRef.current.width, mapRef.current.height / 2 - 4)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, mapRef.current.height / 2 + 4)
            ctx.lineTo(mapRef.current.width, mapRef.current.height / 2 + 4)
            ctx.stroke()

            // Vertical road outline
            ctx.beginPath()
            ctx.moveTo(mapRef.current.width / 2 - 4, 0)
            ctx.lineTo(mapRef.current.width / 2 - 4, mapRef.current.height)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(mapRef.current.width / 2 + 4, 0)
            ctx.lineTo(mapRef.current.width / 2 + 4, mapRef.current.height)
            ctx.stroke()

            // Draw parking spots
            const parkingSpots = [
              { x: mapRef.current.width / 4, y: mapRef.current.height / 4, available: true },
              { x: (mapRef.current.width * 3) / 4, y: mapRef.current.height / 4, available: false },
              { x: mapRef.current.width / 4, y: (mapRef.current.height * 3) / 4, available: true },
              { x: (mapRef.current.width * 3) / 4, y: (mapRef.current.height * 3) / 4, available: true },
            ]

            parkingSpots.forEach((spot) => {
              // Draw parking icon
              ctx.fillStyle = spot.available ? "#4f46e5" : "#6b7280"
              ctx.beginPath()
              ctx.arc(spot.x, spot.y, 10, 0, 2 * Math.PI)
              ctx.fill()

              // Draw P letter
              ctx.fillStyle = "#ffffff"
              ctx.font = "bold 12px Arial"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText("P", spot.x, spot.y)
            })

            // Draw user location
            ctx.fillStyle = "#ef4444"
            ctx.beginPath()
            ctx.arc(mapRef.current.width / 2, mapRef.current.height / 2, 8, 0, 2 * Math.PI)
            ctx.fill()

            // Draw pulse effect
            ctx.strokeStyle = "#ef4444"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(mapRef.current.width / 2, mapRef.current.height / 2, 12, 0, 2 * Math.PI)
            ctx.stroke()
          }
        }, 500)
      }
    }

    // Try to get user's location, but use fallback if it fails
    if ("geolocation" in navigator) {
      try {
        // Set a timeout in case geolocation takes too long or is blocked
        const timeoutId = setTimeout(() => {
          if (isLoading) {
            console.log("Geolocation timed out, using fallback location")
            initializeMap()
          }
        }, 3000)

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId)
            initializeMap({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            clearTimeout(timeoutId)
            console.log("Geolocation error:", error.message)
            // Use fallback location instead of showing an error
            initializeMap()
            // Just set a warning instead of an error that blocks the UI
            setErrorMessage("Using approximate location. For precise location, please enable location services.")
          },
          {
            timeout: 5000,
            enableHighAccuracy: false,
          },
        )
      } catch (error) {
        console.error("Error accessing geolocation:", error)
        initializeMap()
      }
    } else {
      console.log("Geolocation not supported")
      initializeMap()
      setErrorMessage("Geolocation is not supported by your browser. Using default location.")
    }
  }, [])

  // Add a new function to manually set location
  const useDefaultLocation = () => {
    setErrorMessage("")
    // Use a default location (Bangalore city center)
    setUserLocation({
      lat: 12.9716,
      lng: 77.5946,
    })
  }

  // Replace the return statement with this updated version
  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-muted rounded-md">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          <canvas ref={mapRef} width={600} height={300} className="w-full h-64 rounded-md" />

          {errorMessage && (
            <div className="absolute top-2 left-2 right-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button size="icon" variant="secondary" className="bg-white shadow-md">
              <Navigation className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="bg-white shadow-md">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-md text-sm shadow-md">
            Showing 3 available spots
          </div>
        </>
      )}
    </div>
  )
}

