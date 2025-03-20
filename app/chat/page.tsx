import type { Metadata } from "next"
import { ChatSupport } from "@/components/chat-support"

export const metadata: Metadata = {
  title: "Chat Support - ParkEase",
  description: "Get help from our support team",
}

export default function ChatPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Chat Support</h1>
        <p className="text-muted-foreground">Get help from our support team</p>
      </div>

      <ChatSupport />
    </div>
  )
}

