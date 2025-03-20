"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export function FilterPanel({ filters, onChange, onReset, onClose }) {
  // Handle price range change
  const handlePriceChange = (value) => {
    onChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  // Handle type change
  const handleTypeChange = (value) => {
    onChange({
      ...filters,
      type: value,
    })
  }

  // Handle switch changes
  const handleSwitchChange = (key, checked) => {
    onChange({
      ...filters,
      [key]: checked,
    })
  }

  // Handle available spots change
  const handleAvailableChange = (value) => {
    onChange({
      ...filters,
      minAvailable: value[0],
    })
  }

  return (
    <Card className="absolute top-16 right-4 z-10 w-80 shadow-lg">
      <CardHeader className="pb-2 relative">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        <CardTitle>Filter Parking Spots</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Price Range (₹)</Label>
            <span className="text-sm">
              {filters.minPrice} - {filters.maxPrice}
            </span>
          </div>
          <Slider
            defaultValue={[filters.minPrice, filters.maxPrice]}
            max={200}
            step={10}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Parking Type</Label>
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="indoor">Indoor</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Minimum Available Spots</Label>
          <div className="flex justify-between">
            <span className="text-sm">{filters.minAvailable}</span>
            <span className="text-sm">20+</span>
          </div>
          <Slider
            defaultValue={[filters.minAvailable]}
            max={20}
            step={1}
            onValueChange={handleAvailableChange}
            className="mt-2"
          />
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="covered" className="cursor-pointer">
              Covered Parking
            </Label>
            <Switch
              id="covered"
              checked={filters.covered}
              onCheckedChange={(checked) => handleSwitchChange("covered", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ev" className="cursor-pointer">
              EV Charging
            </Label>
            <Switch id="ev" checked={filters.ev} onCheckedChange={(checked) => handleSwitchChange("ev", checked)} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onClose}>Apply</Button>
      </CardFooter>
    </Card>
  )
}

