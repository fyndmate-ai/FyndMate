'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Message, UserContext } from '../types'
import ChatMessage from '../components/ChatMessage'
import TypingIndicator from '../components/TypingIndicator'

// Quick suggestion prompts - clickable buttons
const QUICK_SUGGESTIONS = [
  'I want to buy wireless earbuds',
  'I want to buy a laptop',
  'I want to buy running shoes',
  'I want to buy a smartwatch',
]

// Initial welcome message from AI
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm FyndMate, your AI shopping advisor. I help you find the best products from **Amazon India** and **Flipkart** based on your needs and budget.\n\nWhat would you like to buy today?",
  timestamp: new Date(),
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Chat messages state
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  
  // User input state
  const [input, setInput] = useState('')
  
  // Loading state for AI response
  const [isLoading, setIsLoading] = useState(false)
  
  // User context for smart follow-up questions
  const [userContext, setUserContext] = useState<UserContext>({})
  
  // Reference to scroll container
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [autoPromptSent, setAutoPromptSent] = useState(false)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Handle sending a message
  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Update context based on message
    const lowerText = messageText.toLowerCase()
    const productType = extractProductType(lowerText)
    const budget = extractBudget(messageText)
    const usage = extractUsage(lowerText)

    if (productType) {
      setUserContext((prev) => ({ ...prev, productType }))
    }
    if (budget) {
      setUserContext((prev) => ({ ...prev, budget }))
    }
    if (usage) {
      setUserContext((prev) => ({ ...prev, usage }))
    }

    try {
      // Call API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          context: userContext,
        }),
      })

      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        products: data.products,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])

      // Update context if needed
      if (data.needsFollowUp && data.followUpQuestion) {
        // Context will be updated in next user message
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // If a prompt is passed via URL (?prompt=...), automatically send it once
  useEffect(() => {
    if (autoPromptSent) return
    const prompt = searchParams.get('prompt')
    if (prompt) {
      handleSend(prompt)
      setAutoPromptSent(true)
    }
  }, [searchParams, autoPromptSent])

  // Handle quick suggestion click
  const handleQuickSuggestion = (suggestion: string) => {
    handleSend(suggestion)
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  // Extract product type from text
  function extractProductType(text: string): string | undefined {
    const productTypes = ['wireless earbuds', 'earbuds', 'laptop', 'running shoes', 'shoes', 'smartwatch', 'watch']
    for (const type of productTypes) {
      if (text.includes(type)) {
        if (type === 'earbuds') return 'wireless earbuds'
        if (type === 'shoes') return 'running shoes'
        if (type === 'watch') return 'smartwatch'
        return type
      }
    }
    return undefined
  }

  // Extract budget from text
  function extractBudget(text: string): string | undefined {
    const budgetMatch = text.match(/₹?\s*(\d+[\d,]*)\s*(?:thousand|k|rs|rupees)?/i)
    return budgetMatch ? budgetMatch[1].replace(/,/g, '') : undefined
  }

  // Extract usage from text
  function extractUsage(text: string): string | undefined {
    const usageKeywords = ['daily', 'gaming', 'office', 'running', 'work', 'casual', 'sports']
    for (const keyword of usageKeywords) {
      if (text.includes(keyword)) {
        return keyword
      }
    }
    return undefined
  }

  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Header - minimal like ChatGPT/Perplexity */}
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition"
            >
              <svg
                className="h-5 w-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
              <span className="text-sm font-semibold text-white">FM</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-900">FyndMate</h1>
          </div>
          <p className="hidden sm:block text-sm text-slate-600">
            Your AI Shopping Advisor
          </p>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Messages */}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Quick suggestions - shown only when no messages except welcome */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-slate-500">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleQuickSuggestion(suggestion)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                // Auto-resize textarea
                e.target.style.height = 'auto'
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Ask me anything about products..."
              className="flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-3 text-center text-xs text-slate-500">
            🛒 FyndMate helps you find — you decide where to buy. Products from Amazon & Flipkart only.
          </p>
        </div>
      </div>
    </main>
  )
}
