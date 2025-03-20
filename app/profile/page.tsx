import type { Metadata } from "next"
import { EnhancedProfileCard } from "@/components/enhanced-profile-card"

export const metadata: Metadata = {
  title: "Profile - ParkEase",
  description: "Manage your profile settings",
}

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <EnhancedProfileCard />
    </div>
  )
}

