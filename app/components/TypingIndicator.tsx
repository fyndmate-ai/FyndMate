'use client'

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex gap-3 max-w-[85%] md:max-w-[75%] items-end">
        {/* AI Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00E676] shadow-[0_0_10px_rgba(0,230,118,0.5)]">
          <span className="text-xs font-bold text-black">AI</span>
        </div>

        {/* Typing animation bubble */}
        <div className="rounded-2xl rounded-bl-none bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <div 
              className="h-2 w-2 rounded-full bg-[#00E676]" 
              style={{ 
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '0ms' 
              }}
            ></div>
            <div 
              className="h-2 w-2 rounded-full bg-[#00E676]/60" 
              style={{ 
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '200ms' 
              }}
            ></div>
            <div 
              className="h-2 w-2 rounded-full bg-[#00E676]/30" 
              style={{ 
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '400ms' 
              }}
            ></div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
