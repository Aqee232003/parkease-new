"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, X } from "lucide-react"
import { calculateDistance } from "@/lib/location"
import { getUserLocation } from "@/lib/location"
import { useEffect, useState } from "react"

export function SearchResults({ results, onSelect, onClose }) {
  const [userLocation, setUserLocation] = useState(null)

  // Get user location for distance calculation
  useEffect(() => {
    async function getLocation() {
      try {
        const location = await getUserLocation()
        setUserLocation(location)
      } catch (error) {
        console.error("Error getting location:", error)
      }
    }

    getLocation()
  }, [])

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto z-20 shadow-lg">
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Search Results ({results.length})</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {results.map((spot) => {
            // Calculate distance if user location is available
            const distance = userLocation
              ? calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
              : null

            return (
              <div
                key={spot.id}
                className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => onSelect(spot)}
              >
                <div>
                  <div className="font-medium">{spot.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {spot.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {spot.currency}
                    {spot.price}/{spot.priceUnit}
                  </div>
                  {distance !== null && <div className="text-xs text-muted-foreground">{distance.toFixed(1)} km</div>}
                </div>
              </div>
            )
          })}

          {results.length === 0 && <div className="text-center py-4 text-muted-foreground">No results found</div>}
        </div>
      </CardContent>
    </Card>
  )
}

