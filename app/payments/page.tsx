import type { Metadata } from "next"
import { PaymentsList } from "@/components/payments-list"

export const metadata: Metadata = {
  title: "Payments - ParkEase",
  description: "Manage your parking payments",
}

export default function PaymentsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">View and manage your payment history</p>
      </div>

      <PaymentsList />
    </div>
  )
}

