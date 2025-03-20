"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/components/user-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Car,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  Star,
  Award,
  Zap,
  Settings,
  Edit,
  LogOut,
  Upload,
} from "lucide-react"

export function EnhancedProfileCard() {
  const { user, logout } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteSpot: "",
    upcomingBookings: 0,
    loyaltyPoints: 0,
    memberSince: new Date(),
    premiumUntil: null as Date | null,
    savedVehicles: [] as any[],
    recentBookings: [] as any[],
    savedLocations: [] as any[],
  })

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true)

        // In a real app, this would fetch from your API
        // For demo purposes, we'll use sample data

        // Get bookings from localStorage
        const bookings = JSON.parse(localStorage.getItem("parkease-bookings") || "[]")

        // Get vehicles from localStorage
        const vehicles = JSON.parse(localStorage.getItem("parkease-vehicles") || "[]")

        // Get favorite locations from localStorage
        const favorites = JSON.parse(localStorage.getItem("parkease-favorites") || "[]")

        // Calculate stats
        const totalBookings = bookings.length
        const totalSpent = bookings.reduce((total: number, booking: any) => total + booking.price, 0)

        // Get favorite spot (most booked)
        const spotCounts: Record<string, number> = {}
        bookings.forEach((booking: any) => {
          spotCounts[booking.spotName] = (spotCounts[booking.spotName] || 0) + 1
        })

        let favoriteSpot = ""
        let maxCount = 0
        for (const spot in spotCounts) {
          if (spotCounts[spot] > maxCount) {
            maxCount = spotCounts[spot]
            favoriteSpot = spot
          }
        }

        // Get upcoming bookings
        const now = new Date()
        const upcomingBookings = bookings.filter((booking: any) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= now
        }).length

        // Calculate loyalty points (10 per booking)
        const loyaltyPoints = totalBookings * 10

        // Get member since date
        const memberSince = user?.createdAt || new Date()

        // Get premium until date
        const premiumUntil = user?.premiumUntil || null

        // Get recent bookings (last 3)
        const recentBookings = bookings.slice(0, 3)

        // Get saved locations
        const savedLocations = favorites.map((id: string) => ({
          id,
          name: `Parking Location ${id}`,
          address: "Sample Address",
        }))

        setStats({
          totalBookings,
          totalSpent,
          favoriteSpot,
          upcomingBookings,
          loyaltyPoints,
          memberSince,
          premiumUntil,
          savedVehicles: vehicles,
          recentBookings,
          savedLocations,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading user data:", error)
        setIsLoading(false)
      }
    }

    if (user) {
      loadUserData()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload the image
    toast({
      title: "Feature not available",
      description: "Avatar upload is not available in this demo",
    })
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

  // Sample data for demo
  const sampleVehicles = [
    {
      id: "v1",
      name: "Honda City",
      licensePlate: "KA-01-AB-1234",
      type: "Sedan",
      isDefault: true,
    },
    {
      id: "v2",
      name: "Hyundai i20",
      licensePlate: "KA-01-CD-5678",
      type: "Hatchback",
      isDefault: false,
    },
  ]

  const sampleLocations = [
    {
      id: "l1",
      name: "Office Parking",
      address: "123 Work Street, Business District",
      isFavorite: true,
    },
    {
      id: "l2",
      name: "Mall Parking",
      address: "456 Shopping Avenue, Central Area",
      isFavorite: true,
    },
    {
      id: "l3",
      name: "Home Parking",
      address: "789 Residential Lane, Suburb Area",
      isFavorite: true,
    },
  ]

  const sampleBookings = [
    {
      id: "b1",
      spotName: "MG Road Parking",
      location: "MG Road, Bangalore",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 2, // hours
      price: 60,
      status: "upcoming",
    },
    {
      id: "b2",
      spotName: "Forum Mall Parking",
      location: "Koramangala, Bangalore",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      duration: 3, // hours
      price: 90,
      status: "completed",
    },
    {
      id: "b3",
      spotName: "City Center Parking",
      location: "MG Road, Bangalore",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      duration: 1, // hours
      price: 30,
      status: "completed",
    },
  ]

  // Calculate loyalty tier
  const getLoyaltyTier = (points: number) => {
    if (points >= 500) return { name: "Platinum", color: "bg-gradient-to-r from-gray-400 to-gray-200", progress: 100 }
    if (points >= 300) return { name: "Gold", color: "bg-gradient-to-r from-yellow-500 to-yellow-300", progress: 60 }
    if (points >= 100) return { name: "Silver", color: "bg-gradient-to-r from-gray-300 to-gray-100", progress: 30 }
    return { name: "Bronze", color: "bg-gradient-to-r from-amber-700 to-amber-500", progress: 10 }
  }

  const loyaltyTier = getLoyaltyTier(stats.loyaltyPoints)

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Main Profile Card */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={handleAvatarUpload}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative px-6">
            <div className="absolute -top-16">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={user?.avatar || "/placeholder.svg?height=128&width=128"} alt={user?.name || "User"} />
                <AvatarFallback className="text-4xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="pt-20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
                <p className="text-muted-foreground">{user?.email || "user@example.com"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="capitalize">{user?.role || "user"}</Badge>
                  {user?.role === "premium" && (
                    <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600">Premium</Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Member since {stats.memberSince.toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : sampleBookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{isLoading ? "-" : sampleBookings.reduce((total, booking) => total + booking.price, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Spot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "-" : "MG Road Parking"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "-" : sampleBookings.filter((b) => b.status === "upcoming").length}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loyalty Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Loyalty Program
            </CardTitle>
            <CardDescription>Earn points with every booking and unlock rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <div className="flex items-center">
                  <Badge className={`mr-2 ${loyaltyTier.color}`}>{loyaltyTier.name}</Badge>
                  <span className="text-lg font-bold">{stats.loyaltyPoints} points</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/rewards">View Rewards</Link>
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress to next tier</span>
                <span>
                  {stats.loyaltyPoints}/
                  {loyaltyTier.name === "Bronze"
                    ? "100"
                    : loyaltyTier.name === "Silver"
                      ? "300"
                      : loyaltyTier.name === "Gold"
                        ? "500"
                        : "Max"}
                </span>
              </div>
              <Progress value={loyaltyTier.progress} className="h-2" />
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">How to earn more points:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-primary" />
                  Book parking spots (+10 points per booking)
                </li>
                <li className="flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-primary" />
                  Refer friends (+50 points per referral)
                </li>
                <li className="flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-primary" />
                  Complete your profile (+20 points)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="vehicles">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="locations">Saved Locations</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Your Vehicles</h3>
              <Button size="sm" asChild>
                <Link href="/profile/add-vehicle">Add Vehicle</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {sampleVehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {vehicle.isDefault && <Badge>Default</Badge>}
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Saved Locations Tab */}
          <TabsContent value="locations" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Saved Locations</h3>
              <Button size="sm" asChild>
                <Link href="/profile/add-location">Add Location</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {sampleLocations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {location.isFavorite && <Badge variant="outline">Favorite</Badge>}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/find-parking?location=${location.id}`}>
                          <MapPin className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recent Bookings</h3>
              <Button size="sm" asChild>
                <Link href="/bookings">View All</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {sampleBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.spotName}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.location}
                        </p>
                        <div className="flex items-center mt-1 text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground mr-2">{booking.date.toLocaleDateString()}</span>
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{booking.duration} hours</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge
                          className={
                            booking.status === "upcoming"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          }
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <p className="font-medium mt-1">₹{booking.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/profile/password">
                      <Settings className="h-4 w-4 mr-2" />
                      Change Password
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/profile/notifications">
                      <Settings className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/profile/payment-methods">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Link>
                  </Button>
                </div>

                {user?.role !== "premium" && (
                  <div className="mt-4 p-4 border rounded-md bg-primary/5">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-primary" />
                      Upgrade to Premium
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get exclusive benefits like priority booking, discounted rates, and more.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600" asChild>
                      <Link href="/premium">Upgrade Now</Link>
                    </Button>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

