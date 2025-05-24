export interface Metric {
  id: number
  name: string
  definition: string
  createdAt: Date
}

export interface Conversation {
  id: string 
  ConversationMessages: ConversationMessage[]
}

export interface ConversationMessage {
  conversationId: string
  id: number
  turnNumber: number
  role: "assistant" | "user" | "system"
  content: string
}

export interface User {
  id: number
  name: string
}

export interface Message {
  role: "assistant" | "user" | "system"
  content: string
}
