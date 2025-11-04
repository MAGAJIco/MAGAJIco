
# MagajiCo Sports Platform - Monorepo Structure

## Current Structure (Hybrid Monorepo)

```
magajico-sports-platform/
├── apps/                          # Future: Individual applications
│   └── web/                       # Main Next.js app (to be moved)
├── packages/                      # Future: Shared packages
│   ├── ui/                        # Shared UI components
│   ├── api-client/                # API client library
│   ├── types/                     # Shared TypeScript types
│   └── utils/                     # Shared utilities
├── src/                           # Current: Next.js app source
│   ├── app/                       # App router pages
│   ├── components/                # React components
│   ├── styles/                    # Global styles
│   └── hook/                      # Custom hooks
├── public/                        # Static assets
├── main.py                        # Python FastAPI backend
├── sports_api.py                  # Sports API library
├── requirements.txt               # Python dependencies
├── package.json                   # Root package.json (workspace config)
└── .replit                        # Replit configuration

## Migration Path to Full Monorepo

### Phase 1: Current Setup (Production Ready)
- ✅ Hybrid structure with Next.js frontend and Python backend
- ✅ Workspace configuration in package.json
- ✅ Deployment ready with proper build/start scripts

### Phase 2: Package Extraction (Future)
1. Extract shared UI components to `packages/ui`
2. Move API types to `packages/types`
3. Create `packages/api-client` for backend communication
4. Extract utilities to `packages/utils`

### Phase 3: App Isolation (Future)
1. Move Next.js app to `apps/web`
2. Create additional apps (admin dashboard, mobile API, etc.)
3. Share packages across apps

## Workspace Benefits

- **Code Sharing**: Shared packages across multiple apps
- **Consistent Dependencies**: Centralized dependency management
- **Atomic Changes**: Update multiple packages/apps together
- **Build Optimization**: Build only what changed
- **Type Safety**: Share TypeScript types across boundaries

## Scripts

### Development
- `npm run dev` - Start Next.js development server
- `npm run api:dev` - Start Python API with hot reload

### Production
- `npm run build` - Build Next.js for production
- `npm run start` - Start production server
- `npm run api:start` - Start Python API in production mode

### Deployment (Replit)
- Build: `npm run build`
- Start: `npm run start`
- Backend: Runs separately on port 8000

## Environment Variables

See `.env.example` for configuration options.

## Scalability Features

1. **Horizontal Scaling**: Frontend and backend can scale independently
2. **Microservices Ready**: API can be split into multiple services
3. **Multi-tenant**: Support for multiple locales (en, es, fr, de)
4. **CDN Ready**: Static assets can be served from CDN
5. **Database Ready**: Easy to add PostgreSQL or other databases
