import { NextRequest, NextResponse } from 'next/server'
import { AIResponse, Product, UserContext } from '../../types'

// Mock product database - ready to replace with real Amazon/Flipkart APIs
const mockProductDatabase: Record<string, Product[]> = {
  'wireless earbuds': [
    {
      id: 'earbuds-1',
      name: 'Boat Airdopes 141',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      price: '₹1,299',
      features: [
        '40 hours total playback',
        'IPX4 sweat & splash resistant',
        'ASAP Charge - 5 min charge = 75 min play'
      ],
      amazonLink: 'https://www.amazon.in/dp/B09YVH8Q8Z',
      flipkartLink: 'https://www.flipkart.com/boat-airdopes-141/p/itm123456'
    },
    {
      id: 'earbuds-2',
      name: 'OnePlus Nord Buds 2',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      price: '₹2,999',
      features: [
        '12.4mm dynamic drivers',
        'Up to 30 hours battery',
        'Active Noise Cancellation'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0BXYZ123',
      flipkartLink: 'https://www.flipkart.com/oneplus-nord-buds-2/p/itm789012'
    },
    {
      id: 'earbuds-3',
      name: 'Sony WF-C500',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
      price: '₹4,990',
      features: [
        '20 hours battery life',
        'DSEE upscaling technology',
        'IPX4 water resistance'
      ],
      amazonLink: 'https://www.amazon.in/dp/B09ABCD123',
      flipkartLink: 'https://www.flipkart.com/sony-wf-c500/p/itm345678'
    }
  ],
  'laptop': [
    {
      id: 'laptop-1',
      name: 'HP Pavilion 15',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      price: '₹45,990',
      features: [
        'Intel Core i5 12th Gen',
        '8GB RAM, 512GB SSD',
        '15.6" FHD Display'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0XYZ123',
      flipkartLink: 'https://www.flipkart.com/hp-pavilion-15/p/itm123456'
    },
    {
      id: 'laptop-2',
      name: 'ASUS VivoBook 15',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
      price: '₹52,990',
      features: [
        'AMD Ryzen 5 5600H',
        '16GB RAM, 512GB SSD',
        '15.6" FHD IPS Display'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0ABC123',
      flipkartLink: 'https://www.flipkart.com/asus-vivobook-15/p/itm789012'
    },
    {
      id: 'laptop-3',
      name: 'Lenovo IdeaPad Gaming 3',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      price: '₹64,990',
      features: [
        'AMD Ryzen 5 5600H',
        '8GB RAM, 512GB SSD',
        'NVIDIA GTX 1650 Graphics'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0DEF123',
      flipkartLink: 'https://www.flipkart.com/lenovo-ideapad-gaming-3/p/itm345678'
    }
  ],
  'running shoes': [
    {
      id: 'shoes-1',
      name: 'Nike Revolution 6',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      price: '₹3,995',
      features: [
        'Lightweight mesh upper',
        'Nike React foam cushioning',
      ],
      amazonLink: 'https://www.amazon.in/dp/B0XYZ123',
      flipkartLink: 'https://www.flipkart.com/nike-revolution-6/p/itm123456'
    },
    {
      id: 'shoes-2',
      name: 'Adidas Runfalcon 2.0',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
      price: '₹4,999',
      features: [
        'Cloudfoam midsole',
        'Breathable mesh upper',
      ],
      amazonLink: 'https://www.amazon.in/dp/B0ABC123',
      flipkartLink: 'https://www.flipkart.com/adidas-runfalcon/p/itm789012'
    },
    {
      id: 'shoes-3',
      name: 'Puma Speed 600',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      price: '₹3,499',
      features: [
        'SoftFoam+ insole',
        'Rubber outsole for grip',
      ],
      amazonLink: 'https://www.amazon.in/dp/B0DEF123',
      flipkartLink: 'https://www.flipkart.com/puma-speed-600/p/itm345678'
    }
  ],
  'smartwatch': [
    {
      id: 'watch-1',
      name: 'Fire-Boltt Ninja 3',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      price: '₹1,799',
      features: [
        '1.69" HD Display',
        '100+ sports modes',
        '7 days battery life'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0XYZ123',
      flipkartLink: 'https://www.flipkart.com/fire-boltt-ninja-3/p/itm123456'
    },
    {
      id: 'watch-2',
      name: 'Noise ColorFit Pro 4',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      price: '₹2,999',
      features: [
        '1.78" AMOLED Display',
        '150+ watch faces',
        'SpO2 & Heart Rate monitor'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0ABC123',
      flipkartLink: 'https://www.flipkart.com/noise-colorfit-pro-4/p/itm789012'
    },
    {
      id: 'watch-3',
      name: 'Samsung Galaxy Watch 4',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      price: '₹19,999',
      features: [
        '1.4" Super AMOLED',
        'ECG & BIA sensor',
        'Wear OS by Google'
      ],
      amazonLink: 'https://www.amazon.in/dp/B0DEF123',
      flipkartLink: 'https://www.flipkart.com/samsung-galaxy-watch-4/p/itm345678'
    }
  ]
}

// Extract product type from user message
function extractProductType(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  const productTypes = ['wireless earbuds', 'earbuds', 'laptop', 'running shoes', 'shoes', 'smartwatch', 'watch']
  
  for (const type of productTypes) {
    if (lowerMessage.includes(type)) {
      if (type === 'earbuds') return 'wireless earbuds'
      if (type === 'shoes') return 'running shoes'
      if (type === 'watch') return 'smartwatch'
      return type
    }
  }
  return null
}

// Check if message contains budget information
function extractBudget(message: string): string | null {
  const budgetMatch = message.match(/₹?\s*(\d+[\d,]*)\s*(?:thousand|k|rs|rupees)?/i)
  if (budgetMatch) {
    return budgetMatch[1].replace(/,/g, '')
  }
  return null
}

// Check if message contains usage information
function extractUsage(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  const usageKeywords = ['daily', 'gaming', 'office', 'running', 'work', 'casual', 'sports']
  for (const keyword of usageKeywords) {
    if (lowerMessage.includes(keyword)) {
      return keyword
    }
  }
  return null
}

// Generate AI response based on user message and context
function generateAIResponse(message: string, context: UserContext): AIResponse {
  const lowerMessage = message.toLowerCase()
  
  // Extract product type if not already in context
  const productType = context.productType || extractProductType(message)
  const budget = context.budget || extractBudget(message)
  const usage = context.usage || extractUsage(message)

  // If no product type detected, ask what they want to buy
  if (!productType) {
    return {
      answer: "I'd be happy to help you find the perfect product! What are you looking to buy today? You can say something like 'I want to buy wireless earbuds' or 'I need a laptop'.",
      needsFollowUp: true
    }
  }

  // If product type detected but no budget, ask for budget and usage
  if (!budget && !usage) {
    return {
      answer: `Great! I can help you find the best ${productType} from Amazon India and Flipkart. To give you the most relevant recommendations, could you tell me:\n\n1. What's your budget? (e.g., ₹5,000 or ₹10,000)\n2. How will you use it? (daily use, gaming, office work, running, etc.)`,
      needsFollowUp: true,
      followUpQuestion: 'budget_and_usage'
    }
  }

  // If budget but no usage, ask for usage
  if (budget && !usage) {
    return {
      answer: `Thanks! For a budget of ₹${budget}, I can find some great ${productType} options. How do you plan to use it? (daily use, gaming, office work, running, etc.)`,
      needsFollowUp: true,
      followUpQuestion: 'usage'
    }
  }

  // If usage but no budget, ask for budget
  if (usage && !budget) {
    return {
      answer: `Perfect! For ${usage} use, I can recommend some excellent ${productType}. What's your budget range? (e.g., ₹5,000 or ₹10,000)`,
      needsFollowUp: true,
      followUpQuestion: 'budget'
    }
  }

  // All information collected - return products
  const products = mockProductDatabase[productType] || []
  
  // Filter products by budget if provided
  let filteredProducts = products
  if (budget) {
    const budgetNum = parseInt(budget)
    // Simple filtering - in real app, would use actual product prices
    filteredProducts = products.slice(0, 3) // Return top 3 for now
  }

  return {
    answer: `Here are the best ${productType} options for you${budget ? ` within ₹${budget}` : ''}${usage ? ` for ${usage} use` : ''}:\n\nI've curated these from Amazon India and Flipkart. Each product includes key features and direct links to purchase.`,
    products: filteredProducts,
    needsFollowUp: false
  }
}

// API route handler - processes chat messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate AI response
    const response = generateAIResponse(message, context || {})

    // Simulate API delay (in real app, this would be OpenAI API call)
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
