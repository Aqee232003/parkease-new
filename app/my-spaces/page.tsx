import type { Metadata } from "next"
import { ParkingSpacesList } from "@/components/parking-spaces-list"

export const metadata: Metadata = {
  title: "My Spaces - ParkEase",
  description: "Manage your parking spaces",
}

export default function MySpacesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Parking Spaces</h1>
        <p className="text-muted-foreground">Manage your registered parking spaces</p>
      </div>

      <ParkingSpacesList />
    </div>
  )
}

