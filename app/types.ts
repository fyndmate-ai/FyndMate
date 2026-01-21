// Type definitions for the chat interface and product data
// This structure is ready for real Amazon/Flipkart API integration later

// Message types for the chat interface
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  products?: Product[]
}

// Product structure matching the requirements
export interface Product {
  id: string
  name: string
  image: string
  price: string
  features: string[]
  amazonLink: string
  flipkartLink: string
}

// AI response structure
export interface AIResponse {
  answer: string
  products?: Product[]
  needsFollowUp?: boolean
  followUpQuestion?: string
}

// User context for smart follow-up questions
export interface UserContext {
  productType?: string
  budget?: string
  usage?: string
  brandPreference?: string
}
