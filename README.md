# Chronos Dashboard

A modern, type-safe dashboard for exploring historical events, births, and deaths from any date in history. Built with Next.js 14, shadcn/ui, and Wikipedia's REST API.

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Historical Events**: Browse events, births, and deaths from any date
- **Interactive Calendar**: Pick dates to explore different days in history
- **Beautiful UI**: Modern design with dark/light mode support
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop
- **Category Tabs**: Switch between Featured, Births, and Deaths
- **Masonry Grid**: Elegant card layout for events
- **Hover Previews**: Quick preview of Wikipedia articles
- **XSS Protection**: Sanitized content from Wikipedia
- **Caching**: Multi-layer caching for fast performance
- **Rate Limiting**: Protection against API abuse

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Animations**: Framer Motion
- **Validation**: Zod
- **Security**: DOMPurify
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd my-history-app

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
WIKIPEDIA_API_URL=https://en.wikipedia.org/api/rest_v1
WIKIPEDIA_API_USER_AGENT=ChronosDashboard/1.0 (https://yourdomain.com; contact@yourdomain.com)
NODE_ENV=development
```

**Optional production variables:**

```env
REDIS_URL=redis://your-redis-url
REDIS_TOKEN=your-redis-token
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
my-history-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts      # Health check endpoint
│   │   │   └── history/route.ts     # History API endpoint
│   │   ├── layout.tsx                # Root layout with theme provider
│   │   └── page.tsx                 # Main dashboard page
│   ├── actions/
│   │   └── fetch-history.ts          # Server action for Wikipedia data
│   ├── components/
│   │   ├── history-card.tsx          # Event card component
│   │   ├── history-card-skeleton.tsx  # Loading skeleton
│   │   ├── history-dashboard-client.tsx # Client-side dashboard
│   │   ├── error-state.tsx            # Error state component
│   │   ├── empty-state.tsx            # Empty state component
│   │   ├── theme-provider.tsx         # Theme provider
│   │   └── ui/                       # shadcn/ui components
│   ├── lib/
│   │   ├── env.ts                    # Environment variables
│   │   ├── errors.ts                 # Error handling
│   │   ├── logger.ts                 # Logging utility
│   │   ├── rate-limiter.ts           # Rate limiting
│   │   ├── cache.ts                  # Caching service
│   │   ├── types.ts                  # TypeScript types
│   │   └── utils.ts                 # Utility functions
│   └── services/
│       └── wikipedia-service.ts       # Wikipedia API service
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

## API Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy" | "degraded",
  "timestamp": "2026-01-18T18:35:27.875Z",
  "services": {
    "wikipedia": "ok" | "degraded" | "unhealthy",
    "cache": "ok"
  },
  "uptime": 14.45
}
```

### POST /api/history

Fetch historical events for a specific date.

**Request:**
```json
{
  "month": 1,
  "day": 18,
  "bypassCache": false
}
```

**Response:**
```json
{
  "events": [
    {
      "year": 2019,
      "text": "An oil pipeline explosion killed 137 people...",
      "pages": [
        {
          "title": "Event Title",
          "extract": "Full description...",
          "thumbnail": {
            "source": "https://...",
            "width": 320,
            "height": 200
          },
          "content_urls": {
            "desktop": {
              "page": "https://en.wikipedia.org/wiki/..."
            }
          }
        }
      ]
    }
  ],
  "births": [...],
  "deaths": [...]
}
```

## Security Features

- **XSS Protection**: All Wikipedia content is sanitized with DOMPurify
- **Input Validation**: Zod schemas validate all inputs
- **CSP Headers**: Content Security Policy configured
- **HSTS Headers**: HTTPS enforced in production
- **Rate Limiting**: 30 requests/minute per IP
- **API Response Validation**: All API responses validated with Zod
- **Image Security**: Next.js Image optimization with domain restrictions
- **Environment Variables**: Type-safe env variable validation

## Caching Strategy

- **L1 Cache**: In-memory cache (5 minutes TTL)
- **L2 Cache**: Next.js built-in fetch cache (24 hours TTL)
- **Cache Key Format**: `history:{month}:{day}`
- **Auto Revalidation**: Stale-while-revalidate pattern

## Key Components

### HistoryCard
Displays historical events with:
- Thumbnail image
- Year badge (color-coded by category)
- Title (underscores removed)
- Extract description
- "Read Article" link to Wikipedia
- Hover card preview
- Bookmark button

### Calendar
Interactive date picker with:
- Month navigation
- Day selection
- Disabled future dates
- Visual feedback for selected date

### Tabs
Category switching:
- **Featured** (amber): Major historical events
- **Births** (emerald): Notable births
- **Deaths** (purple): Notable deaths

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) for historical data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Vercel](https://vercel.com) for Next.js framework
- [Wikimedia Commons](https://commons.wikimedia.org/) for images

## Support

For issues, questions, or suggestions, please open an issue on the repository.
