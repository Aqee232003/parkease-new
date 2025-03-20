// Create a booking confirmation page
import type { Metadata } from "next"
import { BookingConfirmation } from "@/components/booking-confirmation"

export const metadata: Metadata = {
  title: "Booking Confirmation - ParkEase",
  description: "Your parking booking is confirmed",
}

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Booking Confirmation</h1>
        <p className="text-muted-foreground">Your parking booking has been confirmed</p>
      </div>

      <BookingConfirmation bookingId={params.id} />
    </div>
  )
}

