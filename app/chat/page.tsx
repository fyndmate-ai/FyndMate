'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, ShoppingBag } from 'lucide-react'
import { AnimatedStars } from '@/components/animated-stars'
import { CursorGlow } from '@/components/cursor-glow'

const QUICK_SUGGESTIONS = [
  'I want to buy wireless earbuds',
  'Find me a black hoodie under ₹2000',
  'Red sneakers for a party',
  'Formal shirts for office'
]

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (text: string) => {
    const messageToSend = text || input
    if (!messageToSend.trim()) return
    
    setLoading(true)
    const userMessage = { role: 'user', content: messageToSend }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.output }])
    } catch (error) {
      console.error("Brain error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <AnimatedStars />
      <CursorGlow />

      {/* Header */}
      <div className="relative z-10 p-4 flex items-center border-b border-white/10 bg-black/50 backdrop-blur-md">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="text-[#00E676]" />
        </Link>
        <h1 className="ml-4 font-bold text-xl tracking-tight">Fyndmate <span className="text-[#00E676]">AI</span></h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 relative z-10 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-8 mt-12">
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">Bhai, what are you looking for today?</p>
              <p className="text-gray-500">I'll find the best deals for you.</p>
            </div>
            
            {/* Quick Suggestions styled as modern pills */}
            <div className="flex flex-wrap justify-center gap-3 max-w-xl">
              {QUICK_SUGGESTIONS.map((s) => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)}
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm hover:border-[#00E676] hover:bg-[#00E676]/5 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[#00E676] text-black font-semibold shadow-[0_0_15px_rgba(0,230,118,0.3)]' 
                : 'bg-white/5 border border-white/10 backdrop-blur-sm text-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-[#00E676] text-sm animate-pulse ml-2">Fyndmate is searching stores...</div>}
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend('')}
            placeholder="Search products (e.g., 'Green sneakers under 3000')"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#00E676] transition-all"
          />
          <button 
            onClick={() => handleSend('')}
            className="bg-[#00E676] text-black p-4 rounded-2xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,230,118,0.4)]"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}
