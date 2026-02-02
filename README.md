# FyndMate - AI Shopping Advisor

A ChatGPT/Perplexity-style AI shopping advisor that helps users find products from **Amazon India** and **Flipkart** through natural conversation.

## Features

✅ **Chat Interface** - Clean, minimal chat UI similar to ChatGPT/Perplexity
- User messages on right, AI messages on left
- Typing animation while AI is thinking
- Auto-scroll to latest message

✅ **Smart Follow-up Questions**
- Automatically asks for budget, usage, and brand preferences
- Context-aware conversation flow

✅ **Product Recommendations**
- Displays 3-5 product cards with images, specs, and prices
- Each product has direct links to Amazon India and Flipkart
- Ready for affiliate link integration

✅ **Quick Suggestions**
- One-click prompts: "I want to buy wireless earbuds", "I want to buy a laptop", etc.

✅ **Source Rule**
- **ONLY** suggests products from Amazon India and Flipkart
- Never suggests offline stores or other platforms
- Always redirects to Amazon/Flipkart for purchase

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **AI**: Mock OpenAI-compatible structure (ready for real API)
- **Product Data**: Mock database (ready for Amazon/Flipkart APIs)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── api/
│   └── chat/
│       └── route.ts          # Gemini AI Brain (The Logic)
├── chat/
│   └── page.tsx              # The AI Chat Room interface
├── components/
│   ├── animated-stars.tsx    # Background star animations
│   ├── cursor-glow.tsx       # Interactive mouse effect
│   ├── ProductCard.tsx       # Dark mode product cards
│   └── TypingIndicator.tsx   # Neon green typing dots
├── page.tsx                  # Landing Page (The Entrance)
├── types.ts                  # Shared data definitions
└── globals.css               # Global styles & Tailwind
```

## How It Works

1. **User sends a message** (e.g., "I want to buy wireless earbuds")
2. **AI asks follow-up questions** (budget, usage, brand preference)
3. **User provides details**
4. **AI returns product recommendations** with:
   - Product name, image, price
   - Key features (3 bullets)
   - "Buy on Amazon" and "Buy on Flipkart" buttons

## API Structure

The chat API (`/api/chat`) accepts:
```json
{
  "message": "I want to buy wireless earbuds",
  "context": {
    "productType": "wireless earbuds",
    "budget": "5000",
    "usage": "daily"
  }
}
```

Returns:
```json
{
  "answer": "Here are the best options...",
  "products": [
    {
      "id": "earbuds-1",
      "name": "Boat Airdopes 141",
      "image": "https://...",
      "price": "₹1,299",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "amazonLink": "https://amazon.in/...",
      "flipkartLink": "https://flipkart.com/..."
    }
  ],
  "needsFollowUp": false
}
```

## Future Integration

The code is structured to easily replace:

1. **Mock AI** → Real OpenAI API (or compatible)
   - Update `/app/api/chat/route.ts` with actual API calls

2. **Mock Products** → Amazon/Flipkart Affiliate APIs
   - Replace `mockProductDatabase` with real API calls
   - Add product search, filtering, and pricing

3. **Add Features**
   - User authentication (ask before adding)
   - Database for chat history (ask before adding)
   - Image upload for product search
   - Product comparison view

## Notes

- Currently uses mock data for demonstration
- Product links are placeholder URLs (replace with real affiliate links)
- AI responses are simulated (1-second delay)
- Ready for production with real API integration

## Branding

- **App Name**: FyndMate
- **Tagline**: "Your AI Shopping Advisor"
- **Focus**: Amazon India & Flipkart only
