import type React from "react"
import { MainNav } from "@/components/main-nav"
import { OfflineStatus } from "@/components/offline-status"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <MainNav />
      <div className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4">
          <OfflineStatus />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}

