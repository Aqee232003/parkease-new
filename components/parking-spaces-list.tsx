"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Car, Clock, Edit, Trash, Eye } from "lucide-react"
import { useUser } from "@/components/user-provider"
import { motion } from "framer-motion"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ParkingSpace {
  id: string
  name: string
  address: string
  totalSpots: number
  availableSpots: number
  pricePerHour: number
  isActive: boolean
  image: string
  bookings: number
  revenue: number
  rating: number
}

export function ParkingSpacesList() {
  const { user } = useUser()
  const { toast } = useToast()
  const [spaces, setSpaces] = useState<ParkingSpace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [spaceToDelete, setSpaceToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load parking spaces
    async function loadSpaces() {
      try {
        // In a real app, you would fetch from your API
        // For demo purposes, we'll use sample data
        const sampleSpaces: ParkingSpace[] = [
          {
            id: "s1",
            name: "Downtown Secure Parking",
            address: "123 Main St, Downtown",
            totalSpots: 50,
            availableSpots: 15,
            pricePerHour: 60,
            isActive: true,
            image: "/images/parking/parking1.jpg",
            bookings: 120,
            revenue: 7200,
            rating: 4.5,
          },
          {
            id: "s2",
            name: "Central Mall Parking",
            address: "456 Market Ave, Central District",
            totalSpots: 100,
            availableSpots: 42,
            pricePerHour: 40,
            isActive: true,
            image: "/images/parking/parking2.jpg",
            bookings: 85,
            revenue: 3400,
            rating: 4.2,
          },
          {
            id: "s3",
            name: "Riverside Parking Lot",
            address: "789 River Rd, Riverside",
            totalSpots: 30,
            availableSpots: 0,
            pricePerHour: 50,
            isActive: false,
            image: "/images/parking/parking3.jpg",
            bookings: 45,
            revenue: 2250,
            rating: 3.8,
          },
        ]

        setSpaces(sampleSpaces)
      } catch (error) {
        console.error("Error loading parking spaces:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSpaces()
  }, [])

  const handleToggleActive = (id: string) => {
    setSpaces(spaces.map((space) => (space.id === id ? { ...space, isActive: !space.isActive } : space)))

    toast({
      title: "Status updated",
      description: `Parking space status has been updated.`,
    })
  }

  const handleDeleteSpace = () => {
    if (!spaceToDelete) return

    setSpaces(spaces.filter((space) => space.id !== spaceToDelete))
    setSpaceToDelete(null)

    toast({
      title: "Parking space deleted",
      description: "The parking space has been deleted successfully.",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Your Parking Spaces</h2>
          <p className="text-muted-foreground">You have {spaces.length} registered parking spaces</p>
        </div>
        <Button asChild>
          <Link href="/add-space">Add New Space</Link>
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <p>Loading your parking spaces...</p>
        </Card>
      ) : spaces.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {spaces.map((space) => (
            <motion.div key={space.id} variants={itemVariants}>
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={space.image || "/placeholder.svg?height=200&width=400"}
                    alt={space.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{space.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {space.address}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        space.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {space.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Spots</p>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1 text-primary" />
                        <p className="font-bold">{space.totalSpots}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Available</p>
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1 text-primary" />
                        <p className="font-bold">{space.availableSpots}</p>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-primary" />
                        <p className="font-bold">₹{space.pricePerHour}/hr</p>
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center">
                        <p className="font-bold">{space.rating.toFixed(1)}/5</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="font-bold">{space.bookings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="font-bold">₹{space.revenue}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/my-spaces/${space.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/my-spaces/${space.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Parking Space</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this parking space? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setSpaceToDelete(null)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => handleDeleteSpace()}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${space.id}`} className="mr-2">
                      {space.isActive ? "Active" : "Inactive"}
                    </Label>
                    <Switch
                      id={`active-${space.id}`}
                      checked={space.isActive}
                      onCheckedChange={() => handleToggleActive(space.id)}
                    />
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">You haven't registered any parking spaces yet</p>
          <Button className="mt-4" asChild>
            <Link href="/add-space">Register a Parking Space</Link>
          </Button>
        </Card>
      )}
    </div>
  )
}

