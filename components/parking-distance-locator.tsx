"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, Navigation, LocateFixed, Car, Search, Star, Zap, Shield, Umbrella } from "lucide-react"
import { getUserLocation, DEFAULT_LOCATION, calculateDistance } from "@/lib/location"
import { getParkingSpots } from "@/lib/db"
import { MockMap } from "@/components/mock-map"
import { GPSFallback } from "@/components/location/gps-fallback"
import { showOfflineToast } from "@/components/ui/offline-toast"
import Link from "next/link"

export function ParkingDistanceLocator() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION)
  const [parkingSpots, setParkingSpots] = useState([])
  const [filteredSpots, setFilteredSpots] = useState([])
  const [searchRadius, setSearchRadius] = useState(5) // in km
  const [showGPSFallback, setShowGPSFallback] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    onlyAvailable: true,
    covered: false,
    ev: false,
    security: false,
  })

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Load user location and parking spots
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // Get user location
        try {
          const location = await getUserLocation()
          setUserLocation(location)
        } catch (error) {
          console.error("Error getting location:", error)
          setShowGPSFallback(true)
        }

        // Load parking spots
        const spots = await getParkingSpots()
        if (spots && spots.length > 0) {
          setParkingSpots(spots)
        } else {
          // If no spots in IndexedDB, fetch from JSON
          try {
            const response = await fetch("/data/parking-spots.json")
            const data = await response.json()
            setParkingSpots(data.spots)

            if (isOffline) {
              showOfflineToast({
                type: "data-sync",
                status: "success",
                message: "Using cached parking data while offline",
              })
            }
          } catch (error) {
            console.error("Error fetching parking spots:", error)
            toast({
              title: "Error",
              description: "Could not load parking spots data",
              variant: "destructive",
            })
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [isOffline, toast])

  // Filter parking spots based on location and filters
  useEffect(() => {
    if (parkingSpots.length > 0 && userLocation) {
      // Filter by distance
      let spots = parkingSpots.filter((spot) => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
        return distance <= searchRadius
      })

      // Sort by distance
      spots = spots.sort((a, b) => {
        const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng)
        const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
        return distanceA - distanceB
      })

      // Apply filters
      spots = spots.filter((spot) => {
        // Filter by price
        if (spot.price < filters.minPrice || spot.price > filters.maxPrice) {
          return false
        }

        // Filter by availability
        if (filters.onlyAvailable && spot.availableSpots <= 0) {
          return false
        }

        // Filter by covered
        if (filters.covered && !spot.covered) {
          return false
        }

        // Filter by EV charging
        if (filters.ev && !spot.ev) {
          return false
        }

        // Filter by security
        if (filters.security && !spot.security) {
          return false
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            spot.name.toLowerCase().includes(query) ||
            spot.address.toLowerCase().includes(query) ||
            spot.description.toLowerCase().includes(query)
          )
        }

        return true
      })

      // Add distance to each spot
      spots = spots.map((spot) => ({
        ...spot,
        distance: calculateDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng),
      }))

      setFilteredSpots(spots)
    }
  }, [parkingSpots, userLocation, searchRadius, filters, searchQuery])

  // Handle location selected from GPS fallback
  const handleLocationSelected = (location) => {
    setUserLocation(location)
    setShowGPSFallback(false)
  }

  // Handle search radius change
  const handleRadiusChange = (value) => {
    setSearchRadius(value[0])
  }

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle navigate to spot
  const handleNavigateToSpot = (spot) => {
    // In a real app, this would navigate to the navigation page with the spot as destination
    toast({
      title: "Navigation Started",
      description: `Navigating to ${spot.name}`,
    })
  }

  // Handle book spot
  const handleBookSpot = (spot) => {
    // In a real app, this would navigate to the booking page for this spot
    toast({
      title: "Booking Started",
      description: `Starting booking process for ${spot.name}`,
    })
  }

  return (
    <div className="space-y-4">
      {showGPSFallback ? (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <GPSFallback onLocationSelected={handleLocationSelected} onCancel={() => setShowGPSFallback(false)} />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Nearby Parking Spots</CardTitle>
                  <CardDescription>Find parking spots near your location</CardDescription>
                </div>
                {isOffline && (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                  >
                    Offline Mode
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for parking spots..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <LocateFixed className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">Current Location</p>
                      <p className="text-sm text-muted-foreground">Your position</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowGPSFallback(true)}>
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Search Radius: {searchRadius} km</Label>
                  </div>
                  <Slider defaultValue={[searchRadius]} max={20} step={1} onValueChange={handleRadiusChange} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={filters.onlyAvailable}
                      onCheckedChange={(checked) => handleFilterChange("onlyAvailable", checked)}
                    />
                    <label
                      htmlFor="available"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Available Only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="covered"
                      checked={filters.covered}
                      onCheckedChange={(checked) => handleFilterChange("covered", checked)}
                    />
                    <label
                      htmlFor="covered"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Covered Parking
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ev"
                      checked={filters.ev}
                      onCheckedChange={(checked) => handleFilterChange("ev", checked)}
                    />
                    <label
                      htmlFor="ev"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      EV Charging
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="security"
                      checked={filters.security}
                      onCheckedChange={(checked) => handleFilterChange("security", checked)}
                    />
                    <label
                      htmlFor="security"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Security
                    </label>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="h-64 rounded-md overflow-hidden border relative">
                <MockMap
                  width={600}
                  height={256}
                  userLocation={userLocation}
                  parkingSpots={filteredSpots.map((spot) => ({
                    x: Math.random(), // In a real app, these would be calculated from lat/lng
                    y: Math.random(),
                    available: spot.availableSpots > 0,
                  }))}
                />
              </div>

              {/* Results */}
              <div className="space-y-2">
                <h3 className="font-medium">
                  {filteredSpots.length} parking spots found within {searchRadius} km
                </h3>

                {filteredSpots.length === 0 ? (
                  <div className="p-8 text-center border rounded-md">
                    <p className="text-muted-foreground">No parking spots found matching your criteria.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("")
                        setFilters({
                          minPrice: 0,
                          maxPrice: 100,
                          onlyAvailable: true,
                          covered: false,
                          ev: false,
                          security: false,
                        })
                        setSearchRadius(5)
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {filteredSpots.map((spot) => (
                      <Card key={spot.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/3 h-32 md:h-auto">
                            <img
                              src={spot.image || "/placeholder.svg?height=150&width=150"}
                              alt={spot.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{spot.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {spot.address}
                                </p>
                                <div className="flex items-center mt-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs ml-1">
                                    {spot.rating} ({spot.reviews} reviews)
                                  </span>
                                  <span className="mx-2 text-muted-foreground">•</span>
                                  <span className="text-xs">{spot.distance.toFixed(1)} km away</span>
                                </div>
                              </div>
                              <Badge
                                className={
                                  spot.availableSpots > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }
                              >
                                {spot.availableSpots > 0 ? `${spot.availableSpots} Available` : "Full"}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {spot.security && (
                                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                  <Shield className="h-3 w-3" /> Security
                                </Badge>
                              )}
                              {spot.covered && (
                                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                  <Umbrella className="h-3 w-3" /> Covered
                                </Badge>
                              )}
                              {spot.ev && (
                                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                  <Zap className="h-3 w-3" /> EV Charging
                                </Badge>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-3">
                              <div>
                                <p className="font-bold text-lg">
                                  {spot.currency}
                                  {spot.price}/{spot.priceUnit}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link
                                    href={`/navigation?lat=${spot.lat}&lng=${spot.lng}&name=${encodeURIComponent(spot.name)}`}
                                  >
                                    <Navigation className="h-4 w-4 mr-1" />
                                    Navigate
                                  </Link>
                                </Button>
                                <Button size="sm" asChild>
                                  <Link href={`/booking/${spot.id}`}>
                                    <Car className="h-4 w-4 mr-1" />
                                    Book
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
}

function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}

function Checkbox({
  id,
  checked,
  onCheckedChange,
}: { id: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
    />
  )
}

