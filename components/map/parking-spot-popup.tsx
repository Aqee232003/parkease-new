"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Car, Navigation, X, Star, Shield, Zap } from "lucide-react"
import { calculateDistance } from "@/lib/location"

export function ParkingSpotPopup({ spot, onClose, userLocation }) {
  const [isBooking, setIsBooking] = useState(false)

  // Calculate distance from user
  const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng) : null

  // Handle booking
  const handleBooking = () => {
    setIsBooking(true)
    // In a real app, this would navigate to the booking page
    setTimeout(() => {
      window.location.href = `/booking/${spot.id}`
    }, 1000)
  }

  // Handle navigation
  const handleNavigation = () => {
    // Open in Google Maps or other map app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`
    window.open(url, "_blank")
  }

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader className="pb-2 relative">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="pr-8">{spot.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {spot.address}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < Math.floor(spot.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-xs ml-1">
            {spot.rating} ({spot.reviews} reviews)
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">Price</span>
            <span className="font-bold">
              {spot.currency}
              {spot.price}/{spot.priceUnit}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-md">
            <span className="text-xs text-muted-foreground">Available</span>
            <span className="font-bold">
              {spot.availableSpots}/{spot.totalSpots}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Hours:
            </span>
            <span className="font-medium">{spot.hours}</span>
          </div>

          {distance !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <Navigation className="h-3 w-3 mr-1" /> Distance:
              </span>
              <span className="font-medium">{distance.toFixed(1)} km</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Car className="h-3 w-3 mr-1" /> Type:
            </span>
            <span className="font-medium capitalize">{spot.type}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {spot.security && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Shield className="h-3 w-3" /> Security
            </Badge>
          )}
          {spot.covered && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <span>🏢</span> Covered
            </Badge>
          )}
          {spot.cctv && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <span>📹</span> CCTV
            </Badge>
          )}
          {spot.ev && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Zap className="h-3 w-3" /> EV Charging
            </Badge>
          )}
          {spot.handicapped && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <span>♿</span> Accessible
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button className="flex-1" onClick={handleBooking} disabled={isBooking || spot.availableSpots === 0}>
          {isBooking ? "Booking..." : "Book Now"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleNavigation}>
          <Navigation className="h-4 w-4 mr-2" /> Navigate
        </Button>
      </CardFooter>
    </Card>
  )
}

