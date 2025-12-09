# Vynce Social - Frontend Application

A modern, production-ready social media platform built with Next.js, React, and TailwindCSS.

## Features

✅ **Multiple Themes** - Vynce Nebula, Cosmic Retro, and more with smooth transitions
✅ **Rich Animations** - Micro-interactions, stagger animations, smooth transitions
✅ **Real-time Messaging** - WhatsApp-style chat interface
✅ **Story Capsules** - Timed content viewing with progress tracking
✅ **Post Interactions** - Like, save, comment, share functionality
✅ **User Profiles** - Follow/unfollow, bio, stats
✅ **Notifications** - Real-time notification system
✅ **Responsive Design** - Mobile-first, low-end device optimized
✅ **Error Handling** - Comprehensive error boundaries & loading states
✅ **Type Safety** - Full TypeScript support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repo-url>
cd vynce-social

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
c:\dev\vynce-social\
├── app/
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & animations
├── components/
│   ├── pages/             # Page components
│   ├── layout/            # Layout components
│   ├── ui/                # Reusable UI components
│   ├── PostActions/       # Post interaction modals
│   ├── theme/             # Theme selector
│   └── ErrorBoundary.tsx  # Error handling
├── lib/
│   ├── store.ts           # Zustand state management
│   ├── api.ts             # API client
│   ├── theme.ts           # Theme configuration
│   ├── validation.ts      # Form validation
│   ├── analytics.ts       # Event tracking
│   └── hooks/             # Custom React hooks
├── config/
│   └── themes.ts          # Theme definitions
├── types/
│   └── index.ts           # TypeScript definitions
└── public/                # Static assets
```

## State Management

Uses Zustand for global state:

```typescript
import { useAppStore } from "@/lib/store";

const { currentPage, setCurrentPage } = useAppStore();
```

## API Integration

All API calls go through the `apiClient`:

```typescript
import { apiClient } from "@/lib/api";

const response = await apiClient.getPosts(1, 20);
```

For custom hooks with automatic loading/error handling:

```typescript
import { useApi } from "@/lib/hooks";

const { data, loading, error, execute } = useApi(() => apiClient.getPosts(), { autoFetch: true });
```

## Form Validation

```typescript
import { validators, validateForm } from "@/lib/validation";

const errors = validateForm(formData, {
  username: validators.username,
  email: validators.email,
  password: validators.password,
});
```

## Analytics

```typescript
import { trackPageView, trackUserAction } from "@/lib/analytics";

trackPageView("home");
trackUserAction("post_liked", { postId: 123 });
```

## Themes

Available themes:

- **Vynce Nebula** (Premium)
- **Cosmos Dark** (Cosmic)
- **Neon Dream** (Vibrant)
- **Forest Mist** (Natural)
- **Solar Flare** (Vibrant)
- **Cosmic Retro** (Cosmic)

Customize in `config/themes.ts`

## Performance Optimizations

- ✅ Code splitting & lazy loading
- ✅ Image optimization
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Bundle analysis available: `npm run analyze`
- ✅ Low-end device optimizations (reduced animations, blur)
- ✅ Local storage persistence for critical state

## Accessibility

- ✅ Respects `prefers-reduced-motion`
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support

## Backend Integration

See `BACKEND_INTEGRATION.md` for complete API documentation and integration guide.

## Security

- ✅ Content Security Policy headers
- ✅ XSS protection
- ✅ CSRF token support
- ✅ Input validation
- ✅ Secure storage of sensitive data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT

## Support

For issues or questions, contact the development team.

## Drops

- Trending posts from your gang
