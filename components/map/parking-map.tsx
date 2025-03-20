"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Filter, X, Layers, Compass } from "lucide-react"
import { getParkingSpots, searchParkingSpots, filterParkingSpots } from "@/lib/db"
import { getUserLocation, DEFAULT_LOCATION, precacheMapTiles } from "@/lib/location"
import { ParkingSpotPopup } from "./parking-spot-popup"
import { SearchResults } from "./search-results"
import { FilterPanel } from "./filter-panel"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted rounded-md">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading map...</p>
      </div>
    </div>
  ),
})

export function ParkingMap() {
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION)
  const [parkingSpots, setParkingSpots] = useState([])
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    type: "all",
    covered: false,
    ev: false,
    minAvailable: 1,
  })
  const [mapCenter, setMapCenter] = useState(null)
  const [mapZoom, setMapZoom] = useState(13)

  // Load parking spots and user location
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // Get user location
        const location = await getUserLocation()
        setUserLocation(location)
        setMapCenter(location)

        // Load parking spots
        const spots = await getParkingSpots()
        if (spots && spots.length > 0) {
          setParkingSpots(spots)
        } else {
          // If no spots in IndexedDB, fetch from JSON
          const response = await fetch("/data/parking-spots.json")
          const data = await response.json()
          setParkingSpots(data.spots)
        }

        // Pre-cache map tiles for offline use
        precacheMapTiles(location)

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setErrorMessage("Error loading map data. Using default location.")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      const results = await searchParkingSpots(searchQuery)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (error) {
      console.error("Search error:", error)
      setErrorMessage("Error performing search")
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim() === "") {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  // Handle search result selection
  const handleSelectSearchResult = (spot) => {
    setSelectedSpot(spot)
    setMapCenter({ lat: spot.lat, lng: spot.lng })
    setMapZoom(16)
    setShowSearchResults(false)
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  // Apply filters to parking spots
  const applyFilters = async (filterSettings) => {
    try {
      const filteredSpots = await filterParkingSpots(filterSettings)
      setParkingSpots(filteredSpots)
    } catch (error) {
      console.error("Filter error:", error)
      setErrorMessage("Error applying filters")
    }
  }

  // Reset filters
  const resetFilters = async () => {
    const defaultFilters = {
      minPrice: 0,
      maxPrice: 1000,
      type: "all",
      covered: false,
      ev: false,
      minAvailable: 1,
    }
    setFilters(defaultFilters)

    // Reset to all parking spots
    const spots = await getParkingSpots()
    setParkingSpots(spots)
  }

  // Handle marker click
  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot)
  }

  // Close popup
  const handleClosePopup = () => {
    setSelectedSpot(null)
  }

  // Center map on user location
  const centerOnUserLocation = async () => {
    try {
      const location = await getUserLocation()
      setUserLocation(location)
      setMapCenter(location)
      setMapZoom(15)
    } catch (error) {
      console.error("Error getting location:", error)
      setErrorMessage("Unable to get your location")
    }
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full bg-muted rounded-md">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p>Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for parking spots..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pr-10 bg-background/90 backdrop-blur-sm"
              />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>

              {/* Search results dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <SearchResults
                  results={searchResults}
                  onSelect={handleSelectSearchResult}
                  onClose={() => setShowSearchResults(false)}
                />
              )}
            </div>

            <Button
              size="icon"
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Map controls */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={centerOnUserLocation}
              className="bg-background/90 backdrop-blur-sm"
            >
              <Compass className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setMapZoom(mapZoom + 1)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <span className="text-lg">+</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setMapZoom(mapZoom - 1)}
              className="bg-background/90 backdrop-blur-sm"
            >
              <span className="text-lg">-</span>
            </Button>
            <Button size="icon" variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <Layers className="h-4 w-4" />
            </Button>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="absolute top-16 left-4 right-4 z-10 bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
              <X className="h-4 w-4 cursor-pointer" onClick={() => setErrorMessage("")} />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Filter panel */}
          {showFilters && (
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={resetFilters}
              onClose={() => setShowFilters(false)}
            />
          )}

          {/* Map */}
          <MapComponent
            center={mapCenter || userLocation}
            zoom={mapZoom}
            parkingSpots={parkingSpots}
            userLocation={userLocation}
            selectedSpot={selectedSpot}
            onMarkerClick={handleMarkerClick}
            onPopupClose={handleClosePopup}
          />

          {/* Parking spot details popup */}
          {selectedSpot && (
            <div className="absolute bottom-4 left-4 right-16 z-10 max-w-md mx-auto">
              <ParkingSpotPopup spot={selectedSpot} onClose={handleClosePopup} userLocation={userLocation} />
            </div>
          )}

          {/* Parking spots count */}
          <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm shadow-md">
            Showing {parkingSpots.length} parking spots
          </div>
        </>
      )}
    </div>
  )
}

