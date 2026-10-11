# Campus Events Calendar — API Reference

## Base URL

Development: `http://localhost:3000/api`
Production: `https://your-api-domain.com/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <supabase-access-token>
```

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

---

## Endpoints

### Health Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Service health check |

---

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register profile after Supabase signup |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PATCH | `/api/auth/me` | Yes | Update current user profile |

---

### Events

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/events` | No | List/search events (paginated) |
| GET | `/api/events/:id` | No | Get event details |
| POST | `/api/events` | Yes | Create a new event |
| PATCH | `/api/events/:id` | Yes | Update an event (owner/admin only) |
| DELETE | `/api/events/:id` | Yes | Delete an event (owner/admin only) |

#### Query Parameters for GET /api/events

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `search` | string | Search in title, description |
| `category` | UUID | Filter by category ID |
| `college` | UUID | Filter by college ID |
| `organization` | UUID | Filter by organization ID |
| `dateFrom` | ISO date | Events starting from this date |
| `dateTo` | ISO date | Events ending by this date |
| `status` | string | Event status filter |
| `visibility` | string | Visibility filter |
| `isOnline` | boolean | Online events only |
| `isFree` | boolean | Free events only |
| `sort` | string | Sort field (date, created_at, popularity) |
| `order` | string | Sort order (asc, desc) |

---

### Colleges

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/colleges` | No | List all colleges |
| GET | `/api/colleges/:id` | No | Get college details |
| GET | `/api/colleges/:id/events` | No | List events for a college |

---

### Organizations

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/organizations` | No | List organizations |
| GET | `/api/organizations/:id` | No | Get organization details |
| POST | `/api/organizations` | Yes | Create an organization |
| PATCH | `/api/organizations/:id` | Yes | Update org (admin/owner only) |
| GET | `/api/organizations/:id/events` | No | List org's events |

---

### Registrations

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/events/:id/registrations` | Yes | Register for an event |
| DELETE | `/api/events/:id/registrations/me` | Yes | Cancel registration |
| GET | `/api/me/registrations` | Yes | List user's registrations |

---

### Saved Events

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/me/saved-events` | Yes | List saved events |
| POST | `/api/me/saved-events/:eventId` | Yes | Save an event |
| DELETE | `/api/me/saved-events/:eventId` | Yes | Unsave an event |

---

### Notifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/me/notifications` | Yes | List notifications |
| PATCH | `/api/me/notifications/:id/read` | Yes | Mark as read |
| POST | `/api/me/notifications/read-all` | Yes | Mark all as read |

---

### Reports

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/events/:id/reports` | Yes | Report an event |

---

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/reports` | Admin | List all reports |
| PATCH | `/api/admin/reports/:id` | Admin | Review a report |
| GET | `/api/admin/verification-requests` | Admin | List verification requests |
| PATCH | `/api/admin/verification-requests/:id` | Admin | Approve/reject verification |
| GET | `/api/admin/stats` | Admin | Platform statistics |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate registration, etc.) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
