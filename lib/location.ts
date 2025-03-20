// Utility functions for handling location services

// Default location (Bangalore city center)
export const DEFAULT_LOCATION = {
  lat: 12.9716,
  lng: 77.5946,
  name: "Bangalore",
}

// Get current position with promise API and fallback
export function getCurrentPosition(options = {}): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    const defaultOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, { ...defaultOptions, ...options })
  })
}

// Get user location with fallback to default
export async function getUserLocation() {
  try {
    const position = await getCurrentPosition()
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    }
  } catch (error) {
    console.warn("Error getting location, using default:", error)
    return DEFAULT_LOCATION
  }
}

// Calculate distance between two coordinates in kilometers
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Get nearby locations based on current position and radius
export function getNearbyLocations(currentLocation: { lat: number; lng: number }, locations: any[], radiusKm: number) {
  return locations.filter((location) => {
    const distance = calculateDistance(currentLocation.lat, currentLocation.lng, location.lat, location.lng)
    return distance <= radiusKm
  })
}

// Get a location's address from coordinates (reverse geocoding)
export async function getAddressFromCoordinates(lat: number, lng: number) {
  try {
    // Try to use online service first
    if (navigator.onLine) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()
      if (data && data.display_name) {
        return data.display_name
      }
    }

    // Fallback to approximate location based on pre-cached data
    return "Location data available offline"
  } catch (error) {
    console.error("Error getting address:", error)
    return "Unknown location"
  }
}

// Get coordinates from an address (geocoding)
export async function getCoordinatesFromAddress(address: string) {
  try {
    // Try to use online service first
    if (navigator.onLine) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: Number.parseFloat(data[0].lat),
          lng: Number.parseFloat(data[0].lon),
        }
      }
    }

    // Fallback to searching in our pre-cached data
    // This would be implemented to search through our local database
    return null
  } catch (error) {
    console.error("Error geocoding address:", error)
    return null
  }
}

// Pre-cache map tiles for a specific area
export async function precacheMapTiles(center: { lat: number; lng: number }, zoomLevels: number[] = [13, 14, 15]) {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
    return false
  }

  try {
    // For each zoom level, calculate the tiles needed
    for (const zoom of zoomLevels) {
      const tiles = calculateTilesForArea(center, zoom, 1) // 1km radius

      // Request each tile to be cached by the service worker
      for (const tile of tiles) {
        const url = `https://a.tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`
        await fetch(url, { mode: "no-cors" })
      }
    }

    return true
  } catch (error) {
    console.error("Error pre-caching map tiles:", error)
    return false
  }
}

// Calculate which map tiles are needed for a specific area
function calculateTilesForArea(center: { lat: number; lng: number }, zoom: number, radiusKm: number) {
  // Convert lat/lng to tile coordinates
  const centerTile = latLngToTile(center.lat, center.lng, zoom)

  // Calculate how many tiles we need to cover the radius
  const tiles = []
  const tileSize = 256 // OSM tile size in pixels
  const metersPerPixel = (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom)
  const pixelsForRadius = (radiusKm * 1000) / metersPerPixel
  const tilesForRadius = Math.ceil(pixelsForRadius / tileSize)

  // Generate a square of tiles around the center
  for (let x = centerTile.x - tilesForRadius; x <= centerTile.x + tilesForRadius; x++) {
    for (let y = centerTile.y - tilesForRadius; y <= centerTile.y + tilesForRadius; y++) {
      tiles.push({ x, y })
    }
  }

  return tiles
}

// Convert latitude and longitude to tile coordinates
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const x = Math.floor(((lng + 180) / 360) * n)
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n,
  )
  return { x, y }
}

