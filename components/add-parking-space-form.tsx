"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Upload, Plus, Minus, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AddParkingSpaceForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    totalSpots: 1,
    pricePerHour: 0,
    parkingType: "outdoor",
    hasEVCharging: false,
    hasCCTV: false,
    hasAttendant: false,
    isHandicapAccessible: false,
    isCovered: false,
    operatingHours: {
      monday: { open: "00:00", close: "23:59", isOpen24Hours: true },
      tuesday: { open: "00:00", close: "23:59", isOpen24Hours: true },
      wednesday: { open: "00:00", close: "23:59", isOpen24Hours: true },
      thursday: { open: "00:00", close: "23:59", isOpen24Hours: true },
      friday: { open: "00:00", close: "23:59", isOpen24Hours: true },
      saturday: { open: "00:00", close: "23:59", isOpen24Hours: true },
      sunday: { open: "00:00", close: "23:59", isOpen24Hours: true },
    },
  })
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setImages((prev) => [...prev, ...filesArray])

      // Create preview URLs
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleOperatingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would call your API to save the parking space
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Parking space added",
        description: "Your parking space has been registered successfully.",
      })

      router.push("/my-spaces")
    } catch (error) {
      console.error("Error adding parking space:", error)
      toast({
        title: "Error",
        description: "There was an error adding your parking space. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Your Parking Space</CardTitle>
        <CardDescription>Fill in the details below to register your parking space on ParkEase</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  1
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Step {currentStep} of 3</div>
            </div>
          </div>

          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Parking Space Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown Secure Parking"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full address of your parking space"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your parking space, including any special features or instructions"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalSpots">Total Parking Spots</Label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData((prev) => ({ ...prev, totalSpots: Math.max(1, prev.totalSpots - 1) }))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="totalSpots"
                      name="totalSpots"
                      type="number"
                      min="1"
                      value={formData.totalSpots}
                      onChange={handleInputChange}
                      className="mx-2 text-center"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData((prev) => ({ ...prev, totalSpots: prev.totalSpots + 1 }))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Price Per Hour (₹)</Label>
                  <Input
                    id="pricePerHour"
                    name="pricePerHour"
                    type="number"
                    min="0"
                    step="5"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parkingType">Parking Type</Label>
                <Select
                  value={formData.parkingType}
                  onValueChange={(value) => handleSelectChange("parkingType", value)}
                >
                  <SelectTrigger id="parkingType">
                    <SelectValue placeholder="Select parking type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="underground">Underground</SelectItem>
                    <SelectItem value="rooftop">Rooftop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Amenities & Features</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hasEVCharging">EV Charging</Label>
                    <p className="text-sm text-muted-foreground">Electric vehicle charging stations available</p>
                  </div>
                  <Switch
                    id="hasEVCharging"
                    checked={formData.hasEVCharging}
                    onCheckedChange={(checked) => handleSwitchChange("hasEVCharging", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hasCCTV">CCTV Surveillance</Label>
                    <p className="text-sm text-muted-foreground">Security cameras monitoring the parking area</p>
                  </div>
                  <Switch
                    id="hasCCTV"
                    checked={formData.hasCCTV}
                    onCheckedChange={(checked) => handleSwitchChange("hasCCTV", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hasAttendant">Parking Attendant</Label>
                    <p className="text-sm text-muted-foreground">Staff available to assist with parking</p>
                  </div>
                  <Switch
                    id="hasAttendant"
                    checked={formData.hasAttendant}
                    onCheckedChange={(checked) => handleSwitchChange("hasAttendant", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isHandicapAccessible">Handicap Accessible</Label>
                    <p className="text-sm text-muted-foreground">Accessible parking spots available</p>
                  </div>
                  <Switch
                    id="isHandicapAccessible"
                    checked={formData.isHandicapAccessible}
                    onCheckedChange={(checked) => handleSwitchChange("isHandicapAccessible", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isCovered">Covered Parking</Label>
                    <p className="text-sm text-muted-foreground">Protection from sun and rain</p>
                  </div>
                  <Switch
                    id="isCovered"
                    checked={formData.isCovered}
                    onCheckedChange={(checked) => handleSwitchChange("isCovered", checked)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Operating Hours</h3>

                <Tabs defaultValue="monday">
                  <TabsList className="grid grid-cols-7">
                    <TabsTrigger value="monday">Mon</TabsTrigger>
                    <TabsTrigger value="tuesday">Tue</TabsTrigger>
                    <TabsTrigger value="wednesday">Wed</TabsTrigger>
                    <TabsTrigger value="thursday">Thu</TabsTrigger>
                    <TabsTrigger value="friday">Fri</TabsTrigger>
                    <TabsTrigger value="saturday">Sat</TabsTrigger>
                    <TabsTrigger value="sunday">Sun</TabsTrigger>
                  </TabsList>

                  {Object.keys(formData.operatingHours).map((day) => (
                    <TabsContent key={day} value={day} className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${day}-24hours`}>Open 24 Hours</Label>
                        <Switch
                          id={`${day}-24hours`}
                          checked={formData.operatingHours[day].isOpen24Hours}
                          onCheckedChange={(checked) => handleOperatingHoursChange(day, "isOpen24Hours", checked)}
                        />
                      </div>

                      {!formData.operatingHours[day].isOpen24Hours && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${day}-open`}>Opening Time</Label>
                            <Input
                              id={`${day}-open`}
                              type="time"
                              value={formData.operatingHours[day].open}
                              onChange={(e) => handleOperatingHoursChange(day, "open", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${day}-close`}>Closing Time</Label>
                            <Input
                              id={`${day}-close`}
                              type="time"
                              value={formData.operatingHours[day].close}
                              onChange={(e) => handleOperatingHoursChange(day, "close", e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload Photos</h3>
                <p className="text-sm text-muted-foreground">
                  Upload photos of your parking space to help users find it easily. You can upload up to 5 photos.
                </p>

                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your photos here, or click to browse
                  </p>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Image previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative h-24 rounded-md overflow-hidden border">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}

            {currentStep < 3 ? (
              <Button type="button" className="ml-auto" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register Parking Space"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

