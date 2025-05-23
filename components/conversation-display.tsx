import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Conversation } from "@/lib/types"

interface ConversationDisplayProps {
  conversation: Conversation
}

export function ConversationDisplay({ conversation }: ConversationDisplayProps) {
  const messages = conversation.messages
  return (
    <Card className="flex flex-col h-3/4">
      <CardHeader className="pb-2">
        <CardTitle>Conversation #{conversation.id}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${message.role === "assistant" ? "bg-primary/10 ml-4" : "bg-muted mr-4"}`}
            >
              <div className="font-semibold mb-1">{message.role === "assistant" ? "Assistant" : "User"}</div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
