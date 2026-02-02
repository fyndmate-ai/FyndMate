// Message types for the chat interface
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  products?: Product[]
}

// Product structure - Matches your ProductCard.tsx components
export interface Product {
  id: string
  name: string
  image: string
  price: string
  features: string[]
  amazonLink: string
  flipkartLink: string
}

// AI response structure for the Gemini API
export interface AIResponse {
  answer: string
  products?: Product[]
}
