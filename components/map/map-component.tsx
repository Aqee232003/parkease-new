"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { calculateDistance } from "@/lib/location"

// Define marker icons
const createIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">P</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const availableIcon = createIcon("#4f46e5") // Primary color
const fullIcon = createIcon("#6b7280") // Gray color
const selectedIcon = createIcon("#f97316") // Orange color

export default function MapComponent({
  center,
  zoom = 13,
  parkingSpots = [],
  userLocation,
  selectedSpot,
  onMarkerClick,
  onPopupClose,
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    // Create map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false,
      })

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add attribution control in a better position
      L.control
        .attribution({
          position: "bottomright",
        })
        .addTo(map)

      mapInstanceRef.current = map
    } else {
      // Update map view if center or zoom changes
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, { animate: true })
    }

    // Cleanup function
    return () => {
      // We don't destroy the map on component unmount to preserve state
      // This is intentional for better UX
    }
  }, [center, zoom])

  // Add user location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return

    // Remove existing user marker
    if (markersRef.current.user) {
      markersRef.current.user.remove()
    }

    // Add user marker
    const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(mapInstanceRef.current)

    // Add accuracy circle
    if (userLocation.accuracy) {
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: userLocation.accuracy,
        color: "#ef4444",
        fillColor: "#ef444433",
        fillOpacity: 0.2,
        weight: 1,
      }).addTo(mapInstanceRef.current)

      markersRef.current.userCircle = circle
    }

    markersRef.current.user = marker

    return () => {
      if (markersRef.current.user) {
        markersRef.current.user.remove()
      }
      if (markersRef.current.userCircle) {
        markersRef.current.userCircle.remove()
      }
    }
  }, [userLocation])

  // Add parking spot markers
  useEffect(() => {
    if (!mapInstanceRef.current || !parkingSpots.length) return

    // Remove existing markers
    Object.values(markersRef.current).forEach((marker) => {
      if (marker !== markersRef.current.user && marker !== markersRef.current.userCircle) {
        marker.remove()
      }
    })

    // Reset markers object (keeping user marker)
    const userMarker = markersRef.current.user
    const userCircle = markersRef.current.userCircle
    markersRef.current = { user: userMarker, userCircle }

    // Add new markers
    parkingSpots.forEach((spot) => {
      const isSelected = selectedSpot && selectedSpot.id === spot.id
      const isAvailable = spot.availableSpots > 0

      const icon = isSelected ? selectedIcon : isAvailable ? availableIcon : fullIcon

      const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(mapInstanceRef.current)

      // Calculate distance from user
      let distanceText = ""
      if (userLocation) {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
        distanceText = `<div class="text-xs mt-1">${distance.toFixed(1)} km away</div>`
      }

      // Add popup with basic info
      marker.bindPopup(`
        <div class="text-sm font-semibold">${spot.name}</div>
        <div class="text-xs">${spot.address}</div>
        ${distanceText}
      `)

      // Add click handler
      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(spot)
        }
      })

      // Store marker reference
      markersRef.current[spot.id] = marker
    })

    // Open popup for selected spot
    if (selectedSpot && markersRef.current[selectedSpot.id]) {
      markersRef.current[selectedSpot.id].openPopup()
    }

    return () => {
      // Cleanup will be handled in the next render
    }
  }, [parkingSpots, selectedSpot, userLocation, onMarkerClick])

  return <div ref={mapRef} className="h-full w-full z-0" />
}

