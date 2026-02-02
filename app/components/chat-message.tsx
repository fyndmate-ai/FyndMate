'use client'

import { Message } from '../types'
import ProductCard from './ProductCard'

// Chat message component - displays user messages (right) and AI messages (left)
// Similar to ChatGPT/Perplexity style
interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isUser ? 'bg-emerald-600' : 'bg-teal-600'
          }`}
        >
          {isUser ? (
            <span className="text-sm font-semibold text-white">U</span>
          ) : (
            <span className="text-sm font-semibold text-white">AI</span>
          )}
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-900'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content.split('**').map((part, index) => 
                index % 2 === 1 ? (
                  <strong key={index}>{part}</strong>
                ) : (
                  <span key={index}>{part}</span>
                )
              )}
            </p>
          </div>

          {/* Product cards - only shown in AI messages */}
          {message.products && message.products.length > 0 && (
            <div className="mt-4 w-full space-y-4">
              {message.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
