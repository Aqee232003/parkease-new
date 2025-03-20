"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Calendar, Star } from "lucide-react"
import { getUserBookings } from "@/lib/db"
import { useUser } from "@/components/user-provider"
import { motion } from "framer-motion"

export function ParkingDashboard() {
  const { user } = useUser()
  const [activeBookings, setActiveBookings] = useState([])
  const [pastBookings, setPastBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteSpot: "",
    upcomingBookings: 0,
  })

  useEffect(() => {
    // Load user bookings from IndexedDB
    async function loadBookings() {
      try {
        // In a real app, you would get the actual user ID
        const userId = user?.id || "123"
        const bookings = await getUserBookings(userId)

        // Check if bookings is an array before using forEach
        if (Array.isArray(bookings)) {
          // Split into active and past bookings
          const now = new Date()
          const active = []
          const past = []

          bookings.forEach((booking) => {
            const endTime = new Date(booking.endTime)
            if (endTime > now) {
              active.push(booking)
            } else {
              past.push(booking)
            }
          })

          setActiveBookings(active)
          setPastBookings(past)

          // Calculate stats
          setStats({
            totalBookings: active.length + past.length,
            totalSpent: past.reduce((total, booking) => total + booking.price, 0),
            favoriteSpot: "MG Road Parking",
            upcomingBookings: active.length,
          })
        } else {
          // If bookings is not an array, use sample data instead
          console.log("No bookings found or invalid data format, using sample data")
          // The rest of the function will use the sample data below
        }
      } catch (error) {
        console.error("Error loading bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [user])

  // Sample data for demo
  const sampleActiveBookings = [
    {
      id: "b1",
      spotName: "MG Road Parking",
      location: "MG Road, Bangalore",
      startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      endTime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
      price: 60,
      status: "active",
      image: "/images/parking/parking1.jpg",
    },
  ]

  const samplePastBookings = [
    {
      id: "b2",
      spotName: "Forum Mall Parking",
      location: "Koramangala, Bangalore",
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours duration
      price: 40,
      status: "completed",
      image: "/images/parking/parking2.jpg",
    },
    {
      id: "b3",
      spotName: "City Center Parking",
      location: "MG Road, Bangalore",
      startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
      price: 80,
      status: "completed",
      image: "/images/parking/parking3.jpg",
    },
  ]

  // Upcoming events
  const upcomingEvents = [
    {
      id: "e1",
      name: "Tech Conference",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      location: "Convention Center",
      parkingAvailable: true,
    },
    {
      id: "e2",
      name: "Music Festival",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: "City Park",
      parkingAvailable: true,
    },
  ]

  // Recommended spots
  const recommendedSpots = [
    {
      id: "r1",
      name: "Premium Central Parking",
      location: "Downtown",
      price: 50,
      rating: 4.8,
      distance: "0.5 km",
      image: "/images/parking/parking4.jpg",
    },
    {
      id: "r2",
      name: "Secure Parking Plus",
      location: "Business District",
      price: 45,
      rating: 4.6,
      distance: "1.2 km",
      image: "/images/parking/parking5.jpg",
    },
  ]

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || "User"}</h1>
          <p className="text-muted-foreground">Manage your parking experience</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/find-parking">Find Parking</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSpent}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Spot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteSpot}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active">Active Bookings</TabsTrigger>
          <TabsTrigger value="history">Booking History</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p>Loading your bookings...</p>
            </Card>
          ) : sampleActiveBookings.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {sampleActiveBookings.map((booking) => (
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

          {/* Upcoming Events */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events Near You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {event.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                      </span>
                    </div>
                    {event.parkingAvailable && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
                        Parking Available
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/find-parking">Book Parking</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p>Loading your booking history...</p>
            </Card>
          ) : samplePastBookings.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {samplePastBookings.map((booking) => (
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
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
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

          <div className="flex justify-center mt-4">
            <Button variant="outline" asChild>
              <Link href="/bookings">View All Booking History</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {recommendedSpots.map((spot) => (
              <motion.div key={spot.id} variants={itemVariants}>
                <Card className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={spot.image || "/placeholder.svg?height=200&width=400"}
                      alt={spot.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{spot.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {spot.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{spot.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">₹{spot.price}/hour</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{spot.distance}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/find-parking?spot=${spot.id}`}>Book Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" asChild>
              <Link href="/find-parking">Explore More Spots</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

