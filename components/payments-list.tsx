"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Download, Plus } from "lucide-react"
import { useUser } from "@/components/user-provider"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function PaymentsList() {
  const { user } = useUser()
  const { toast } = useToast()
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")

  useEffect(() => {
    // Load payments data
    async function loadPayments() {
      try {
        // In a real app, you would fetch from your API
        // For demo purposes, we'll use sample data
        const samplePayments = [
          {
            id: "p1",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            amount: 60,
            status: "completed",
            method: "Credit Card",
            description: "MG Road Parking",
            receiptUrl: "#",
          },
          {
            id: "p2",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            amount: 40,
            status: "completed",
            method: "UPI",
            description: "Forum Mall Parking",
            receiptUrl: "#",
          },
          {
            id: "p3",
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            amount: 80,
            status: "completed",
            method: "Wallet",
            description: "City Center Parking",
            receiptUrl: "#",
          },
        ]

        setPayments(samplePayments)
      } catch (error) {
        console.error("Error loading payments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPayments()
  }, [])

  const handleAddCard = () => {
    // In a real app, this would call your API to add the card
    toast({
      title: "Payment method added",
      description: "Your card has been added successfully.",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>Add a new credit or debit card</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">Expiry Date</Label>
                      <Input
                        id="card-expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input
                        id="card-cvv"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleAddCard}>Add Card</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Overview of your payment activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">₹{payments.reduce((total, payment) => total + payment.amount, 0)}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm font-medium mb-2">Quick Actions</p>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm">
                  Download All Receipts
                </Button>
                <Button variant="outline" size="sm">
                  Export to CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p>Loading your payment history...</p>
            </Card>
          ) : payments.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {payments.map((payment) => (
                <motion.div key={payment.id} variants={itemVariants}>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{payment.description}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {payment.date.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm">{payment.method}</span>
                        </div>
                        <span className="font-bold">₹{payment.amount}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">You have no payment history</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <p>Loading your payment history...</p>
            </Card>
          ) : payments.filter((p) => p.status === "completed").length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
              {payments
                .filter((p) => p.status === "completed")
                .map((payment) => (
                  <motion.div key={payment.id} variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{payment.description}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {payment.date.toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <CreditCard className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm">{payment.method}</span>
                          </div>
                          <span className="font-bold">₹{payment.amount}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">You have no completed payments</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">You have no pending payments</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

