# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Local Development
- `npm run dev` - Start development server (Next.js 15.1.0)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Key Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL for data fetching
- `NEXT_PUBLIC_GOOGLE_API_KEY` - Google Translate API key for translation services

## Application Architecture

### Technology Stack
- **Framework**: Next.js 15.1.0 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion for complex animations and transitions
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: Custom context-based system (English/Spanish)
- **Charts**: Chart.js with react-chartjs-2 and Recharts
- **State Management**: React Context for language preference

### Project Structure

#### Core Application (`/app`)
- **App Router structure** with layout.tsx as root layout
- **Dynamic routes**: `/services/[service]` for individual service pages
- **Admin section**: Protected admin pages with authentication
- **Page-specific components**: Each major page has its own directory

#### UI Components (`/components`)
- **shadcn/ui library**: Complete set of reusable UI components in `/components/ui/`
- **Custom components**: Business-specific components like Services, Header, Footer
- **Form components**: Booking flow and contact forms with validation

#### Internationalization (`/translations`, `/contexts`)
- **Translation system**: Supports English (`en.ts`) and Spanish (`es.ts`)
- **Context provider**: `LanguageProvider` manages language state with localStorage persistence
- **Google Translate integration**: Automatic translation for dynamic content via `tes()` function

#### Utilities (`/lib`)
- **Styling utilities**: `cn()` function combines clsx and tailwind-merge
- **Date formatting**: Spanish date formatting functions
- **API utilities**: `baseRequest()` handles authenticated API calls
- **Translation service**: `tes()` function for Google Translate integration

### Authentication & Middleware
- **Token-based auth**: Uses cookies (`tempauthtoken`) for session management
- **Middleware**: Automatically fetches and sets auth tokens from backend
- **Admin protection**: Admin routes require authentication

### API Integration
- **Backend communication**: All API calls use `baseRequest()` with Bearer token authentication
- **Error handling**: Graceful fallbacks for network issues and API failures
- **Data fetching**: Reviews, quotes, and appointment data from external API

### Key Features
- **Multi-language support**: Real-time language switching between English and Spanish
- **Responsive design**: Mobile-first approach with Tailwind CSS
- **Animated UI**: Extensive use of Framer Motion for smooth transitions
- **Service booking**: Multi-step booking flow with calendar integration
- **Review system**: Customer testimonials with pagination and translations
- **Contact forms**: Quote requests with validation and submission feedback

### Development Notes
- **Static optimization disabled**: Uses `export const dynamic = "force-dynamic"` in layout
- **Build configuration**: TypeScript and ESLint errors ignored during build (see next.config.mjs)
- **Image optimization disabled**: `unoptimized: true` in next.config
- **Import patterns**: Uses `@/` alias for absolute imports from project root