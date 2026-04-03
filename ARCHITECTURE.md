# FyndMate — Technical Architecture Document

> **Version:** 1.0  
> **Last Updated:** April 2026  
> **Platform:** AI-Powered Shopping & Styling (India-first)

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [AI/ML Models](#5-aiml-models)
6. [Data Pipeline & Infrastructure](#6-data-pipeline--infrastructure)
7. [DevOps & Deployment](#7-devops--deployment)
8. [Security & Privacy](#8-security--privacy)
9. [Third-Party Integrations](#9-third-party-integrations)
10. [Development Phases](#10-development-phases)
11. [Risk Mitigation](#11-risk-mitigation)

---

## 1. Platform Overview

FyndMate is an AI-powered smart shopping and styling platform that solves two core problems Indian online shoppers face:

| Problem | FyndMate Solution |
|---|---|
| Decision fatigue across too many products | **AI Product Finder** — natural language shopping assistant |
| Uncertainty about how clothes look before buying | **AI Designer** — personalized digital avatar + virtual try-on |

### Two Core Intelligent Systems

```
┌─────────────────────────────────────────────────────────────────┐
│                         FYNDMATE PLATFORM                        │
│                                                                   │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐  │
│  │     AI PRODUCT FINDER    │   │         AI DESIGNER          │  │
│  │                          │   │                              │  │
│  │  • Natural language NLU  │   │  • Personal avatar creation  │  │
│  │  • Budget-aware search   │   │  • Virtual try-on (clothes)  │  │
│  │  • Fake review detection │   │  • Outfit combinations       │  │
│  │  • Pros/cons summary     │   │  • Occasion-based styling    │  │
│  │  • Amazon + Flipkart     │   │  • Confidence scoring        │  │
│  │    product links         │   │  • Save & share looks        │  │
│  └─────────────────────────┘   └─────────────────────────────┘  │
│                                                                   │
│              Powered by unified AI/ML backend                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. High-Level System Architecture

```
                          ┌──────────────┐
                          │   End Users   │
                          │ (Web / Mobile)│
                          └──────┬───────┘
                                 │ HTTPS
                          ┌──────▼───────┐
                          │  CDN / Edge   │
                          │  (Cloudflare) │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │  API Gateway  │
                          │  (Rate limit, │
                          │   Auth, Route)│
                          └──────┬───────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼──────┐         ┌───────▼──────┐        ┌───────▼──────┐
│  User Service │         │Product Service│        │  AI/ML Service│
│  Auth/Profiles│         │Catalog/Prices │        │  Inference    │
└───────┬───────┘         └───────┬───────┘        └───────┬───────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼──────┐         ┌───────▼──────┐        ┌───────▼──────┐
│  Recommend.   │         │  Payment/     │        │ Notification  │
│  Engine Svc   │         │  Affiliate Svc│        │  Service      │
└───────┬───────┘         └───────┬───────┘        └───────┬───────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼──────┐         ┌───────▼──────┐        ┌───────▼──────┐
│  PostgreSQL   │         │  MongoDB      │        │  Redis Cache  │
│  (Users/Auth) │         │  (Products)   │        │  (Sessions)   │
└───────────────┘         └───────────────┘        └───────────────┘
```

---

## 3. Backend Architecture

### 3.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| API Gateway | Kong / AWS API Gateway | Rate limiting, auth middleware, routing |
| Primary API | Node.js + Fastify | High-throughput, low-latency REST API |
| AI Service | Python + FastAPI | ML ecosystem (PyTorch, HuggingFace, scikit-learn) |
| Task Queue | Redis + BullMQ | Async jobs (review scraping, price updates) |
| Relational DB | PostgreSQL 16 | Users, orders, affiliates, sessions |
| Document DB | MongoDB | Product catalog, reviews, style collections |
| Cache | Redis 7 | Session store, product cache, recommendation cache |
| Search | Elasticsearch 8 | Full-text product search, Hinglish tokenization |
| Object Storage | AWS S3 / Cloudflare R2 | Avatar images, outfit photos, ML model weights |
| Message Broker | Apache Kafka | Event streaming between services |

### 3.2 Microservices Breakdown

#### User Service
```
Responsibilities:
  ├── Registration & authentication (JWT + refresh tokens)
  ├── Social login (Google, Apple)
  ├── User profile (body measurements, style preferences)
  ├── Saved products & wishlists
  └── Notification preferences

Endpoints:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/refresh
  GET    /users/:id/profile
  PUT    /users/:id/profile
  GET    /users/:id/preferences
  PUT    /users/:id/preferences
  GET    /users/:id/saved-items
  POST   /users/:id/saved-items
  DELETE /users/:id/saved-items/:itemId
```

#### Product Service
```
Responsibilities:
  ├── Product catalog management
  ├── Real-time price aggregation (Amazon + Flipkart)
  ├── Review ingestion & storage
  ├── Price history tracking
  └── Product metadata enrichment

Endpoints:
  GET    /products/search?q=...&budget=...&category=...
  GET    /products/:id
  GET    /products/:id/reviews
  GET    /products/:id/price-history
  GET    /products/compare?ids=...
  POST   /products/aggregate          (internal: trigger price refresh)
```

#### Recommendation Engine Service
```
Responsibilities:
  ├── Context-aware product ranking
  ├── Personalization scoring
  ├── "Best for you" badge logic
  └── Alternative product suggestions

Endpoints:
  POST   /recommendations/products     (product finder)
  POST   /recommendations/outfits      (designer mode)
  GET    /recommendations/trending
  POST   /recommendations/feedback     (thumbs up/down)
```

#### AI/ML Service
```
Responsibilities:
  ├── NLU intent parsing (chat messages)
  ├── Fake review detection inference
  ├── Avatar generation
  ├── Virtual try-on inference
  └── Outfit scoring

Endpoints:
  POST   /ai/parse-intent              (NLU pipeline)
  POST   /ai/analyze-reviews/:productId
  POST   /ai/generate-avatar           (body params → avatar image)
  POST   /ai/try-on                    (avatar + garment → composite)
  POST   /ai/outfit-score              (outfit combination → confidence)
```

#### Payment / Affiliate Service
```
Responsibilities:
  ├── Affiliate link generation (Amazon Associates, Flipkart Affiliate)
  ├── Click tracking & attribution
  ├── Commission analytics
  └── Deep-link management

Endpoints:
  POST   /affiliate/generate-link
  GET    /affiliate/analytics
  POST   /affiliate/track-click
```

#### Notification Service
```
Responsibilities:
  ├── Push notifications (price drops, outfit suggestions)
  ├── Email digests
  └── In-app alerts

Endpoints:
  POST   /notifications/send
  GET    /notifications/:userId
  PUT    /notifications/:notificationId/read
```

### 3.3 Database Schema (Key Entities)

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id          UUID REFERENCES users(id),
  style_tags       TEXT[],        -- e.g. ['casual', 'minimalist']
  budget_min       INTEGER,
  budget_max       INTEGER,
  body_height_cm   INTEGER,
  body_weight_kg   INTEGER,
  body_type        TEXT,          -- e.g. 'hourglass', 'rectangle'
  skin_tone        TEXT,
  favourite_brands TEXT[],
  sizes            JSONB,         -- {"top": "M", "bottom": "32", "shoe": "9"}
  PRIMARY KEY (user_id)
);

-- Saved Items
CREATE TABLE saved_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  product_id  TEXT NOT NULL,
  source      TEXT,              -- 'amazon' | 'flipkart'
  saved_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Looks (Designer feature)
CREATE TABLE saved_looks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  name        TEXT,
  items       JSONB,             -- array of product references
  preview_url TEXT,
  occasion    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

```javascript
// MongoDB: Product Document Schema
{
  _id: ObjectId,
  external_id: "ASIN_or_FKID",
  source: "amazon" | "flipkart",
  name: String,
  category: String,             // "laptop", "dress", "sneakers"
  sub_category: String,
  brand: String,
  price_inr: Number,
  price_history: [{ date: Date, price: Number }],
  images: [String],
  features: [String],
  specifications: Object,
  review_summary: {
    avg_rating: Number,
    total_reviews: Number,
    fake_review_percentage: Number,   // ML-computed
    adjusted_rating: Number,          // after removing fake reviews
    sentiment_breakdown: {
      positive: Number,
      neutral: Number,
      negative: Number
    },
    common_positives: [String],
    common_negatives: [String]
  },
  affiliate_links: {
    amazon: String,
    flipkart: String
  },
  tags: [String],
  last_updated: Date
}
```

### 3.4 API Design

**Base URL:** `https://api.fyndmate.com/v1`

**Authentication:** Bearer JWT in `Authorization` header

**Standard Response Envelope:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-04-03T12:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with given ID was not found",
    "details": {}
  }
}
```

**Core Chat/Recommendation Flow:**
```
POST /v1/chat
Body: {
  "session_id": "sess_xyz",
  "message": "need a laptop under 50000 for college",
  "context": { ... previous turns ... }
}

Response: {
  "success": true,
  "data": {
    "reply": "Here are the best laptops under ₹50,000 for college...",
    "intent": { "category": "laptop", "budget_max": 50000, "use_case": "college" },
    "products": [ { ...ProductCard... } ],
    "needs_follow_up": false,
    "follow_up_question": null
  }
}
```

---

## 4. Frontend Architecture

### 4.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/SSG, SEO, React Server Components |
| Language | TypeScript | Type safety across entire codebase |
| Styling | Tailwind CSS | Utility-first, consistent design tokens |
| UI Components | shadcn/ui + Radix UI | Accessible, unstyled primitives |
| State Management | Zustand | Lightweight, no boilerplate |
| Server State | TanStack Query (React Query) | Caching, background refetch, pagination |
| Forms | React Hook Form + Zod | Performant, schema-validated forms |
| Animations | Framer Motion | Smooth transitions (avatar, try-on) |
| 3D/WebGL | Three.js / React Three Fiber | 3D avatar rendering |
| PWA | next-pwa | Offline support, install prompt |
| Mobile (future) | React Native + Expo | Cross-platform iOS/Android from shared logic |

### 4.2 Application Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (app)/
│   ├── chat/
│   │   └── page.tsx              # AI Product Finder chat
│   │
│   ├── designer/
│   │   ├── page.tsx              # AI Designer landing
│   │   ├── avatar/page.tsx       # Avatar creation flow
│   │   └── try-on/page.tsx       # Virtual try-on interface
│   │
│   ├── search/
│   │   └── page.tsx              # Search results
│   │
│   ├── saved/
│   │   ├── products/page.tsx     # Saved products
│   │   └── looks/page.tsx        # Saved outfits/looks
│   │
│   └── dashboard/
│       └── page.tsx              # User dashboard & history
│
├── api/
│   ├── chat/route.ts             # Chat proxy to AI service
│   ├── products/route.ts         # Product search proxy
│   └── avatar/route.ts           # Avatar/try-on proxy
│
├── components/
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   └── TypingIndicator.tsx
│   │
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCarousel.tsx
│   │   └── ProductComparison.tsx
│   │
│   ├── designer/
│   │   ├── AvatarCanvas.tsx      # Three.js avatar renderer
│   │   ├── OutfitPanel.tsx
│   │   └── StyleConfidenceScore.tsx
│   │
│   └── ui/                       # shadcn/ui base components
│
├── lib/
│   ├── api.ts                    # Typed API client
│   ├── store.ts                  # Zustand stores
│   └── utils.ts
│
├── hooks/
│   ├── useChat.ts
│   ├── useProducts.ts
│   └── useAvatar.ts
│
└── types.ts
```

### 4.3 Key User Flows

#### Flow 1: AI Product Finder
```
Landing Page
    │
    ▼
Chat Interface ──► User types: "I need earbuds under ₹3000 for gym"
    │
    ▼
AI parses intent ──► asks follow-up (wired/wireless? brand?)
    │
    ▼
Product Cards displayed (3–5 results)
    │
    ├── Click "Buy on Amazon" ──► Affiliate deep-link
    ├── Click "Buy on Flipkart" ──► Affiliate deep-link
    └── Click "Save" ──► Saved Products list
```

#### Flow 2: AI Designer (Virtual Try-On)
```
Designer Landing
    │
    ▼
Avatar Creation
    ├── Body type selection (or photo upload in v2)
    ├── Height / weight input
    ├── Skin tone picker
    └── Hair style selection
    │
    ▼
Avatar rendered (Three.js / 2D composite in MVP)
    │
    ▼
Browse outfits / Upload garment image
    │
    ▼
Virtual Try-On result with Confidence Score
    │
    ├── Mix & match outfits
    ├── Save look
    └── Buy items → Affiliate links
```

#### Flow 3: Search & Discovery
```
Search bar (Hinglish supported)
    │
    ▼
Entity extraction (budget, category, occasion, body type)
    │
    ▼
Filtered results with "Best for You" badges
    │
    ▼
Filter refinement sidebar
    │
    ▼
Product detail → Add to saved / Try on (fashion items)
```

### 4.4 State Management

```typescript
// Zustand stores
interface ChatStore {
  sessions: ChatSession[]
  activeSessionId: string
  messages: Message[]
  isLoading: boolean
  sendMessage: (text: string) => Promise<void>
  clearSession: () => void
}

interface UserStore {
  user: User | null
  preferences: UserPreferences
  savedItems: Product[]
  savedLooks: Look[]
  setUser: (user: User) => void
  updatePreferences: (prefs: Partial<UserPreferences>) => void
}

interface AvatarStore {
  avatar: AvatarConfig | null
  currentOutfit: OutfitItem[]
  confidenceScore: number
  setAvatarConfig: (config: AvatarConfig) => void
  tryOnItem: (item: OutfitItem) => Promise<void>
}
```

### 4.5 Offline Capabilities (PWA)

- **Cached:** Landing page, chat history (last 10 sessions), saved products & looks
- **Service Worker strategy:** Cache-first for static assets; network-first for live product data
- **Background sync:** Queue "save item" actions when offline; sync on reconnect
- **Install prompt:** Show PWA install banner after second visit on mobile

---

## 5. AI/ML Models

### 5.1 Architecture Overview

```
User Input (text / voice)
        │
        ▼
┌──────────────────┐
│   NLU Pipeline    │
│  (Intent + Entity │
│   Extraction)     │
└────────┬─────────┘
         │
    ┌────▼────────────────────────────────┐
    │          Routing Layer               │
    │   (Product Finder vs AI Designer)    │
    └────┬──────────────────────┬─────────┘
         │                      │
         ▼                      ▼
┌────────────────┐    ┌──────────────────────┐
│  Product Finder│    │   AI Designer         │
│  Pipeline      │    │   Pipeline            │
│                │    │                       │
│ • Retrieval    │    │ • Avatar Generation   │
│ • Ranking      │    │ • Virtual Try-On      │
│ • Fake Review  │    │ • Outfit Scoring      │
│   Detection    │    │ • Style Matching      │
│ • Explanation  │    │ • Color Compatibility │
│   Generation   │    │                       │
└────────────────┘    └──────────────────────┘
```

### 5.2 NLU / Search Pipeline

| Model | Purpose | Technology |
|---|---|---|
| Intent Classifier | Product search vs styling vs FAQ | Fine-tuned BERT / IndicBERT |
| NER (Entity Extraction) | Budget, category, occasion, brand, body type | SpanBERT / custom CRF |
| Hinglish Tokenizer | Handle code-mixed Hindi-English input | IndicNLP + custom BPE vocab |
| Voice-to-Text | Convert speech to text (Hindi + English) | Whisper (OpenAI) or Google Speech-to-Text |
| Query Expansion | Synonym expansion for product search | Word2Vec trained on Indian shopping data |

**Entity Examples:**
```
Input:  "gym ke liye 3000 mein wireless earbuds chahiye"
Output: {
  "intent": "product_search",
  "category": "earbuds",
  "connectivity": "wireless",
  "budget_max": 3000,
  "use_case": "gym",
  "language": "hinglish"
}
```

### 5.3 Product Recommendation Model

```
User Profile + Context
        │
        ▼
┌──────────────────────────┐
│  Feature Engineering     │
│  • User history vectors  │
│  • Category preferences  │
│  • Budget range          │
│  • Collaborative signals │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Candidate Retrieval     │
│  (Approximate NN Search) │
│  Tool: FAISS / Weaviate  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Re-Ranking Layer        │
│  • LightGBM ranker       │
│  • Budget penalty        │
│  • Fake review penalty   │
│  • Personalization boost │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Explanation Generation  │
│  (LLM: Gemini / GPT-4o)  │
│  • Pros / Cons           │
│  • "Best for you" reason │
│  • Common complaints     │
└──────────────────────────┘
```

**Training signals:**
- Click-through rate (CTR) on recommendations
- Affiliate link conversions
- Explicit thumbs up/down feedback
- Dwell time on product cards

### 5.4 Fake Review Detection

```
Review Text + Metadata
        │
        ▼
┌──────────────────────────────┐
│  Feature Extraction           │
│  • Text features (TF-IDF,    │
│    sentiment, burstiness)    │
│  • Reviewer features         │
│    (account age, review      │
│     history, verified badge) │
│  • Temporal patterns         │
│    (review spike detection)  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Ensemble Classifier          │
│  • BERT text classifier      │
│  • Graph Neural Network      │
│    (reviewer–product graph)  │
│  Output: Fake probability    │
│  (0.0 – 1.0)                 │
└──────────────┬───────────────┘
               │
               ▼
  Adjusted Rating = f(real_reviews_only)
  Displayed as: "★ 4.1 (verified)" vs "★ 4.1 (4.3 raw)"
```

### 5.5 Fashion & Styling Models

#### Avatar Generation (MVP: 2D / v2: 3D)

| Phase | Approach | Technology |
|---|---|---|
| v1 MVP | Parameterized 2D avatar from body type selection | SVG/Canvas + body type templates |
| v2 | Photo-to-avatar (user uploads selfie) | InsightFace + body segmentation |
| v3 | Full 3D avatar with cloth simulation | SMPL body model + neural cloth drape |

#### Virtual Try-On

```
Input: Avatar image + Garment image
        │
        ▼
┌─────────────────────────────┐
│  Garment Segmentation        │
│  (remove background,         │
│   isolate clothing item)     │
│  Model: SAM (Meta)           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Try-On Inference            │
│  • Warp garment to body pose │
│  • Blend textures            │
│  Model: HR-VITON / OOTDiff  │
│  (diffusion-based try-on)    │
└──────────────┬──────────────┘
               │
               ▼
  Composite output image (avatar wearing garment)
```

#### Outfit Scoring & Compatibility

```
Outfit Items (list of clothing + accessories)
        │
        ▼
┌──────────────────────────────┐
│  Feature Extraction           │
│  • Color palette extraction  │
│    (dominant colors via K-means)│
│  • Style tag classification  │
│  • Formality classification  │
│  • Season/occasion fit       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Compatibility Model          │
│  • Color harmony rules       │
│    (complementary, analogous)│
│  • Style coherence (casual   │
│    + casual ✓, casual +      │
│    formal ✗)                 │
│  • Occasion appropriateness  │
│  Output: Confidence Score    │
│  (0–100, "87% — Perfect!")   │
└──────────────────────────────┘
```

#### Style Learning System

- Tracks which outfits/saves/purchases each user makes
- Builds a user style vector (embedding) updated on each interaction
- Used to personalize outfit suggestions over time
- Cold-start: uses onboarding style quiz responses

---

## 6. Data Pipeline & Infrastructure

### 6.1 Data Sources

| Source | Data Type | Collection Method | Frequency |
|---|---|---|---|
| Amazon India API / scraping | Product catalog, prices | API + scheduled scraper | Every 6 hours |
| Flipkart Affiliate API | Product catalog, prices | API | Every 6 hours |
| User interactions | Clicks, saves, purchases | Client-side event tracking | Real-time |
| Product reviews | Text reviews, ratings | Scraper + API | Daily |
| Fashion trend data | Style trends, color seasons | External fashion APIs | Weekly |

### 6.2 Data Flow Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Amazon API   │    │ Flipkart API  │    │  User Events  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └──────────┬────────┘                   │
                  │                            │
                  ▼                            ▼
         ┌────────────────┐          ┌────────────────┐
         │  ETL Pipeline   │          │   Kafka Topics  │
         │  (Apache Airflow│          │   (user-events, │
         │   DAGs)         │          │    clicks,      │
         └────────┬────────┘          │    searches)    │
                  │                   └───────┬─────────┘
                  ▼                           │
         ┌────────────────┐                   ▼
         │  Data Warehouse │          ┌────────────────┐
         │  (BigQuery /    │          │ Stream Processor│
         │   Snowflake)    │          │  (Apache Flink) │
         └────────┬────────┘          └───────┬─────────┘
                  │                           │
                  └──────────┬────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Feature Store  │
                    │  (Feast /       │
                    │   Tecton)       │
                    └───────┬─────────┘
                            │
                            ▼
                    ┌────────────────┐
                    │  ML Training   │
                    │  & Serving     │
                    └────────────────┘
```

### 6.3 ETL Processes

**Price Aggregation DAG (runs every 6h):**
```
1. Fetch product list from MongoDB
2. Query Amazon PA-API for updated prices
3. Query Flipkart Affiliate API
4. Diff against current prices
5. Write price history records
6. Invalidate Redis cache for affected products
7. Trigger notification check (price drop alerts)
```

**Review Ingestion DAG (runs daily):**
```
1. Fetch products with review_count_change > 10
2. Scrape/fetch new reviews
3. Run fake review detection model
4. Update adjusted_rating and sentiment summary
5. Write to MongoDB
```

### 6.4 Feature Engineering for ML

| Feature Group | Features | Computation |
|---|---|---|
| User features | Style vector, budget range, interaction history | Batch (daily) |
| Product features | Category embedding, price tier, quality score | Batch (on ingest) |
| Contextual features | Time of day, season, festival proximity | Real-time |
| Cross features | User–category affinity, brand preference | Batch (daily) |

### 6.5 Real-Time vs Batch Processing

| Workload | Type | Latency Target |
|---|---|---|
| Product recommendations (API call) | Real-time serving | < 300 ms |
| Price updates | Near-real-time | < 6 hours |
| Fake review detection (new reviews) | Batch | < 24 hours |
| User style vector update | Near-real-time (stream) | < 5 minutes |
| ML model retraining | Batch | Weekly |
| Avatar try-on inference | Real-time | < 5 seconds |

---

## 7. DevOps & Deployment

### 7.1 Infrastructure

```
Cloud Provider: AWS (primary) + Cloudflare (CDN/edge)

┌─────────────────────────────────────────┐
│             AWS Region (ap-south-1)      │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │  EKS      │  │  RDS     │            │
│  │ (K8s)     │  │ Postgres │            │
│  │ All       │  │ (Multi-AZ│            │
│  │ services  │  │  replica)│            │
│  └──────────┘  └──────────┘            │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │ ElastiCache│  │  S3      │            │
│  │ (Redis)   │  │ (Assets/ │            │
│  │           │  │  Models) │            │
│  └──────────┘  └──────────┘            │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │  MSK      │  │  SageMaker│           │
│  │ (Kafka)   │  │ (ML Infer)│           │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

### 7.2 Containerization

- **Docker** for all services
- **Kubernetes (EKS)** for orchestration
- **Helm charts** for deployment templating
- **Horizontal Pod Autoscaler (HPA)** for auto-scaling under load

### 7.3 CI/CD Pipeline

```
Developer Push
      │
      ▼
┌──────────────┐
│  GitHub       │
│  Actions      │
│  (CI)         │
│  • Lint       │
│  • Type check │
│  • Unit tests │
│  • Build      │
│  • SAST scan  │
└──────┬───────┘
       │ on main merge
       ▼
┌──────────────┐
│  Staging      │
│  Deploy       │
│  (ArgoCD)     │
│  • Integration│
│    tests      │
│  • E2E tests  │
│    (Playwright│
└──────┬───────┘
       │ manual approval
       ▼
┌──────────────┐
│  Production   │
│  Deploy       │
│  (ArgoCD)     │
│  • Blue/green │
│    deployment │
│  • Smoke tests│
│  • Auto-      │
│    rollback   │
└──────────────┘
```

### 7.4 Monitoring & Logging

| Tool | Purpose |
|---|---|
| Prometheus + Grafana | Metrics dashboards (latency, error rate, throughput) |
| AWS CloudWatch | Infrastructure metrics and alarms |
| OpenTelemetry | Distributed tracing across microservices |
| Datadog / New Relic | APM and error tracking |
| ELK Stack (Elasticsearch, Logstash, Kibana) | Centralized log aggregation |
| PagerDuty | On-call alerting |

**Key Metrics to Monitor:**
- API p50/p95/p99 latency
- AI inference time (NLU, try-on, recommendations)
- Affiliate link click-through rate
- Cache hit rate (Redis)
- Fake review detection accuracy (weekly audit)

### 7.5 Scaling Strategy

| Component | Scaling Approach | Trigger |
|---|---|---|
| API services | Horizontal (HPA) | CPU > 70% or RPS threshold |
| ML inference | GPU auto-scaling (SageMaker endpoints) | Queue depth |
| Database reads | Read replicas (RDS) | Read latency > 50ms |
| Search | Elasticsearch cluster scaling | Shard size > 30GB |
| Redis | ElastiCache cluster mode | Memory > 75% |

### 7.6 Cost Optimization

- Spot instances for ML training jobs (70% cost reduction)
- Reserved instances for always-on services (DB, cache)
- S3 Intelligent-Tiering for model weights and old assets
- Aggressive caching (product data changes infrequently)
- Lambda / serverless for notification delivery
- CDN caching for product images (reduces origin bandwidth)

---

## 8. Security & Privacy

### 8.1 Authentication & Authorization

```
┌─────────┐     POST /auth/login      ┌──────────────┐
│  Client  │ ─────────────────────── ▶│  User Service │
└─────────┘                           └──────┬───────┘
     ▲                                       │
     │  JWT Access Token (15 min)            │ Issues:
     │  + Refresh Token (30 days, httpOnly)  │ • Access JWT (RS256)
     └───────────────────────────────────────┘ • Refresh token (stored
                                                 in Redis, rotated)

Authorization: Role-based (RBAC)
  Roles: guest | user | premium_user | admin
  Enforced at API Gateway + service level
```

### 8.2 Data Encryption

| Layer | Encryption |
|---|---|
| Data in transit | TLS 1.3 (all internal + external) |
| Data at rest (DB) | AES-256 (RDS encryption, MongoDB Atlas encryption) |
| Data at rest (S3) | AES-256 (SSE-S3 or SSE-KMS) |
| PII fields in DB | Column-level encryption for email, phone |
| Secrets management | AWS Secrets Manager / HashiCorp Vault |

### 8.3 PII Handling (GDPR & India DPDP Act 2023)

- **Data minimization:** Collect only what is needed (no unnecessary fields)
- **Consent management:** Explicit consent for data collection at signup, with granular toggles
- **Right to erasure:** `/users/:id` DELETE cascades all PII; avatar images purged from S3
- **Data residency:** All user PII stored exclusively in `ap-south-1` (Mumbai) region
- **Audit logs:** All access to PII is logged (who accessed, when, from which service)
- **Data retention:** Chat history: 12 months; Interaction logs: 24 months; then auto-deleted
- **Third-party data sharing:** No user PII shared with affiliate platforms; only anonymized click IDs

### 8.4 Secure API Design

- **Input validation:** Zod schemas on all API inputs (both frontend and backend)
- **SQL injection:** ORM-only queries (Prisma / SQLAlchemy) — no raw SQL with user input
- **Rate limiting:** 100 req/min per user, 10 req/min for auth endpoints (Kong)
- **CORS:** Strict allowlist of origins
- **CSP headers:** Content-Security-Policy, X-Frame-Options, HSTS enabled
- **Dependency scanning:** Snyk in CI pipeline for vulnerability checks
- **OWASP Top 10:** Addressed in security review checklist pre-launch

---

## 9. Third-Party Integrations

### 9.1 E-Commerce Platforms

| Platform | Integration Type | Data Available |
|---|---|---|
| Amazon India (PA-API 5.0) | Official REST API | Products, prices, images, reviews |
| Flipkart Affiliate API | Affiliate REST API | Products, prices, deep links |
| Myntra | Web scraping (until API available) | Fashion catalog, prices |
| Ajio | Web scraping | Fashion catalog, prices |
| Meesho | Evaluate API availability | Budget fashion |

**Amazon PA-API Integration:**
```
Request: SearchItems with Keywords + SearchIndex + MaxPrice
Response: ItemsResult → mapped to Product schema
Rate limit: 1 req/sec (PA-API default); cacheable for 6 hours
```

### 9.2 Payment Gateways (Future — for in-app purchases)

| Gateway | Use Case |
|---|---|
| Razorpay | Indian payments (UPI, cards, netbanking) |
| Stripe | International card payments |
| Both support webhooks for payment confirmation |

### 9.3 AI / ML External APIs

| Service | Use Case | Fallback |
|---|---|---|
| Google Gemini Pro | LLM for recommendation explanations & chat | OpenAI GPT-4o |
| Google Speech-to-Text | Voice search (Hindi + English) | Whisper (self-hosted) |
| Google Vision API | Product image analysis | Self-hosted ResNet |
| HuggingFace Inference API | NLU model hosting (MVP) | Self-hosted on SageMaker |

### 9.4 Social & Analytics

| Service | Purpose |
|---|---|
| Firebase (FCM) | Push notifications (Android + iOS PWA) |
| Mixpanel | Product analytics, funnel tracking |
| Amplitude | Behavioral analytics, A/B testing |
| Segment | Customer Data Platform (CDP), data routing |
| Sentry | Frontend & backend error monitoring |
| Google Analytics 4 | Web traffic analytics |

---

## 10. Development Phases

### Phase 1 — v1 MVP (Months 1–4)

**Goal:** Validate core AI Product Finder with real users

```
┌────────────────────────────────────────────┐
│  v1 MVP Scope                               │
│                                             │
│  ✅ Chat interface (web, mobile-responsive) │
│  ✅ AI chat with Gemini API integration     │
│  ✅ Amazon + Flipkart product search        │
│  ✅ Product cards with affiliate links      │
│  ✅ Basic NLU (intent + entity extraction)  │
│  ✅ Follow-up question logic                │
│  ✅ User auth (email + Google login)        │
│  ✅ Save products                           │
│  ✅ Price display + basic sorting           │
│  ❌ Fake review detection (v2)              │
│  ❌ Avatar / try-on (v2)                    │
│  ❌ Hinglish voice search (v2)              │
└────────────────────────────────────────────┘
```

**Infrastructure:** Minimal (Vercel for Next.js, PlanetScale for Postgres, MongoDB Atlas free tier)

**Team:** 2 engineers (1 fullstack, 1 AI/ML)

### Phase 2 — v2 Growth (Months 5–9)

**Goal:** Add AI Designer, fake review detection, and India-market features

```
┌────────────────────────────────────────────┐
│  v2 Additions                               │
│                                             │
│  ✅ Fake review detection model             │
│  ✅ Adjusted star ratings                   │
│  ✅ AI Designer (2D avatar, parameterized)  │
│  ✅ Basic virtual try-on (2D composite)     │
│  ✅ Outfit suggestion engine                │
│  ✅ Hinglish text search                   │
│  ✅ Voice search (Whisper)                  │
│  ✅ Festival mode (Diwali, wedding, etc.)   │
│  ✅ Price drop alerts                       │
│  ✅ Savings tracker                         │
│  ✅ Social sharing of looks                 │
│  ✅ React Native mobile app (iOS + Android) │
└────────────────────────────────────────────┘
```

**Infrastructure:** Migrate to AWS EKS; add SageMaker for ML inference

**Team:** 5 engineers (2 fullstack, 1 AI/ML, 1 mobile, 1 DevOps)

### Phase 3 — v3 Scale (Months 10–18)

**Goal:** 3D avatars, personalization at scale, monetization

```
┌────────────────────────────────────────────┐
│  v3 Additions                               │
│                                             │
│  ✅ 3D avatar with cloth simulation         │
│  ✅ Diffusion-based virtual try-on          │
│  ✅ Advanced personalization ML             │
│  ✅ B2B API (white-label for retailers)     │
│  ✅ Myntra, Ajio, Meesho integrations       │
│  ✅ AR try-on (phone camera)                │
│  ✅ AI stylist subscription tier            │
│  ✅ Brand partnerships & sponsored placements│
└────────────────────────────────────────────┘
```

---

## 11. Risk Mitigation

### 11.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Amazon PA-API rate limits / access revocation | Medium | High | Cache aggressively; implement Flipkart as primary fallback; explore scraping as last resort |
| AI inference latency > 5s for try-on | High | Medium | Start with 2D composite (fast), move to diffusion only after optimization; show loading UX |
| Fake review model low precision (many false positives) | Medium | Medium | Tune precision/recall threshold; show confidence interval to user; human audit pipeline |
| LLM hallucinations in product recommendations | Medium | High | Ground all responses in real product database; never generate product specs from LLM alone |
| Hinglish NLU poor accuracy | Medium | Medium | Collect training data from real users; start with keyword-based fallback |
| Avatar try-on looks unrealistic | High (v1) | Medium | Set user expectation (illustrative, not photorealistic in MVP); improve with diffusion in v2 |

### 11.2 Business & Compliance Risks

| Risk | Mitigation |
|---|---|
| Amazon affiliate ToS violations | Review ToS carefully; no caching product data beyond allowed periods; display "Prices may vary" disclaimer |
| India DPDP Act 2023 non-compliance | Privacy-by-design from day 1; appoint DPO; consent management system; data residency in India |
| User trust (fake reviews) | Clearly label "Verified Rating" vs raw rating; publish methodology; allow user to dispute |
| Fashion model bias (body type representation) | Train on diverse datasets; include all body types in avatar system; audit for bias quarterly |

### 11.3 Scaling Risks

| Risk | Mitigation |
|---|---|
| Viral traffic spike | Pre-scale infrastructure with load tests; Cloudflare DDoS protection; aggressive CDN caching |
| ML model costs growing with scale | Distill large models to smaller inference-efficient versions; batch non-latency-critical jobs |
| Database bottleneck | Read replicas for product catalog; Redis cache for hot products; CQRS pattern for read/write separation |

---

## Appendix: Technology Summary

| Category | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Zustand, TanStack Query, Three.js |
| **Backend API** | Node.js, Fastify, TypeScript |
| **AI Service** | Python, FastAPI, PyTorch, HuggingFace Transformers |
| **ML Models** | BERT/IndicBERT (NLU), LightGBM (ranking), HR-VITON (try-on), SMPL (avatar) |
| **LLM** | Google Gemini Pro (primary), GPT-4o (fallback) |
| **Databases** | PostgreSQL 16, MongoDB Atlas, Redis 7, Elasticsearch 8 |
| **Data Pipeline** | Apache Kafka, Apache Airflow, Apache Flink, Feature Store (Feast) |
| **Infrastructure** | AWS EKS, RDS, ElastiCache, S3, SageMaker, MSK |
| **DevOps** | GitHub Actions (CI), ArgoCD (CD), Helm, Prometheus, Grafana |
| **Security** | AWS Secrets Manager, JWT (RS256), TLS 1.3, Snyk, OWASP checklist |
| **Analytics** | Mixpanel, Amplitude, Segment, Sentry, GA4 |
| **Mobile (v2)** | React Native, Expo |
