'use client'

import { Product } from '../types'

// Product card component - displays product info with Amazon and Flipkart buttons
// This structure is ready for affiliate links
interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Product image */}
        <div className="md:w-48 h-48 md:h-auto bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product details */}
        <div className="flex-1 p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {product.name}
            </h3>
            <p className="text-xl font-bold text-emerald-600 mb-3">
              {product.price}
            </p>
            
            {/* Key features */}
            <ul className="space-y-1.5 mb-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons - Amazon and Flipkart */}
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-white text-sm font-semibold transition hover:bg-amber-600"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              Buy on Amazon
            </a>
            <a
              href={product.flipkartLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-white text-sm font-semibold transition hover:bg-blue-600"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Buy on Flipkart
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
