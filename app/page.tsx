'use client'
// TEST CHANGE – TOP SEARCHES WORKING
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Simple badge icon for the header pill
const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 2.75l1.35 3.46a2 2 0 001.19 1.19L18 8.75l-3.46 1.35a2 2 0 00-1.19 1.19L12 14.75l-1.35-3.46a2 2 0 00-1.19-1.19L6 8.75l3.46-1.35a2 2 0 001.19-1.19L12 2.75zM6.5 16.25l.8 2.05c.12.32.38.58.7.7l2.05.8-2.05.8a1.25 1.25 0 00-.7.7l-.8 2.05-.8-2.05a1.25 1.25 0 00-.7-.7l-2.05-.8 2.05-.8c.32-.12.58-.38.7-.7l.8-2.05zM18.5 16.25l.8 2.05c.12.32.38.58.7.7l2.05.8-2.05.8a1.25 1.25 0 00-.7.7l-.8 2.05-.8-2.05a1.25 1.25 0 00-.7-.7l-2.05-.8 2.05-.8c.32-.12.58-.38.7-.7l.8-2.05z"
    />
  </svg>
)

// Small camera icon for the upload button
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 7.5l1.5-2.25h7.5l1.5 2.25M6.75 7.5h-1.5A1.5 1.5 0 003.75 9v9a1.5 1.5 0 001.5 1.5h13.5A1.5 1.5 0 0020.25 18V9a1.5 1.5 0 00-1.5-1.5h-1.5M6.75 7.5h10.5m-8.25 6a3 3 0 116 0 3 3 0 01-6 0z"
    />
  </svg>
)

// Arrow icon for the primary CTA
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5 12h14m0 0l-5-5m5 5l-5 5"
    />
  </svg>
)

// Simple feature card icons
const DealIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 4.5h9A2.25 2.25 0 0118.75 6.75v12A2.25 2.25 0 0116.5 21h-9A2.25 2.25 0 015.25 18.75v-12A2.25 2.25 0 017.5 4.5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 8.25h.01M15 8.25h.01M8.25 12h7.5M9.75 15.75h4.5"
    />
  </svg>
)

const CompareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4.5v15m6-15v15M6.75 7.5H12M12 16.5h5.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 7.5l-2.25 2.25m2.25-2.25l2.25 2.25M17.25 16.5l-2.25-2.25m2.25 2.25l2.25-2.25"
    />
  </svg>
)

const TrendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-7 w-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 17.25V21h3.75M21 6.75V3h-3.75"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 3l-7.5 7.5-3-3L3 15"
    />
  </svg>
)

// Top search chips configuration - label shown on the chip + prompt sent to chat page
const TOP_SEARCHES = [
  {
    label: 'Wireless earbuds',
    prompt:
      'Find best wireless earbuds on Amazon India under ₹3000 with good sound quality, battery life, and mic.',
  },
  {
    label: 'Laptop',
    prompt:
      'Find best laptop under ₹60000 for students and office work on Amazon India.',
  },
  {
    label: 'Running shoes',
    prompt:
      'Find best running shoes for daily jogging and gym available on Flipkart.',
  },
  {
    label: 'Smartwatch',
    prompt:
      'Find best smartwatch under ₹5000 with fitness tracking and AMOLED display.',
  },
]

// Main landing page component - original design restored
export default function Home() {
  const router = useRouter()
  const [activeStore, setActiveStore] = useState<'amazon' | 'flipkart'>('amazon')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handler for "Find Products" button - navigates to chat page
  const handleFindProducts = () => {
    router.push('/chat')
  }

  // Handler for upload photo button
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Handler for image upload (for future use)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // For now, just navigate to chat page
      // In future, can pass image data to chat page
      router.push('/chat')
    }
  }

  // Handler for clicking a top search chip - navigate to chat page with predefined prompt
  const handleTopSearchClick = (prompt: string) => {
    const encoded = encodeURIComponent(prompt)
    router.push(`/chat?prompt=${encoded}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 pb-16 pt-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 text-sm font-medium">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
              <SparkleIcon />
            </span>
            Your Personal Wardrobe Manager
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
              Shop Smarter with{' '}
              <span className="text-teal-600">FyndMate</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              Your AI shopping advisor that finds the best products on{' '}
              <span className="font-semibold text-slate-900">Amazon</span> &amp;{' '}
              <span className="font-semibold text-slate-900">Flipkart</span> based on your needs and budget.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleFindProducts}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white text-lg font-semibold shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <ArrowIcon />
              </span>
              Find Products
            </button>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-slate-800 text-lg font-semibold shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <CameraIcon />
              Upload Photo
            </button>
          </div>

          {/* Store chips and example prompts */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStore('amazon')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeStore === 'amazon'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                Amazon India
              </button>
              <button
                onClick={() => setActiveStore('flipkart')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeStore === 'flipkart'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                Flipkart
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-700">
              <span className="text-red-600 font-bold">TEST LIVE</span>

              <span className="text-slate-500 mr-2">Top Searches 🔥</span>
              {TOP_SEARCHES.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleTopSearchClick(item.prompt)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How it helps section */}
        <section className="mt-16">
          <h2 className="text-center text-3xl md:text-4xl font-semibold text-slate-900">
            How FyndMate Helps You
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                <DealIcon />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Best Deals</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                I find the best products from Amazon India &amp; Flipkart based on your needs and budget.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                <CompareIcon />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Smart Compare</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Compare products side-by-side with clear reasons why one is better for you.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                <TrendIcon />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">Value Picks</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                I rank products as Best Overall, Best Value, and Best for Long-Term use.
              </p>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-12 text-center text-xs text-slate-500">
          🛒 FyndMate helps you find — you decide where to buy. Products from Amazon & Flipkart only.
        </p>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </main>
  )
}
