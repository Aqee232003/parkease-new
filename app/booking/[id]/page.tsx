// Create a booking page for individual parking spots
import type { Metadata } from "next"
import { BookingForm } from "@/components/booking-form"

export const metadata: Metadata = {
  title: "Book Parking - ParkEase",
  description: "Book your parking spot",
}

export default function BookingPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Book Parking</h1>
        <p className="text-muted-foreground">Complete your booking details</p>
      </div>

      <BookingForm spotId={params.id} />
    </div>
  )
}

