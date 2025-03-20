import type { Metadata } from "next"
import { FAQSection } from "@/components/faq-section"

export const metadata: Metadata = {
  title: "FAQs - ParkEase",
  description: "Frequently asked questions about ParkEase",
}

export default function FAQsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Find answers to common questions about using ParkEase</p>
      </div>

      <FAQSection />
    </div>
  )
}

