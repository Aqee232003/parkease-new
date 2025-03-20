"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Calendar, Star } from "lucide-react"
import { getUserBookings } from "@/lib/db"
import { useUser } from "@/components/user-provider"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function BookingsList() {
  const { user } = useUser()
  const { toast } = useToast()
  const [activeBookings, setActiveBookings] = useState([])
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [pastBookings, setPastBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)

  useEffect(() => {
    // Load user bookings from IndexedDB
    async function loadBookings() {
      try {
        // In a real app, you would get the actual user ID
        const userId = user?.id || "123"
        const bookings = await getUserBookings(userId)

        // Split into active, upcoming and past bookings
        const now = new Date()
        const active = []
        const upcoming = []
        const past = []

        // For demo purposes, we'll use sample data
        // Active bookings (currently in use)
        active.push({
          id: "b1",
          spotName: "MG Road Parking",
          location: "MG Road, Bangalore",
          startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          endTime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
          price: 60,
          status: "active",
          image: "/images/parking/parking1.jpg",
        })

        // Upcoming bookings (reserved for future)
        upcoming.push({
          id: "b4",
          spotName: "Premium Central Parking",
          location: "Downtown",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
          price: 50,
          status: "upcoming",
          image: "/images/parking/parking4.jpg",
        })

        upcoming.push({
          id: "b5",
          spotName: "Secure Parking Plus",
          location: "Business District",
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
          price: 45,
          status: "upcoming",
          image: "/images/parking/parking5.jpg",
        })

        // Past bookings
        past.push({
          id: "b2",
          spotName: "Forum Mall Parking",
          location: "Koramangala, Bangalore",
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
          price: 40,
          status: "completed",
          image: "/images/parking/parking2.jpg",
          reviewed: false,
        })

        past.push({
          id: "b3",
          spotName: "City Center Parking",
          location: "MG Road, Bangalore",
          startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
          price: 80,
          status: "completed",
          image: "/images/parking/parking3.jpg",
          reviewed: true,
        })

        setActiveBookings(active)
        setUpcomingBookings(upcoming)
        setPastBookings(past)
      } catch (error) {
        console.error("Error loading bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [user])

  const handleSubmitReview = (bookingId) => {
    // In a real app, this would submit the review to your backend
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })

    // Update the booking to mark it as reviewed
    setPastBookings(
      pastBookings.map((booking) => (booking.id === bookingId ? { ...booking, reviewed: true } : booking)),
    )

    setReviewText("")
    setReviewRating(5)
  }

  const handleCancelBooking = (bookingId) => {
    // In a real app, this would call your API to cancel the booking
    toast({
      title: "Booking cancelled",
      description: "Your booking has been cancelled successfully.",
    })

    // Remove the booking from the list
    setUpcomingBookings(upcomingBookings.filter((booking) => booking.id !== bookingId))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <Tabs defaultValue="active">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p>Loading your bookings...</p>
          </Card>
        ) : activeBookings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {activeBookings.map((booking) => (
              <motion.div key={booking.id} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={booking.image || "/placeholder.svg?height=200&width=400"}
                      alt={booking.spotName}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.spotName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Start Time:
                        </span>
                        <span className="font-medium">
                          {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> End Time:
                        </span>
                        <span className="font-medium">
                          {booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">₹{booking.price}</span>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Time Remaining</p>
                            <p className="text-xl font-bold text-primary">1h 30m</p>
                          </div>
                          <Button>Extend Time</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/bookings/${booking.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/navigation?lat=${Math.random()}&lng=${Math.random()}`}>Navigate</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You have no active bookings</p>
            <Button className="mt-4" asChild>
              <Link href="/find-parking">Find Parking</Link>
            </Button>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p>Loading your bookings...</p>
          </Card>
        ) : upcomingBookings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {upcomingBookings.map((booking) => (
              <motion.div key={booking.id} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={booking.image || "/placeholder.svg?height=200&width=400"}
                      alt={booking.spotName}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.spotName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
                        Upcoming
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> Date:
                        </span>
                        <span className="font-medium">{booking.startTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Time:
                        </span>
                        <span className="font-medium">
                          {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">₹{booking.price}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/bookings/${booking.id}`}>View Details</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)}>
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You have no upcoming bookings</p>
            <Button className="mt-4" asChild>
              <Link href="/find-parking">Find Parking</Link>
            </Button>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p>Loading your bookings...</p>
          </Card>
        ) : pastBookings.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {pastBookings.map((booking) => (
              <motion.div key={booking.id} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={booking.image || "/placeholder.svg?height=200&width=400"}
                      alt={booking.spotName}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.spotName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{booking.startTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">
                          {Math.round((booking.endTime - booking.startTime) / (60 * 60 * 1000))} hours
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">₹{booking.price}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>

                    {booking.reviewed ? (
                      <Badge variant="outline" className="ml-2">
                        Reviewed
                      </Badge>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Leave Review</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Review your parking experience</DialogTitle>
                            <DialogDescription>Share your experience at {booking.spotName}</DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div className="flex items-center justify-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-8 w-8 ${star <= reviewRating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                  />
                                </button>
                              ))}
                            </div>

                            <Textarea
                              placeholder="Tell us about your experience..."
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              rows={4}
                            />
                          </div>

                          <DialogFooter>
                            <Button onClick={() => handleSubmitReview(booking.id)}>Submit Review</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You have no past bookings</p>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}

