export interface Metric {
  id: number
  name: string
  definition: string
  createdAt: Date
}

export interface Conversation {
  id: string 
  messages: ConversationMessage[]
}

export interface ConversationMessage {
  conversationId: string
  id: number
  turnNumber: number
  role: "assistant" | "user"
  content: string
}
