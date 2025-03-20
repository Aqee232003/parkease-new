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
  Search,
  Compass,
  HelpCircle,
  Bell,
  Clock,
  Heart,
  Bookmark,
  Award,
} from "lucide-react"
import { useUser } from "@/components/user-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles?: string[]
  badge?: string
  subitems?: NavItem[]
}

export function EnhancedNavigation() {
  const pathname = usePathname()
  const { user, logout, hasRole } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Parking",
      href: "#",
      icon: <Car className="h-5 w-5" />,
      subitems: [
        {
          title: "Find Parking",
          href: "/find-parking",
          icon: <Search className="h-5 w-5" />,
          roles: ["user", "premium", "admin"],
        },
        {
          title: "My Bookings",
          href: "/bookings",
          icon: <Clock className="h-5 w-5" />,
          roles: ["user", "premium", "admin"],
          badge: notifications > 0 ? notifications.toString() : undefined,
        },
        {
          title: "Favorites",
          href: "/favorites",
          icon: <Heart className="h-5 w-5" />,
          roles: ["user", "premium", "admin"],
        },
        {
          title: "Saved Routes",
          href: "/saved-routes",
          icon: <Bookmark className="h-5 w-5" />,
          roles: ["user", "premium", "admin"],
        },
      ],
    },
    {
      title: "Navigation",
      href: "/navigation",
      icon: <Compass className="h-5 w-5" />,
      roles: ["user", "premium", "admin"],
    },
    {
      title: "Payments",
      href: "/payments",
      icon: <CreditCard className="h-5 w-5" />,
      roles: ["user", "premium", "admin"],
    },
    {
      title: "Rewards",
      href: "/rewards",
      icon: <Award className="h-5 w-5" />,
      roles: ["user", "premium", "admin"],
    },
    {
      title: "Owner Tools",
      href: "#",
      icon: <Building className="h-5 w-5" />,
      roles: ["owner", "admin"],
      subitems: [
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
      ],
    },
    {
      title: "Admin",
      href: "#",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin"],
      subitems: [
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
      ],
    },
    {
      title: "Help & Support",
      href: "#",
      icon: <HelpCircle className="h-5 w-5" />,
      subitems: [
        {
          title: "Chat Support",
          href: "/chat",
          icon: <MessageSquare className="h-5 w-5" />,
        },
        {
          title: "FAQs",
          href: "/faqs",
          icon: <HelpCircle className="h-5 w-5" />,
        },
      ],
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
  const filteredNavItems = navItems
    .filter((item) => {
      if (!item.roles) return true // Items without roles are shown to everyone
      if (!user) return false // If no user, don't show role-specific items
      return hasRole(item.roles as any)
    })
    .map((item) => {
      if (item.subitems) {
        return {
          ...item,
          subitems: item.subitems.filter((subitem) => {
            if (!subitem.roles) return true
            if (!user) return false
            return hasRole(subitem.roles as any)
          }),
        }
      }
      return item
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="font-medium">Booking Confirmed</div>
                    <div className="text-sm text-muted-foreground">Your parking at MG Road has been confirmed.</div>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="font-medium">Upcoming Booking</div>
                    <div className="text-sm text-muted-foreground">
                      Reminder: You have a booking tomorrow at 10:00 AM.
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start p-3">
                    <div className="font-medium">Payment Successful</div>
                    <div className="text-sm text-muted-foreground">Your payment of ₹60 was successful.</div>
                    <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center font-medium text-primary">
                  <Link href="/notifications">View All Notifications</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
      <AnimatePresence>
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
                  <div key={item.title}>
                    {item.subitems ? (
                      <>
                        <button
                          onClick={() => toggleGroup(item.title)}
                          className={cn(
                            "flex items-center justify-between w-full p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                            expandedGroups.includes(item.title) && "bg-muted/50 text-foreground font-medium",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.title}</span>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`h-4 w-4 transition-transform ${
                              expandedGroups.includes(item.title) ? "transform rotate-180" : ""
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>

                        <AnimatePresence>
                          {expandedGroups.includes(item.title) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.subitems.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className={cn(
                                    "flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                                    pathname === subitem.href && "bg-primary/10 text-primary font-medium",
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    {subitem.icon}
                                    <span>{subitem.title}</span>
                                  </div>
                                  {subitem.badge && (
                                    <Badge variant="secondary" className="ml-auto">
                                      {subitem.badge}
                                    </Badge>
                                  )}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                          pathname === item.href && "bg-primary/10 text-primary font-medium",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </div>
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
      </AnimatePresence>

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
              <div key={item.title}>
                {item.subitems ? (
                  <>
                    <button
                      onClick={() => toggleGroup(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                        expandedGroups.includes(item.title) && "bg-muted/50 text-foreground font-medium",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`h-4 w-4 transition-transform ${
                          expandedGroups.includes(item.title) ? "transform rotate-180" : ""
                        }`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    <AnimatePresence>
                      {expandedGroups.includes(item.title) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-4"
                        >
                          {item.subitems.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className={cn(
                                "flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                                pathname === subitem.href && "bg-primary/10 text-primary font-medium",
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {subitem.icon}
                                <span>{subitem.title}</span>
                              </div>
                              {subitem.badge && (
                                <Badge variant="secondary" className="ml-auto">
                                  {subitem.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground",
                      pathname === item.href && "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </div>
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

