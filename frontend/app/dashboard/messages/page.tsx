import { MessagesList } from "@/components/chat/messages-list"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Chat with other students about your deliveries and trips</p>
      </div>
      <MessagesList />
    </div>
  )
}
