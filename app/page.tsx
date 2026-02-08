'use client'

import Link from 'next/link';
import { Button } from './components/ui/button'
import { Shirt, Sparkles } from 'lucide-react'
import { AnimatedStars } from './components/AnimatedStars'
import { CursorGlow } from './components/CursorGlow'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedStars />
      <CursorGlow />
      
      <div className="fixed inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#22c55e 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} 
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        <div className="mb-8 text-2xl font-semibold tracking-tight">
          <span className="text-green-500">AI-Powered</span> <span className="text-white">Personal Stylist</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter">
          Your AI Shopping & <span className="text-green-500">Style</span>
          <br />
          <span className="text-green-400">Partner</span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          Your AI shopping and styling partner with the latest trends
        </p>

        <div className="mx-auto flex flex-row items-center justify-center gap-6 flex-nowrap max-w-xl">
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-black px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
          >
            <Link href="/chat">
              Fynd Products
              <Shirt className="ml-3 w-5 h-5" />
            </Link>
          </Button>

          <div className="flex flex-col items-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-green-500/70 text-green-400 hover:bg-green-500/10 px-10 py-7 text-lg rounded-full transition-all hover:scale-105"
            >
              <Link href="/chat">
                StyleMate
                <Sparkles className="ml-3 w-5 h-5" />
              </Link>
            </Button>
            <div className="mt-2 text-sm text-zinc-400">AI Designer</div>
          </div>
        </div>
      </main>
    </div>
  )
}
