import type { Metadata } from "next"
import { AddParkingSpaceForm } from "@/components/add-parking-space-form"

export const metadata: Metadata = {
  title: "Add Parking Space - ParkEase",
  description: "Register a new parking space",
}

export default function AddSpacePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Add Parking Space</h1>
        <p className="text-muted-foreground">Register a new parking space on ParkEase</p>
      </div>

      <AddParkingSpaceForm />
    </div>
  )
}

