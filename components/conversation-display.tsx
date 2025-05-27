import { useRef,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Conversation } from "@/lib/types"
import ReactMarkdown from "react-markdown"

interface ConversationDisplayProps {
  conversation: Conversation | null
}

export function ConversationDisplay({ conversation }: ConversationDisplayProps) {
  const conversationRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight
    }
  }, [])

  if (!conversation) {
    return <div className="text-center text-muted-foreground">No conversation selected</div>
  }

  const messages = conversation.ConversationMessages
  const lastUserIndex = messages.length - 2
  const lastAssistantIndex = messages.length - 1
  return (
    <>
      <Card className="mb-4 h-[480px]">
        <CardHeader>
          <CardTitle className="text-lg">Conversation #{conversation.id}</CardTitle>
        </CardHeader>
        <CardContent className="h-4/5 pb-6">
          <div ref={conversationRef} className="h-full overflow-y-auto space-y-4 pr-2">
            {messages.map((message, index) => {
              const isLastPair = index === lastUserIndex || index === lastAssistantIndex
              return (
                <div key={index} className="space-y-2">
                  <div className="font-bold text-sm capitalize">{message.role}</div>
                  <div
                    className={`p-3 rounded-lg transition-all ${
                      message.role === "user"
                        ? `bg-white border ${isLastPair ? "border-blue-300 shadow-md" : ""}`
                        : `bg-gray-100 ${isLastPair ? "bg-blue-50 border border-blue-200 shadow-md" : ""}`
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
