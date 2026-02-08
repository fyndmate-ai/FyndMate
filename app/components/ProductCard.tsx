'use client'

import Image from 'next/image'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:border-[#00E676]/50 shadow-lg mb-4">
      <div className="flex flex-col md:flex-row">
        {/* Product image */}
        <div className="md:w-48 h-48 md:h-auto bg-white/10 overflow-hidden relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Product details */}
        <div className="flex-1 p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {product.name}
            </h3>
            <p className="text-xl font-bold text-[#00E676] mb-3">
              {product.price}
            </p>
            
            {/* Key features */}
            <ul className="space-y-1.5 mb-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-[#00E676] mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF9900] px-4 py-2.5 text-black text-sm font-bold transition hover:opacity-90"
            >
              Buy on Amazon
            </a>
            <a
              href={product.flipkartLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2874F0] px-4 py-2.5 text-white text-sm font-bold transition hover:opacity-90"
            >
              Buy on Flipkart
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
