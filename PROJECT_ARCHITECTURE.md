# ShareWheelz Platform - Project Architecture

**Last Updated:** January 2025

---

## 📐 Architecture Type

### **Monorepo Monolith (Full-Stack Monolith)**

Your project follows a **Monorepo Monolith** architecture pattern, also known as a **Full-Stack Monolith**.

**Characteristics:**
- ✅ Single repository containing frontend, backend, and shared code
- ✅ Single deployment unit (everything deployed together)
- ✅ Shared TypeScript types and schemas
- ✅ Tightly coupled frontend and backend
- ✅ One database (SQLite locally, PostgreSQL in production)

**This is NOT:**
- ❌ Microservices (separate services with independent deployments)
- ❌ Monolith (all code in one file/package)
- ❌ Serverless (individual function deployments)
- ❌ Multi-repo (separate repositories per service)

---

## 📁 Project Structure

```
Tomobilti/
├── client/              # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts (Auth, Messaging, Notifications)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Frontend utilities (API, analytics, etc.)
│   │   └── utils/       # Helper functions
│   └── public/          # Static assets
│
├── server/              # Backend (Express + TypeScript)
│   ├── routes/          # API route handlers
│   ├── middleware/      # Express middleware (auth, CSRF, security)
│   ├── services/        # Business logic services
│   ├── storage.ts       # Database abstraction layer
│   └── index.ts         # Server entry point
│
├── shared/              # Shared code between frontend & backend
│   └── schema.ts         # Shared TypeScript types & Zod schemas
│
├── scripts/             # Utility scripts (DB migrations, fixes)
├── dist/                # Build output (compiled code)
└── package.json         # Single package.json for entire project
```

---

## 🏗️ Architecture Layers

### 1. **Presentation Layer (Frontend)**
- **Technology:** React 18 + TypeScript + Vite
- **UI Framework:** Radix UI + Tailwind CSS + Shadcn UI
- **State Management:** React Query + Context API
- **Routing:** Wouter (lightweight React router)
- **Real-time:** Socket.IO client

**Location:** `client/src/`

### 2. **Application Layer (Backend)**
- **Technology:** Express.js + TypeScript
- **API:** RESTful API endpoints
- **Authentication:** JWT tokens + session management
- **Real-time:** Socket.IO server (messaging & notifications)
- **Security:** Helmet, CORS, Rate limiting, CSRF protection

**Location:** `server/`

### 3. **Data Layer**
- **Local Development:** SQLite (better-sqlite3)
- **Production:** PostgreSQL (via Render.com)
- **ORM/Query:** Custom storage abstraction
- **Caching:** Redis (optional, for production scaling)

**Location:** `server/storage.ts`, `shared/schema.ts`

### 4. **Shared Layer**
- **Purpose:** Common types, schemas, and interfaces
- **Technology:** TypeScript + Zod for validation
- **Usage:** Imported by both frontend and backend

**Location:** `shared/`

---

## 🔄 Data Flow

```
User Browser
    ↓
React Frontend (client/)
    ↓ HTTP/REST API
Express Backend (server/)
    ↓
Storage Abstraction Layer
    ↓
Database (SQLite/PostgreSQL)
```

**Real-time Communication:**
```
Frontend Socket.IO Client
    ↓ WebSocket
Backend Socket.IO Server
    ↓
Notification/Messaging Services
```

---

## 📦 Deployment Architecture

### **Single Service Deployment**

- **Type:** Monolithic deployment
- **Platform:** Render.com
- **Build Process:**
  1. Install dependencies
  2. Build frontend (Vite)
  3. Bundle backend (esbuild)
  4. Deploy as single service

### **Deployment Flow:**
```
Git Push
    ↓
Render.com Auto-Deploy
    ↓
Build Command (render.yaml)
    ↓
Single Node.js Process
    ↓
Serves both Frontend & Backend
```

---

## 🔌 Service Integration

### **Internal Services (within the monolith):**
- Email Service (`server/services/email.ts`)
- Payment Service (`server/services/payment.ts`)
- Notification Service (`server/services/notifications.ts`)
- Messaging Service (`server/messaging.ts`)
- Monitoring Service (`server/services/monitoring.ts`)
- Logging Service (`server/services/logging.ts`)

### **External Services:**
- Cloudinary (image storage)
- Stripe (payments)
- Twilio (SMS verification)
- OpenAI (AI features)
- SMTP (email delivery)

---

## 🔐 Security Architecture

### **Layers:**
1. **Network:** HTTPS, CORS
2. **Application:** Helmet, Rate limiting
3. **Authentication:** JWT tokens, Sessions
4. **Authorization:** Role-based (Admin, Owner, Renter)
5. **Data:** Input sanitization, CSRF protection
6. **Database:** Parameterized queries (SQL injection prevention)

---

## 📊 Scaling Considerations

### **Current (Monolith):**
- ✅ Easy development
- ✅ Simple deployment
- ✅ Shared code/types
- ✅ Single database transaction
- ⚠️  Limited horizontal scaling

### **Future (if needed):**
If scaling becomes an issue, you could evolve to:
- **Modular Monolith:** Split into modules within same repo
- **Microservices:** Separate services (API, Auth, Payments, etc.)
- **Serverless:** Convert to serverless functions

**Current Recommendation:** Stay with monolith until you have actual scaling needs.

---

## 🛠️ Development Workflow

### **Local Development:**
```bash
npm run dev          # Starts both frontend & backend
```

- Frontend: Vite dev server (port 5000)
- Backend: Express server (same port, serves API)
- Database: SQLite (local file)

### **Production Build:**
```bash
npm run build        # Builds everything
npm start            # Starts production server
```

- Frontend: Static files in `dist/public/`
- Backend: Compiled to `dist/index.js`
- Database: PostgreSQL (Render.com)

---

## 📝 Key Architectural Decisions

### **Why Monorepo Monolith?**
1. ✅ Faster development (shared types)
2. ✅ Easier testing (everything in one place)
3. ✅ Simpler deployment (one build)
4. ✅ Better type safety (shared schemas)
5. ✅ Suitable for current scale

### **Why NOT Microservices?**
1. ⚠️  Over-engineering for current needs
2. ⚠️  More complex deployment
3. ⚠️  Network latency between services
4. ⚠️  Distributed transaction complexity

---

## 🔍 Architecture Diagram

```
┌─────────────────────────────────────────┐
│         User Browser                    │
└─────────────────┬───────────────────────┘
                  │
                  │ HTTPS/WSS
                  ↓
┌─────────────────────────────────────────┐
│      Express Server (Port 5000)          │
│  ┌───────────────────────────────────┐  │
│  │  Frontend (Static Files)          │  │
│  │  (Served from dist/public/)       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  API Routes (/api/*)              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  WebSocket (Socket.IO)            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Services Layer                   │  │
│  │  - Email                          │  │
│  │  - Payment                        │  │
│  │  - Notifications                  │  │
│  │  - Messaging                      │  │
│  └───────────────────────────────────┘  │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│      Database Layer                     │
│  - SQLite (Dev) / PostgreSQL (Prod)     │
└─────────────────────────────────────────┘
```

---

## 📈 Performance Characteristics

- **Startup Time:** Fast (single process)
- **Memory Usage:** Moderate (one Node.js process)
- **Scalability:** Vertical (add more CPU/RAM to single instance)
- **Development Speed:** Fast (no service boundaries)
- **Testing:** Easy (everything accessible)

---

## ✅ Summary

**Architecture Type:** **Monorepo Monolith** (Full-Stack Monolith)

**Deployment:** Single service on Render.com

**Database:** SQLite (dev) → PostgreSQL (prod)

**Real-time:** Socket.IO (within same server)

**Status:** ✅ Well-suited for current scale and requirements

---

**For questions or architecture evolution, refer to this document.**

