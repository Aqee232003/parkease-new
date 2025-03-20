"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion, AnimatePresence } from "framer-motion"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // Sample FAQ data
  const faqs: FAQ[] = [
    {
      id: "faq-1",
      question: "How do I book a parking spot?",
      answer:
        "To book a parking spot, navigate to the 'Find Parking' section, search for your desired location, select an available spot, choose your time slot, and complete the payment process. You'll receive a confirmation with a QR code that you can use to access the parking area.",
      category: "booking",
    },
    {
      id: "faq-2",
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking through the 'My Bookings' section. Select the booking you wish to cancel and click the 'Cancel' button. Please note that cancellation policies vary depending on how close you are to your booking time. Full refunds are typically provided for cancellations made at least 1 hour before the booking time.",
      category: "booking",
    },
    {
      id: "faq-3",
      question: "How does the offline mode work?",
      answer:
        "ParkEase works offline after your first login. The app caches your bookings, parking spot information, and maps for offline use. When you're offline, you can still view your bookings, access parking spots with your QR code, and navigate to your destination. Any changes made while offline will sync once you're back online.",
      category: "app",
    },
    {
      id: "faq-4",
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods including credit/debit cards, UPI, and digital wallets like Paytm and Google Pay. You can manage your payment methods in the 'Payments' section of your profile. For offline payments, you can use our 'Pay Later' feature which allows you to complete the payment when you're back online.",
      category: "payment",
    },
    {
      id: "faq-5",
      question: "How do I extend my parking time?",
      answer:
        "To extend your parking time, go to 'My Bookings', select your active booking, and click on the 'Extend Time' button. You can extend your booking as long as there's availability for the extended time slot. Additional charges will apply based on the extension duration.",
      category: "booking",
    },
    {
      id: "faq-6",
      question: "What is the Premium membership?",
      answer:
        "Premium membership offers exclusive benefits like priority booking during peak hours, 10% discount on all bookings, free cancellation up to 30 minutes before your booking time, and access to premium parking spots. You can upgrade to Premium from your profile settings.",
      category: "account",
    },
    {
      id: "faq-7",
      question: "How does the navigation system work?",
      answer:
        "Our navigation system uses offline maps to guide you to your parking spot. It provides turn-by-turn directions and works even without an internet connection. For the best experience, we recommend downloading the map data for your city before going offline.",
      category: "navigation",
    },
    {
      id: "faq-8",
      question: "How do I report an issue with a parking spot?",
      answer:
        "If you encounter any issues with a parking spot, you can report it through the 'Report Issue' option in the booking details. Alternatively, you can contact our support team through the Chat Support feature or by emailing support@parkease.com.",
      category: "support",
    },
    {
      id: "faq-9",
      question: "How does the loyalty program work?",
      answer:
        "Our loyalty program rewards you for using ParkEase. You earn points for every booking, referral, and other activities. These points can be redeemed for discounts on future bookings, premium features, or partner offers. You can check your loyalty status and available rewards in the 'Rewards' section.",
      category: "account",
    },
    {
      id: "faq-10",
      question: "Can I register my parking space on ParkEase?",
      answer:
        "Yes, if you own a parking space, you can register it on ParkEase. Go to the 'Add Space' section, provide the required details about your parking space, set your pricing, and complete the verification process. Once approved, your space will be available for users to book.",
      category: "owner",
    },
  ]

  // Filter FAQs based on search query and category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(faqs.map((faq) => faq.category)))]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about ParkEase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <AnimatePresence>
            {filteredFAQs.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-4">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <p className="text-muted-foreground">No FAQs found matching your search criteria.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                >
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Support */}
          <div className="mt-8 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you couldn't find the answer to your question, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" asChild className="flex-1">
                <a href="mailto:support@parkease.com">Email Support</a>
              </Button>
              <Button asChild className="flex-1">
                <a href="/chat">Chat with Support</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

