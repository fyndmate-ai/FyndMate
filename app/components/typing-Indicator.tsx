'use client'

// Typing indicator component - shows animated dots while AI is thinking
// Similar to ChatGPT/Perplexity style
export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
        {/* AI Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600">
          <span className="text-sm font-semibold text-white">AI</span>
        </div>

        {/* Typing animation */}
        <div className="rounded-2xl bg-slate-100 px-4 py-3">
          <div className="flex gap-1.5">
            <div 
              className="h-2 w-2 rounded-full bg-slate-400" 
              style={{ 
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '0ms' 
              }}
            ></div>
            <div 
              className="h-2 w-2 rounded-full bg-slate-400" 
              style={{ 
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '200ms' 
              }}
            ></div>
            <div 
              className="h-2 w-2 rounded-full bg-slate-400" 
              style={{ 
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: '400ms' 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
