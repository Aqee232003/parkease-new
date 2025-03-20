import type { Metadata } from "next"
import { RoadNavigation } from "@/components/navigation/road-navigation"

export const metadata: Metadata = {
  title: "Navigation - ParkEase",
  description: "Navigate to your parking spot",
}

export default function NavigationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Navigation</h1>
        <p className="text-muted-foreground">Find your way to your parking destination</p>
      </div>

      <RoadNavigation />
    </div>
  )
}

