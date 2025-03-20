import { ParkingDashboard } from "@/components/parking-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - ParkEase",
  description: "Manage your parking experience",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <ParkingDashboard />
    </div>
  )
}

