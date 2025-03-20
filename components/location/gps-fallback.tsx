"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DebouncedInput } from "@/components/ui/debounced-input"
import { MapPin, Navigation, Search, AlertTriangle } from "lucide-react"
import { DEFAULT_LOCATION, getCoordinatesFromAddress } from "@/lib/location"
import { useToast } from "@/components/ui/use-toast"
import { MockMap } from "@/components/mock-map"

interface GPSFallbackProps {
  onLocationSelected: (location: { lat: number; lng: number; name?: string }) => void
  onCancel?: () => void
}

export function GPSFallback({ onLocationSelected, onCancel }: GPSFallbackProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION)
  const [popularLocations, setPopularLocations] = useState([
    { name: "Bangalore City Center", lat: 12.9716, lng: 77.5946 },
    { name: "Mumbai City Center", lat: 19.076, lng: 72.8777 },
    { name: "Delhi City Center", lat: 28.6139, lng: 77.209 },
    { name: "Chennai City Center", lat: 13.0827, lng: 80.2707 },
  ])

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Try to geocode the address
      const coordinates = await getCoordinatesFromAddress(query)

      if (coordinates) {
        setSearchResults([{ name: query, ...coordinates }])
      } else {
        // If geocoding fails, search in popular locations
        const filteredLocations = popularLocations.filter((location) =>
          location.name.toLowerCase().includes(query.toLowerCase()),
        )
        setSearchResults(filteredLocations)
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: "Could not find location. Please try a different search term.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Handle location selection
  const handleSelectLocation = (location: any) => {
    setSelectedLocation(location)
    setSearchResults([])
  }

  // Handle confirm
  const handleConfirm = () => {
    onLocationSelected(selectedLocation)
    toast({
      title: "Location selected",
      description: `Using location: ${selectedLocation.name || "Selected location"}`,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Location Services Unavailable</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We couldn't access your location. Please enter a location manually or select from popular locations.
        </p>

        <DebouncedInput
          placeholder="Search for a location..."
          onValueChange={handleSearch}
          debounceMs={500}
          icon={<Search className="h-4 w-4" />}
          className="w-full"
        />

        {isSearching && <div className="text-center py-2 text-sm text-muted-foreground">Searching...</div>}

        {searchResults.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelectLocation(result)}
              >
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{result.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Popular Locations</h3>
          <div className="grid grid-cols-2 gap-2">
            {popularLocations.map((location, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleSelectLocation(location)}
              >
                <MapPin className="h-3 w-3 mr-2" />
                <span className="truncate">{location.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2">Selected Location</h3>
          <div className="border rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>
                {selectedLocation.name || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
              </span>
            </div>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="h-40 mt-2 rounded-md overflow-hidden border">
            <MockMap width={400} height={160} userLocation={selectedLocation} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleConfirm} className="ml-auto">
          Use This Location
        </Button>
      </CardFooter>
    </Card>
  )
}

