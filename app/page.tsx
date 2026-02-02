'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { Shirt, Zap } from 'lucide-react'
import { AnimatedStars } from '@/components/AnimatedStars'
import { CursorGlow } from '@/components/CursorGlow'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedStars />
      <CursorGlow />
      
      <div className="fixed inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#22c55e 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} 
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-8">
          <Zap className="w-4 h-4" />
          <span>AI-Powered Personal Stylist</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter">
          Shop Smarter with <span className="text-green-500">FyndMate</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          Your personal AI shopping assistant that finds the perfect style and deals just for you.
        </p>

        <Link href="/chat">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
            Start Shopping
            <Shirt className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </main>
    </div>
  )
}
