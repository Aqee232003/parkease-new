"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fingerprint, Mail, Lock, AlertCircle } from "lucide-react"
import { saveUser } from "@/lib/db"
import { useUser } from "@/components/user-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useUser()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // Check online status
  useEffect(() => {
    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if we have cached credentials
      if (isOffline) {
        // Try to authenticate from IndexedDB
        const storedUser = await checkOfflineCredentials(email, password)

        if (storedUser) {
          // Login successful with cached credentials
          setUser(storedUser)
          router.push("/dashboard")
        } else {
          setError("First login requires internet connection")
        }
      } else {
        // Online login flow (simulated)
        // In a real app, this would call your authentication API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll create mock users for different roles
        let user

        if (email === "admin@example.com" && password === "password") {
          user = {
            id: "admin123",
            email,
            name: "Admin User",
            role: "admin",
            createdAt: new Date(),
            verified: true,
            avatar: "/images/avatars/avatar-1.png",
          }
        } else if (email === "owner@example.com" && password === "password") {
          user = {
            id: "owner123",
            email,
            name: "Parking Owner",
            role: "owner",
            createdAt: new Date(),
            verified: true,
            avatar: "/images/avatars/avatar-2.png",
          }
        } else if (email === "premium@example.com" && password === "password") {
          user = {
            id: "premium123",
            email,
            name: "Premium User",
            role: "premium",
            createdAt: new Date(),
            premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            verified: true,
            avatar: "/images/avatars/avatar-3.png",
          }
        } else {
          // Regular user
          user = {
            id: "user123",
            email,
            name: "Regular User",
            role: "user",
            createdAt: new Date(),
            verified: true,
            avatar: "/images/avatars/avatar-4.png",
          }
        }

        // Save user to IndexedDB for offline login
        await saveUser(user)

        // Save to localStorage for quick access
        localStorage.setItem("parkease-user", JSON.stringify(user))

        // Update user context
        setUser(user)

        toast({
          title: "Login successful!",
          description: `Welcome back, ${user.name}!`,
        })

        // Navigate to dashboard
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    // Check if Web Authentication API is available
    if (!window.PublicKeyCredential) {
      setError("Biometric authentication is not supported on this device")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would use the Web Authentication API
      // For demo purposes, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a demo user
      const user = {
        id: "bio123",
        email: "user@example.com",
        name: "Biometric User",
        role: "user",
        createdAt: new Date(),
        verified: true,
        avatar: "/images/avatars/avatar-5.png",
      }

      // Save user to context
      setUser(user)

      // Save to localStorage
      localStorage.setItem("parkease-user", JSON.stringify(user))

      toast({
        title: "Biometric login successful!",
        description: "Welcome back!",
      })

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Biometric authentication failed")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to check offline credentials
  async function checkOfflineCredentials(email: string, password: string) {
    // In a real app, you would check against IndexedDB
    // This is a simplified version
    return new Promise((resolve) => {
      // Check if credentials are in localStorage (for demo)
      const storedUser = localStorage.getItem("parkease-user")

      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.email === email && user.password === password) {
          resolve(user)
        } else {
          resolve(null)
        }
      } else {
        resolve(null)
      }
    })
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="credentials">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credentials">Email & Password</TabsTrigger>
          <TabsTrigger value="biometric">Biometric</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Demo accounts:</p>
                <p className="text-xs">admin@example.com / password</p>
                <p className="text-xs">owner@example.com / password</p>
                <p className="text-xs">premium@example.com / password</p>
                <p className="text-xs">Or use any email/password for a regular user</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="biometric">
          <CardContent className="pt-4 flex flex-col items-center justify-center py-10">
            {error && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2 mb-4 w-full">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-4"
            >
              <Fingerprint className="h-16 w-16 text-primary" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Biometric Login</h3>
            <p className="text-center text-muted-foreground mb-6">
              Use your fingerprint or face ID to sign in quickly and securely
            </p>

            <Button onClick={handleBiometricLogin} className="w-full" disabled={isLoading || isOffline}>
              {isLoading ? "Authenticating..." : "Authenticate"}
            </Button>

            {isOffline && (
              <p className="mt-4 text-sm text-amber-600">Biometric login requires internet for first-time setup</p>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

