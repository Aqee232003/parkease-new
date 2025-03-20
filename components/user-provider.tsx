"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getUser } from "@/lib/db"

// Define user roles
export type UserRole = "user" | "premium" | "owner" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  premiumUntil?: Date
  verified: boolean
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check localStorage first for quick loading
        const storedUser = localStorage.getItem("parkease-user")

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }

        // Then try to get from IndexedDB for more complete data
        if (storedUser) {
          const dbUser = await getUser(JSON.parse(storedUser).id)
          if (dbUser) {
            setUser(dbUser)
            localStorage.setItem("parkease-user", JSON.stringify(dbUser))
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const isAuthenticated = !!user

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("parkease-user")
    // In a real app, you would also invalidate the session on the server
    window.location.href = "/login"
  }

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, isAuthenticated, hasRole, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

