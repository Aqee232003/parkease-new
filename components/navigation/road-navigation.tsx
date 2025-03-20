"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  MapPin,
  Navigation,
  LocateFixed,
  Car,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  AlertTriangle,
  Compass,
  Layers,
  Plus,
  Minus,
  Search,
} from "lucide-react"
import { getUserLocation, DEFAULT_LOCATION } from "@/lib/location"
import { MockMap } from "@/components/mock-map"
import { GPSFallback } from "@/components/location/gps-fallback"

interface NavigationProps {
  destination?: {
    lat: number
    lng: number
    name: string
  }
}

export function RoadNavigation({ destination }: NavigationProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION)
  const [destinationLocation, setDestinationLocation] = useState(
    destination || {
      lat: 12.9346,
      lng: 77.6146,
      name: "Forum Mall Parking",
    },
  )
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState("15 min")
  const [distance, setDistance] = useState("2.5 km")
  const [arrivalTime, setArrivalTime] = useState("10:45 AM")
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [showGPSFallback, setShowGPSFallback] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [mapZoom, setMapZoom] = useState(15)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const mapRef = useRef(null)

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

  // Initialize navigation
  useEffect(() => {
    async function initNavigation() {
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

        // Calculate estimated arrival time
        const now = new Date()
        const arrivalDate = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes from now
        setArrivalTime(arrivalDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing navigation:", error)
        setIsLoading(false)
      }
    }

    initNavigation()
  }, [])

  // Sample navigation steps
  const navigationSteps = [
    {
      instruction: "Head north on MG Road",
      distance: "500 m",
      time: "2 min",
      maneuver: "straight",
    },
    {
      instruction: "Turn right onto Brigade Road",
      distance: "800 m",
      time: "4 min",
      maneuver: "right",
    },
    {
      instruction: "Continue onto Residency Road",
      distance: "600 m",
      time: "3 min",
      maneuver: "straight",
    },
    {
      instruction: "Turn left onto Richmond Road",
      distance: "400 m",
      time: "2 min",
      maneuver: "left",
    },
    {
      instruction: "Arrive at Forum Mall Parking",
      distance: "0 m",
      time: "0 min",
      maneuver: "arrive",
    },
  ]

  // Handle start navigation
  const handleStartNavigation = () => {
    setIsNavigating(true)
    setCurrentStep(0)

    // Announce first step if voice is enabled
    if (voiceEnabled) {
      announceDirection(navigationSteps[0].instruction)
    }

    toast({
      title: "Navigation Started",
      description: `Navigating to ${destinationLocation.name}`,
    })
  }

  // Handle stop navigation
  const handleStopNavigation = () => {
    setIsNavigating(false)
    setCurrentStep(0)

    toast({
      title: "Navigation Stopped",
      description: "Navigation has been stopped",
    })
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Announce next step if voice is enabled
      if (voiceEnabled) {
        announceDirection(navigationSteps[nextStep].instruction)
      }
    } else {
      // Reached destination
      setIsNavigating(false)

      toast({
        title: "Destination Reached",
        description: `You have arrived at ${destinationLocation.name}`,
      })
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)

      // Announce previous step if voice is enabled
      if (voiceEnabled) {
        announceDirection(navigationSteps[prevStep].instruction)
      }
    }
  }

  // Toggle voice guidance
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled)

    toast({
      title: voiceEnabled ? "Voice Guidance Disabled" : "Voice Guidance Enabled",
      description: voiceEnabled ? "Voice instructions have been turned off" : "Voice instructions have been turned on",
    })
  }

  // Announce direction using speech synthesis
  const announceDirection = (instruction: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(instruction)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Handle location selected from GPS fallback
  const handleLocationSelected = (location) => {
    setUserLocation(location)
    setShowGPSFallback(false)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    // Mock search results
    const results = [
      {
        id: "1",
        name: "MG Road Parking",
        address: "MG Road, Bangalore",
        lat: 12.9747,
        lng: 77.6138,
      },
      {
        id: "2",
        name: "Forum Mall Parking",
        address: "Koramangala, Bangalore",
        lat: 12.9346,
        lng: 77.6146,
      },
      {
        id: "3",
        name: "Cubbon Park Parking",
        address: "Cubbon Park, Bangalore",
        lat: 12.9763,
        lng: 77.5929,
      },
    ].filter(
      (result) =>
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.address.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)
    setShowSearchResults(true)
  }

  // Handle search result selection
  const handleSelectSearchResult = (result) => {
    setDestinationLocation({
      lat: result.lat,
      lng: result.lng,
      name: result.name,
    })
    setSearchResults([])
    setShowSearchResults(false)
    setSearchQuery("")

    toast({
      title: "Destination Set",
      description: `Destination set to ${result.name}`,
    })
  }

  // Get maneuver icon
  const getManeuverIcon = (maneuver: string) => {
    switch (maneuver) {
      case "straight":
        return <ArrowRight className="h-6 w-6" />
      case "right":
        return <ChevronRight className="h-6 w-6" />
      case "left":
        return <ChevronLeft className="h-6 w-6" />
      case "arrive":
        return <MapPin className="h-6 w-6" />
      default:
        return <Navigation className="h-6 w-6" />
    }
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
                  <CardTitle>Navigation</CardTitle>
                  <CardDescription>
                    {isNavigating ? `Navigating to ${destinationLocation.name}` : "Find your way to your parking spot"}
                  </CardDescription>
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
              {/* Search destination */}
              {!isNavigating && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for a destination..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />

                    {/* Search results */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
                            onClick={() => handleSelectSearchResult(result)}
                          >
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-muted-foreground">{result.address}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="font-medium">{destinationLocation.name}</p>
                        <p className="text-sm text-muted-foreground">Destination</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowGPSFallback(true)}>
                      Change
                    </Button>
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

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{distance}</p>
                    </div>
                    <div className="p-3 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{estimatedTime}</p>
                    </div>
                    <div className="p-3 border rounded-md text-center">
                      <p className="text-sm text-muted-foreground">Arrival</p>
                      <p className="font-medium">{arrivalTime}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation in progress */}
              {isNavigating && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated arrival</p>
                      <p className="font-medium">{arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="font-medium">{estimatedTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{distance}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getManeuverIcon(navigationSteps[currentStep].maneuver)}
                        <div className="ml-3">
                          <p className="font-medium text-lg">{navigationSteps[currentStep].instruction}</p>
                          <p className="text-sm text-muted-foreground">
                            {navigationSteps[currentStep].distance} • {navigationSteps[currentStep].time}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={toggleVoice}>
                        {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextStep}
                      disabled={currentStep === navigationSteps.length - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="h-64 rounded-md overflow-hidden border relative">
                <MockMap
                  width={600}
                  height={256}
                  userLocation={userLocation}
                  parkingSpots={[
                    {
                      x: 0.75,
                      y: 0.75,
                      available: true,
                    },
                  ]}
                />

                {/* Map controls */}
                <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/90 backdrop-blur-sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/90 backdrop-blur-sm">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/90 backdrop-blur-sm">
                    <Layers className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/90 backdrop-blur-sm">
                    <Compass className="h-4 w-4" />
                  </Button>
                </div>

                {/* Traffic alert */}
                {isNavigating && (
                  <div className="absolute top-2 left-2 right-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-3 py-2 rounded-md text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>Moderate traffic ahead on Brigade Road</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {isNavigating ? (
                <Button variant="destructive" className="w-full" onClick={handleStopNavigation}>
                  Stop Navigation
                </Button>
              ) : (
                <Button className="w-full" onClick={handleStartNavigation}>
                  Start Navigation
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Navigation Options */}
          {!isNavigating && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Navigation Options</CardTitle>
                <CardDescription>Customize your navigation experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="car">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="car">Car</TabsTrigger>
                    <TabsTrigger value="bike">Bike</TabsTrigger>
                    <TabsTrigger value="walk">Walk</TabsTrigger>
                  </TabsList>
                  <TabsContent value="car" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <p className="font-medium">Fastest Route</p>
                          <p className="text-sm text-muted-foreground">
                            {estimatedTime} • {distance}
                          </p>
                        </div>
                      </div>
                      <Badge>Recommended</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <p className="font-medium">Alternative Route</p>
                          <p className="text-sm text-muted-foreground">18 min • 3.2 km</p>
                        </div>
                      </div>
                      <Badge variant="outline">Less Traffic</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="bike" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <p className="font-medium">Bike Route</p>
                          <p className="text-sm text-muted-foreground">20 min • 2.8 km</p>
                        </div>
                      </div>
                      <Badge>Recommended</Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="walk" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <p className="font-medium">Walking Route</p>
                          <p className="text-sm text-muted-foreground">35 min • 2.5 km</p>
                        </div>
                      </div>
                      <Badge>Recommended</Badge>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Navigation History */}
          {!isNavigating && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Destinations</CardTitle>
                <CardDescription>Quickly navigate to recent places</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">MG Road Parking</p>
                      <p className="text-sm text-muted-foreground">2.5 km away</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">Cubbon Park Parking</p>
                      <p className="text-sm text-muted-foreground">3.8 km away</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="font-medium">Orion Mall Parking</p>
                      <p className="text-sm text-muted-foreground">7.2 km away</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

