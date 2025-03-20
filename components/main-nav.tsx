"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Car,
  CreditCard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Building,
  BarChart,
  Users,
  PlusSquare,
} from "lucide-react"
import { useUser } from "@/components/user-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: string[]
}

export function MainNav() {
  const pathname = usePathname()
  const { user, logout, hasRole } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Find Parking",
      href: "/find-parking",
      icon: <Car className="h-5 w-5" />,
      roles: ["user", "premium", "admin"],
    },
    {
      title: "My Bookings",
      href: "/bookings",
      icon: <Car className="h-5 w-5" />,
      roles: ["user", "premium", "admin"],
    },
    {
      title: "Payments",
      href: "/payments",
      icon: <CreditCard className="h-5 w-5" />,
      roles: ["user", "premium", "admin"],
    },
    {
      title: "My Spaces",
      href: "/my-spaces",
      icon: <Building className="h-5 w-5" />,
      roles: ["owner", "admin"],
    },
    {
      title: "Add Space",
      href: "/add-space",
      icon: <PlusSquare className="h-5 w-5" />,
      roles: ["owner", "admin"],
    },
    {
      title: "Owner Dashboard",
      href: "/owner-dashboard",
      icon: <BarChart className="h-5 w-5" />,
      roles: ["owner", "admin"],
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Chat Support",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true // Items without roles are shown to everyone
    if (!user) return false // If no user, don't show role-specific items
    return hasRole(item.roles as any)
  })

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="mr-2">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold">ParkEase</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", bounce: 0.1 }}
          className="fixed inset-0 z-40 lg:hidden"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <nav className="absolute top-0 left-0 bottom-0 w-3/4 max-w-xs bg-background border-r p-6 overflow-y-auto">
            {user && (
              <div className="flex items-center gap-3 mb-6 p-2 border-b pb-4">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                    pathname === item.href && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}

              {user && (
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 p-2 rounded-md w-full justify-start hover:bg-muted text-muted-foreground hover:text-foreground"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </nav>
        </motion.div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-background border-r shrink-0 fixed top-0 bottom-0 left-0 z-30">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-6 p-2">
            <span className="text-xl font-bold">ParkEase</span>
          </div>

          {user && (
            <div className="flex items-center gap-3 mb-6 p-2 border-b pb-4">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                  pathname === item.href && "bg-primary/10 text-primary font-medium",
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t pt-4 space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            {user && (
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-2 rounded-md w-full justify-start hover:bg-muted text-muted-foreground hover:text-foreground"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

