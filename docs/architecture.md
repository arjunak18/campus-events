# Campus Events Calendar — Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Mobile App                         │
│          (React Native / Expo / TypeScript)           │
│                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │  Home    │ │ Explore  │ │ Create   │ │ Profile │ │
│  │ Calendar │ │ Search   │ │ Event    │ │ Saved   │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │        Expo Router (File-based Navigation)       │ │
│  └─────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────┐ │
│  │  TanStack Query │ React Hook Form │ Zod         │ │
│  └─────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Supabase JS Client (Auth + Realtime)           │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS (REST API)
                       ▼
┌──────────────────────────────────────────────────────┐
│                Express.js Backend                     │
│              (Node.js / TypeScript)                   │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Middleware: Auth │ Validate │ RateLimit │ CORS   │ │
│  └─────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Routes → Controllers → Services                  │ │
│  └─────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────┐ │
│  │ Supabase Admin Client (Service Role)             │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                  Supabase                             │
│                                                       │
│  ┌────────────┐  ┌───────────┐  ┌─────────────────┐ │
│  │ PostgreSQL │  │ Auth      │  │ Storage         │ │
│  │ + RLS      │  │ (JWT)     │  │ (Event Posters) │ │
│  └────────────┘  └───────────┘  └─────────────────┘ │
│  ┌────────────┐  ┌───────────┐                       │
│  │ Realtime   │  │ Edge      │                       │
│  │ (optional) │  │ Functions │                       │
│  └────────────┘  └───────────┘                       │
└──────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication
1. User enters credentials in mobile app
2. Mobile app calls Supabase Auth directly (signUp/signIn)
3. Supabase returns JWT access token + refresh token
4. Mobile app stores tokens securely (expo-secure-store)
5. For API calls, mobile app sends JWT in Authorization header
6. Express backend verifies JWT with Supabase Auth
7. Backend extracts user ID and role from verified token

### Event Creation
1. User fills event form in mobile app
2. Mobile app uploads poster to Supabase Storage
3. Mobile app sends event data to Express API
4. Backend validates data with Zod schemas
5. Backend verifies user permissions
6. Backend inserts event into PostgreSQL
7. Backend triggers notifications for followers
8. Response returned to mobile app

### Event Discovery
1. User searches or browses on Explore screen
2. Mobile app sends query params to Express API
3. Backend builds PostgreSQL query with filters
4. RLS ensures user only sees authorized events
5. Paginated results returned
6. TanStack Query caches results on mobile

## Security Layers

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS |
| Authentication | Supabase Auth (JWT) |
| Authorization | Role-based middleware + RLS |
| Input Validation | Zod (client + server) |
| Rate Limiting | express-rate-limit |
| Data Access | Row Level Security (PostgreSQL) |
| File Security | Storage policies (Supabase) |
| Secret Management | Environment variables |

## Scalability Considerations

- **Multi-college**: College ID on events enables filtering; college-scoped organizations
- **Database**: PostgreSQL indexes on frequently queried fields
- **Caching**: TanStack Query deduplication and stale-while-revalidate
- **Pagination**: Cursor or offset-based pagination on all list endpoints
- **Storage**: Supabase Storage with CDN for media delivery
- **Notifications**: Server-side scheduling for time-critical notifications
