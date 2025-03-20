import type { Metadata } from "next"
import { BookingsList } from "@/components/bookings-list"

export const metadata: Metadata = {
  title: "My Bookings - ParkEase",
  description: "Manage your parking bookings",
}

export default function BookingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your parking bookings</p>
      </div>

      <BookingsList />
    </div>
  )
}

