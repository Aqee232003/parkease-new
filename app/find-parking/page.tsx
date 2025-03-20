import type { Metadata } from "next"
import { EnhancedParkingMap } from "@/components/map/enhanced-parking-map"
import { LazyLoad } from "@/components/ui/lazy-load"
import { ParkingDistanceLocator } from "@/components/parking-distance-locator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Find Parking - ParkEase",
  description: "Find and book parking spots near you",
}

export default function FindParkingPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Find Parking</h1>
        <p className="text-muted-foreground">Discover available parking spots near you</p>
      </div>

      <Tabs defaultValue="map">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <div className="h-[calc(100vh-12rem)] rounded-lg overflow-hidden border">
            <LazyLoad height="100%">
              <EnhancedParkingMap />
            </LazyLoad>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <ParkingDistanceLocator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

