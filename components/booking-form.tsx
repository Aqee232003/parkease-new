// Create a booking form component
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, MapPin, AlertTriangle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getParkingSpot } from "@/lib/db"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/user-provider"
import { showOfflineToast } from "@/components/ui/offline-toast"

export function BookingForm({ spotId }: { spotId: string }) {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [parkingSpot, setParkingSpot] = useState<any>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState("10:00")
  const [duration, setDuration] = useState(2)
  const [vehicle, setVehicle] = useState("")
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [totalPrice, setTotalPrice] = useState(0)

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

  // Load parking spot data
  useEffect(() => {
    async function loadSpotData() {
      try {
        setIsLoading(true)
        const spot = await getParkingSpot(spotId)

        if (spot) {
          setParkingSpot(spot)
          // Calculate initial price
          setTotalPrice(spot.price * duration)
        } else {
          // If spot not found in IndexedDB, use sample data
          const sampleSpot = {
            id: spotId,
            name: "Sample Parking Spot",
            address: "123 Sample Street, City",
            description: "This is a sample parking spot for demonstration purposes.",
            price: 40,
            priceUnit: "hour",
            currency: "₹",
            totalSpots: 50,
            availableSpots: 20,
            type: "indoor",
            security: true,
            cctv: true,
            covered: true,
            handicapped: true,
            ev: true,
            hours: "24/7",
            rating: 4.5,
            reviews: 120,
          }
          setParkingSpot(sampleSpot)
          setTotalPrice(sampleSpot.price * duration)

          if (isOffline) {
            showOfflineToast({
              type: "data-sync",
              status: "success",
              message: "Using cached parking data while offline",
            })
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading parking spot:", error)
        toast({
          title: "Error",
          description: "Could not load parking spot data",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadSpotData()
  }, [spotId, isOffline, toast, duration])

  // Sample vehicles
  const vehicles = [
    { id: "v1", name: "Honda City (KA-01-AB-1234)" },
    { id: "v2", name: "Hyundai i20 (KA-01-CD-5678)" },
  ]

  // Handle duration change
  const handleDurationChange = (value: string) => {
    const newDuration = Number.parseInt(value, 10)
    setDuration(newDuration)
    if (parkingSpot) {
      setTotalPrice(parkingSpot.price * newDuration)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!parkingSpot) return

    setIsSubmitting(true)

    try {
      // Create booking object
      const booking = {
        id: `booking-${Date.now()}`,
        userId: user?.id || "guest",
        spotId: parkingSpot.id,
        spotName: parkingSpot.name,
        location: parkingSpot.address,
        date: date,
        startTime: startTime,
        duration: duration,
        vehicle: vehicle,
        price: totalPrice,
        status: "confirmed",
        createdAt: new Date(),
      }

      // In a real app, this would call your API to create the booking
      // For demo purposes, we'll just simulate a successful booking
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store booking in localStorage for demo purposes
      const existingBookings = JSON.parse(localStorage.getItem("parkease-bookings") || "[]")
      localStorage.setItem("parkease-bookings", JSON.stringify([...existingBookings, booking]))

      if (isOffline) {
        showOfflineToast({
          type: "booking",
          status: "pending",
          message: "Booking saved offline. Will sync when online.",
        })
      } else {
        toast({
          title: "Booking Confirmed",
          description: `Your booking at ${parkingSpot.name} has been confirmed.`,
        })
      }

      // Navigate to confirmation page
      router.push(`/booking/confirmation/${booking.id}`)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading booking details...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{parkingSpot?.name || "Parking Spot"}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {parkingSpot?.address || "Address not available"}
            </CardDescription>
          </div>
          {isOffline && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
              Offline Mode
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Select value={duration.toString()} onValueChange={handleDurationChange}>
                <SelectTrigger id="duration" className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="5">5 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger id="vehicle" className="w-full">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other Vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {vehicle === "other" && (
            <div className="space-y-2">
              <Label htmlFor="vehicleDetails">Vehicle Details</Label>
              <Input id="vehicleDetails" placeholder="Enter vehicle make, model, and license plate" />
            </div>
          )}

          <div className="bg-muted p-4 rounded-md space-y-2 mt-6">
            <h3 className="font-medium">Booking Summary</h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Date:</div>
              <div>{format(date, "PPP")}</div>

              <div className="text-muted-foreground">Time:</div>
              <div>{startTime}</div>

              <div className="text-muted-foreground">Duration:</div>
              <div>
                {duration} hour{duration !== 1 ? "s" : ""}
              </div>

              <div className="text-muted-foreground">Rate:</div>
              <div>
                {parkingSpot?.currency || "₹"}
                {parkingSpot?.price || 0}/{parkingSpot?.priceUnit || "hour"}
              </div>

              <div className="text-muted-foreground font-medium">Total:</div>
              <div className="font-bold">
                {parkingSpot?.currency || "₹"}
                {totalPrice}
              </div>
            </div>

            {isOffline && (
              <div className="mt-4 flex items-start gap-2 p-2 bg-amber-50 text-amber-800 rounded-md">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">
                  You're currently offline. Your booking will be saved locally and synced when you're back online.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select defaultValue="later">
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="later">Pay Later (at venue)</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              For offline bookings, you can pay when you arrive at the parking spot.
            </p>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

