'use client'

import { Message } from '../types'
import ProductCard from './ProductCard'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
        {/* Avatar */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-lg ${
            isUser ? 'bg-white/20' : 'bg-[#00E676] text-black'
          }`}
        >
          <span className="text-xs font-bold">{isUser ? 'U' : 'AI'}</span>
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}>
          <div
            className={`rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md ${
              isUser
                ? 'bg-[#00E676] text-black font-medium rounded-tr-none'
                : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {message.content.split('**').map((part, index) => 
                index % 2 === 1 ? (
                  <strong key={index} className="text-[#00E676]">{part}</strong>
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
