'use client'

import { useEffect, useState } from 'react'

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="fixed w-96 h-96 pointer-events-none rounded-full"
      style={{
        left: `${position.x - 192}px`,
        top: `${position.y - 192}px`,
        background: 'radial-gradient(circle, rgba(26, 222, 128, 0.15) 0%, rgba(26, 222, 128, 0) 70%)',
        filter: 'blur(40px)',
        transition: 'all 0.3s ease-out',
        zIndex: 1,
      }}
    />
  )
}
