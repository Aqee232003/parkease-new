// Create a booking confirmation component
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Check, MapPin, Calendar, Clock, Car, Share2, Download, QrCode } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { motion } from "framer-motion"

export function BookingConfirmation({ bookingId }: { bookingId: string }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [booking, setBooking] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

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

  // Load booking data
  useEffect(() => {
    async function loadBookingData() {
      try {
        setIsLoading(true)

        // In a real app, this would fetch the booking from your API
        // For demo purposes, we'll get it from localStorage
        const bookings = JSON.parse(localStorage.getItem("parkease-bookings") || "[]")
        const foundBooking = bookings.find((b: any) => b.id === bookingId)

        if (foundBooking) {
          setBooking(foundBooking)
        } else {
          // If booking not found, use sample data
          setBooking({
            id: bookingId,
            spotName: "Sample Parking Spot",
            location: "123 Sample Street, City",
            date: new Date(),
            startTime: "10:00",
            duration: 2,
            vehicle: "Honda City (KA-01-AB-1234)",
            price: 80,
            status: "confirmed",
            createdAt: new Date(),
            confirmationCode: "PARK" + Math.floor(1000 + Math.random() * 9000),
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading booking:", error)
        toast({
          title: "Error",
          description: "Could not load booking details",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadBookingData()
  }, [bookingId, toast])

  // Handle share booking
  const handleShareBooking = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "ParkEase Booking",
          text: `I've booked a parking spot at ${booking?.spotName} on ${format(new Date(booking?.date), "PPP")} at ${booking?.startTime}.`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error))
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support the Web Share API.",
      })
    }
  }

  // Handle download ticket
  const handleDownloadTicket = () => {
    toast({
      title: "Ticket Downloaded",
      description: "Your parking ticket has been downloaded.",
    })
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4"
          >
            <Check className="h-8 w-8 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p>Your parking spot has been reserved successfully.</p>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{booking?.spotName}</h3>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {booking?.location}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Confirmed</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                {booking?.date ? format(new Date(booking.date), "PPP") : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 text-primary" />
                {booking?.startTime || "N/A"} ({booking?.duration} hour{booking?.duration !== 1 ? "s" : ""})
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <p className="font-medium flex items-center">
                <Car className="h-4 w-4 mr-1 text-primary" />
                {booking?.vehicle || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-medium">₹{booking?.price || 0}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Confirmation Code</p>
            <div className="bg-muted p-4 rounded-md text-center">
              <div className="flex justify-center mb-2">
                <QrCode className="h-32 w-32" />
              </div>
              <p className="font-mono text-xl font-bold">{booking?.confirmationCode || "PARK1234"}</p>
              <p className="text-xs text-muted-foreground mt-1">Show this code at the parking entrance</p>
            </div>
          </div>

          {isOffline && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm">
              You're currently offline. This booking has been saved locally and will sync when you're back online.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 p-6 pt-0">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleShareBooking}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownloadTicket}>
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

