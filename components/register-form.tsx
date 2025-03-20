"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Mail, Lock, User, Building } from "lucide-react"
import { saveUser } from "@/lib/db"
import { useUser, type UserRole } from "@/components/user-provider"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function RegisterForm() {
  const router = useRouter()
  const { setUser } = useUser()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("user")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  // Check online status
  useState(() => {
    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Check if offline
    if (isOffline) {
      setError("Registration requires internet connection")
      setIsLoading(false)
      return
    }

    try {
      // In a real app, this would call your registration API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate successful registration
      const user = {
        id: Date.now().toString(),
        name,
        email,
        // Don't store raw password in production!
        // This is just for demo purposes
        password,
        role,
        createdAt: new Date(),
        verified: false,
        avatar: `/images/avatars/avatar-${Math.floor(Math.random() * 5) + 1}.png`,
      }

      // Save user to IndexedDB for offline login
      await saveUser(user)

      // Also save to localStorage for demo purposes
      localStorage.setItem("parkease-user", JSON.stringify(user))

      // Update user context
      setUser(user)

      toast({
        title: "Registration successful!",
        description: "Welcome to ParkEase. You can now start using the app.",
      })

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="user">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user">Regular User</TabsTrigger>
          <TabsTrigger value="premium">Premium User</TabsTrigger>
          <TabsTrigger value="owner">Parking Owner</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <form
            onSubmit={(e) => {
              setRole("user")
              handleRegister(e)
            }}
          >
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
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading || isOffline}>
                {isLoading ? "Creating account..." : "Create Regular Account"}
              </Button>

              {isOffline && (
                <p className="mt-2 text-sm text-amber-600 text-center">Registration requires internet connection</p>
              )}

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="premium">
          <form
            onSubmit={(e) => {
              setRole("premium")
              handleRegister(e)
            }}
          >
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

              <div className="bg-primary/10 p-4 rounded-md mb-2">
                <h3 className="font-semibold text-primary mb-1">Premium Benefits</h3>
                <ul className="text-sm space-y-1">
                  <li>• Priority booking during peak hours</li>
                  <li>• 10% discount on all bookings</li>
                  <li>• Free cancellation up to 30 minutes before</li>
                  <li>• Exclusive access to premium spots</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premium-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="premium-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premium-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="premium-email"
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
                <Label htmlFor="premium-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="premium-password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="premium-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="premium-confirmPassword"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                disabled={isLoading || isOffline}
              >
                {isLoading ? "Creating account..." : "Create Premium Account"}
              </Button>

              {isOffline && (
                <p className="mt-2 text-sm text-amber-600 text-center">Registration requires internet connection</p>
              )}

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="owner">
          <form
            onSubmit={(e) => {
              setRole("owner")
              handleRegister(e)
            }}
          >
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
                <Label htmlFor="owner-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="owner-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="business-name"
                    type="text"
                    placeholder="Your Parking Business"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="owner-email"
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
                <Label htmlFor="owner-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="owner-password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner-confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="owner-confirmPassword"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading || isOffline}>
                {isLoading ? "Creating account..." : "Register as Parking Owner"}
              </Button>

              {isOffline && (
                <p className="mt-2 text-sm text-amber-600 text-center">Registration requires internet connection</p>
              )}

              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

