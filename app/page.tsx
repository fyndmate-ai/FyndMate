'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { Shirt, Zap } from 'lucide-react'
import { AnimatedStars } from '@/components/animated-stars'
import { CursorGlow } from '@/components/cursor-glow'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <AnimatedStars />
      <CursorGlow />

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(26, 222, 128, 0.05) 25%, rgba(26, 222, 128, 0.05) 26%, transparent 27%, transparent 74%, rgba(26, 222, 128, 0.05) 75%, rgba(26, 222, 128, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(26, 222, 128, 0.05) 25%, rgba(26, 222, 128, 0.05) 26%, transparent 27%, transparent 74%, rgba(26, 222, 128, 0.05) 75%, rgba(26, 222, 128, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Gradient orb (subtle) */}
      <div
        className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #1ade80 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-green-500/20 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl">Fyndmate</span>
            </div>

            {/* Sign up button */}
            <Button
              className="px-6 py-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-all duration-300 rounded-full bg-transparent"
              variant="outline"
            >
              Sign up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Subheading */}
          <div className="mb-16 inline-block">
            <span className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-wider">
              <span className="text-green-400">Fynd</span>
              <span className="text-white">mate</span>
              {' '}
              <span className="text-white">AI</span>
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight max-w-4xl">
            Your AI Shopping &{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-200 bg-clip-text text-transparent">
              Style Partner
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Your AI shopping and styling partner with the latest trends
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Find Products Button - Filled green */}
            <Button className="px-8 py-6 text-lg font-semibold bg-green-500 text-black hover:bg-green-400 transition-all duration-300 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50">
              Fynd Products
            </Button>
            </Link>

            {/* AI Designer Button - Outlined */}
            <Button
              variant="outline"
              className="px-8 py-6 text-lg font-semibold border-2 border-green-500 text-green-400 hover:bg-green-500/10 transition-all duration-300 rounded-full flex items-center gap-2 bg-transparent"
            >
              <Shirt className="w-5 h-5" />
              AI Designer
            </Button>
          </div>


        </main>
      </div>
    </div>
  )
}

