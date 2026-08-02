# RailNegar Frontend 🚂

Nuxt 3 (Vue 3) frontend for **RailNegar** — an automated Iranian railway (Raja) ticket booking service. This is the user-facing web app: search, smart booking requests, wallet, support tickets and passenger management.

> **Repository**: `ikeong/RAILNEGAR-Frontend` — frontend only. The backend (NestJS/Prisma) lives in the separate `ikeong/RAILNEGAR` repository.

---

## ✨ Features

### 🔐 Authentication
- Phone + OTP login/registration (`/auth/login` → `/auth/verify`)
- API key stored client-side and sent as `x-api-key` header on every protected request
- Session-safe redirects (login returns you to your in-progress booking)

### 🔎 Train Search
- Search by origin, destination, date (multi-origin / multi-destination / multi-date)
- Normal & presale (پیشفروش) modes with coach-type and time-window filters
- Seat-price estimates from Raja; **exclusive coupe (دربست) estimate** from the backend `exclusivePricing` payload
- Non-bookable trains greyed out with a reason badge (`isDisabled` / `disabledReason`)
- **Scattered booking** checkbox + **allowPartial** checkbox (partial booking allowed when full capacity is unavailable)

### 📝 Booking Requests (Smart Reservation)
- One-hour **booking sessions** — every flow gets a `uuid` (`/train-passengers/:uuid`), survives refresh, and redirects back after wallet top-up. Missing/expired session → polished 404 page
- Passenger forms with Iranian national-code validation, foreign (passport) support, infant detection
- **Coupe gender rules** — `coupeMenAllowed` / `coupeWomenAllowed` / `coupeMixedAllowed` computed from passenger composition
- Exclusive coupe pricing: full seats + empty seats at 15% Raja discount
- Cancel flow with backend `cancelPolicy` messaging (free vs service-fee deduction)

### 👛 Wallet
- Balance, locked amount, total spent, tier & fee table (Rial → Toman conversion)
- Top-up via Zarinpal gateway redirect or **bank receipt upload** (image preview via secure public UUID endpoint)
- Transaction ledger with filters and receipt status badges
- Persian masked currency input (۱٬۲۳۴٬۵۶۷ تومان)

### 👥 Passengers
- Full passenger CRUD (`/profile/passengers`): list, search, add, edit, delete (auto-archive)
- Autocomplete search API wired for booking forms
- Booking requests upsert passengers automatically via `newPassengers` (backend insert-or-update by nationalId, isolated per API key)

### 🎫 Support Tickets
- `/profile/support`: topic-based ticket creation (optionally linked to a booking request), chat-style detail view, replies

### 🎨 UX
- Fully RTL, Persian-first (Vazirmatn), Tailwind CSS, dark mode
- Custom 404 page with animated train
- Toast notifications throughout

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Framework | Nuxt 3 (Vue 3, Composition API) |
| Language | TypeScript |
| Styling | Tailwind CSS (custom Bootstrap-style palette + full shade scales) |
| i18n | `@nuxtjs/i18n` (fa) |
| Fonts | Vazirmatn, Pinar |
| Build | Vite |
| Package manager | npm |
| Deployment | Docker (`node:22-alpine` serving `.output`) |

---

## 📁 Project Structure

```
nuxt-frontend/
├── app.vue                     # Root component
├── error.vue                   # Global error / 404 page
├── nuxt.config.ts              # Nuxt config
├── tailwind.config.ts          # Tailwind palette
├── i18n/locales/fa.json        # Persian translations
├── assets/css/main.css         # Global styles
├── components/
│   ├── Header.vue              # Nav (desktop + mobile)
│   ├── Footer.vue
│   └── ui/Toast.vue            # Toast notifications
├── composables/
│   ├── useBookingSession.ts    # 1-hour uuid booking sessions (localStorage)
│   ├── useToast.ts
│   ├── api/
│   │   ├── useApiFetch.ts      # Fetch wrapper (x-api-key, base URL)
│   │   ├── useAuth.ts          # OTP auth
│   │   ├── useOrders.ts        # Booking requests (create/list/cancel)
│   │   ├── useWallet.ts        # Balance, ledger, tier, top-ups, receipts
│   │   ├── useProfile.ts       # Client profile + tier helpers
│   │   ├── useSupportTickets.ts# Support tickets
│   │   ├── usePassengers.ts    # Passenger CRUD + search
│   │   └── useTrain.ts         # Train search
│   └── utils/usePersianNumber.ts # Persian digits / price formatting
├── stores/search.ts            # Search state (pricing, presale, ticket-fare)
├── pages/
│   ├── index.vue               # Landing page
│   ├── train.vue               # Search form (normal + presale, coupe types)
│   ├── train-results.vue       # Results, filters, train selection
│   ├── train-passengers/
│   │   └── [uuid].vue          # Passenger forms + booking (session-scoped)
│   ├── auth/ (login, register, verify)
│   ├── profile/
│   │   ├── index.vue           # Dashboard
│   │   ├── wallet.vue          # Wallet + receipts
│   │   ├── orders.vue          # Booking requests
│   │   ├── passengers.vue      # Passenger management
│   │   └── support.vue         # Support tickets
│   └── (about, terms, licences, agencies)
└── Dockerfile                  # Production image (copies .output)
```

---

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm

### Install & run
```bash
npm install
npm run dev        # http://localhost:3000
```

### Production build
```bash
npm run build      # outputs to .output/
npm run preview    # serve the production build locally
```

### Docker
```bash
npm run build
docker build -t railnegar-nuxt .
docker run -d --name railnegar-nuxt --restart unless-stopped \
  --network nginx-proxy-manager_default \
  -e NODE_ENV=production -e HOST=0.0.0.0 -e PORT=3000 \
  railnegar-nuxt:latest
```

---

## 🔌 Backend API (summary)

Base URL: `https://railapi.happyupload.com` — all protected endpoints require `x-api-key`.

| Area | Endpoints |
|---|---|
| Auth | `POST /api/v1/public/auth/send-otp`, `POST /api/v1/public/auth/verify-otp` |
| Search | `GET /api/v1/public/search?from=&to=&date=&passengers=` |
| Pricing | `GET /api/v1/public/pricing`, `POST /api/v1/public/pricing/calculate`, `POST /api/v1/public/pricing/ticket-fare` |
| Wallet | `GET /api/v1/wallet/balance`, `GET /api/v1/wallet/tier`, `GET /api/v1/wallet/ledger` |
| Top-up | `POST /api/v1/topup/zarinpal/init`, `POST /api/v1/topup/receipt/upload`, `GET /api/v1/topup/receipt`, `GET /api/v1/public/topup/receipt/image/:uuid` |
| Booking | `POST /api/v1/booking-requests` (incl. `newPassengers`, `subRequests`, coupe flags, `allowPartial`), `GET/DELETE /api/v1/booking-requests/:uuid` |
| Passengers | `GET/POST /api/v1/passengers`, `PUT/DELETE /api/v1/passengers/:id`, `GET /api/v1/passengers/search?q=` |
| Tickets | `GET/POST /api/v1/support-tickets`, `GET /api/v1/support-tickets/topics`, `POST /api/v1/support-tickets/:id/reply` |

### Currency convention
- `/api/v1/public/pricing/*` → **Toman** (display directly)
- `/api/v1/wallet/*` and search `cost` → **Rial** (divide by 10 for Toman)

---

## 🧮 Exclusive Coupe Formula (دربست)

From Raja rules — the whole compartment is purchased:
```
ticketTotal = (seatCost × passengers) + (emptySeatCost × empty seats)
emptySeatCost = seatCost × 0.85   (15% Raja discount on empty seats)
serviceFee = 50,000 Toman (regular) / 30,000 (agency) when passengers < capacity
```

---

## 📄 License

Proprietary — all rights reserved. Internal production software; redistribution or reuse without written permission is prohibited.

---

## 🏢 Production Deployment

This frontend is deployed in production at `negar.happyupload.com` (behind nginx-proxy-manager, Docker). The backend is a separate repository (`ikeong/RAILNEGAR`). See **Docker** section above for the production image build.

