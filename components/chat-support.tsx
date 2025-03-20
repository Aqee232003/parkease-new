"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/components/user-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Bot } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

export function ChatSupport() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate agent typing
    setIsTyping(true)

    // Simulate agent response after a delay
    setTimeout(() => {
      setIsTyping(false)

      // Add agent response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAgentResponse(inputValue),
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
    }, 1500)
  }

  // Simple response generator based on user input
  const getAgentResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("book") || input.includes("reservation")) {
      return "To book a parking spot, go to the 'Find Parking' page and select your desired location and time slot. Is there a specific area you're looking to park in?"
    } else if (input.includes("cancel")) {
      return "You can cancel a booking by going to 'My Bookings', selecting the booking you want to cancel, and clicking the 'Cancel' button. Please note that cancellation policies may apply."
    } else if (input.includes("payment") || input.includes("pay")) {
      return "We accept various payment methods including credit/debit cards, UPI, and wallet payments. You can manage your payment methods in the 'Payments' section. Is there a specific payment issue you're facing?"
    } else if (input.includes("refund")) {
      return "Refunds are typically processed within 5-7 business days. If you haven't received your refund after this period, please provide your booking ID and we'll look into it."
    } else if (input.includes("hello") || input.includes("hi")) {
      return "Hello! How can I assist you with ParkEase today?"
    } else {
      return "Thank you for your message. Is there anything specific about parking that you'd like to know? I can help with bookings, cancellations, payments, or finding parking spots."
    }
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/images/avatars/support-agent.png" alt="Support Agent" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>ParkEase Support</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto h-[calc(100%-8rem)]">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8 mt-1">
                    {message.sender === "user" ? (
                      <>
                        <AvatarImage
                          src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/images/avatars/support-agent.png" alt="Support Agent" />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/images/avatars/support-agent.png" alt="Support Agent" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex space-x-1">
                        <div
                          className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

