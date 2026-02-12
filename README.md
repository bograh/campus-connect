# Campus Connect 🚗📦

A secure, full-stack student delivery and carpooling platform designed specifically for KNUST students. Campus Connect enables verified peer-to-peer delivery services and trip sharing, fostering a safe and connected campus community.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## 🎯 Features

- **🔐 Secure Authentication**: KNUST email verification with JWT tokens and bcrypt password hashing
- **📦 Delivery Requests**: Create and browse delivery requests, match with available trips
- **🚗 Trip Management**: Create trips, join/leave trips, and offer delivery services
- **👤 Profile Management**: User profiles with Cloudinary-powered image uploads
- **✉️ Email Verification**: Integrated email service for account verification
- **🛡️ Security**: CORS protection, HTTP-only cookies, SQL injection prevention

---

## 🏗️ Architecture

Campus Connect follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│              Next.js 14 + React 18                   │
│         TypeScript, Tailwind CSS, Radix UI           │
└────────────────────┬────────────────────────────────┘
                     │ REST API
                     │ (JWT Authentication)
┌────────────────────▼────────────────────────────────┐
│                   Backend API                        │
│              Go + Chi Router                         │
│         JWT, bcrypt, Validator                       │
└────────────┬───────────────────┬────────────────────┘
             │                   │
             │                   │
┌────────────▼───────┐  ┌───────▼────────────┐
│    PostgreSQL      │  │    Cloudinary      │
│   (Database)       │  │  (Image Storage)   │
└────────────────────┘  └────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript 5
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS 4.x
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Custom TypeScript API client

### Backend
- **Language**: Go 1.24.1
- **Router**: Chi v5.2.3
- **Database**: PostgreSQL 15+
- **ORM**: Native SQL with prepared statements
- **Authentication**: JWT (golang-jwt/jwt)
- **Password Hashing**: bcrypt (golang.org/x/crypto)
- **Validation**: go-playground/validator
- **Image Storage**: Cloudinary Go SDK
- **Migrations**: golang-migrate/migrate
- **Environment**: godotenv

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15+
- **File Storage**: Cloudinary CDN
- **Email Service**: Brevo (for verification emails)

---

## 📁 Project Structure

```
campus-connect/
├── backend/                    # Go REST API
│   ├── cmd/server/            # Application entry point
│   │   └── main.go            # Server initialization
│   ├── internal/
│   │   ├── auth/              # JWT authentication service
│   │   ├── config/            # Configuration management
│   │   ├── database/          # PostgreSQL connection
│   │   ├── handlers/          # HTTP request handlers
│   │   │   ├── auth.go        # Auth endpoints
│   │   │   ├── delivery_requests.go
│   │   │   └── trips.go       # Trip management
│   │   ├── middleware/        # JWT & CORS middleware
│   │   ├── models/            # Data structures
│   │   │   ├── user.go
│   │   │   ├── trip.go
│   │   │   └── delivery_request.go
│   │   ├── repositories/      # Data access layer
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic
│   │   │   ├── cloudinary.go  # Image upload service
│   │   │   └── verification.go # Email verification
│   │   └── utils/             # Utility functions
│   ├── migrations/            # SQL database migrations
│   ├── docker-compose.yml     # Local development setup
│   ├── Dockerfile             # Multi-stage Go build
│   ├── go.mod                 # Go dependencies
│   └── .env.example           # Environment variables template
│
└── frontend/                   # Next.js React application
    ├── app/                   # Next.js 14 App Router
    │   ├── layout.tsx         # Root layout
    │   ├── page.tsx           # Landing page
    │   ├── login/             # Login page
    │   ├── register/          # Registration page
    │   └── dashboard/         # Authenticated dashboard
    ├── components/            # Reusable UI components
    │   ├── auth/              # Authentication components
    │   ├── dashboard/         # Dashboard features
    │   ├── trips/             # Trip management UI
    │   ├── requests/          # Delivery requests UI
    │   └── ui/                # Radix UI primitives
    ├── lib/                   # Libraries & utilities
    │   ├── api/               # API client & services
    │   │   ├── client.ts      # HTTP client with auth
    │   │   ├── auth.ts        # Auth API calls
    │   │   ├── delivery-requests.ts
    │   │   └── trips.ts       # Trip API calls
    │   ├── hooks/             # React custom hooks
    │   │   ├── useAuth.ts
    │   │   ├── useTrips.ts
    │   │   └── useDeliveryRequests.ts
    │   ├── types/             # TypeScript type definitions
    │   └── utils.ts           # Utility functions
    ├── styles/                # Global CSS
    ├── public/                # Static assets
    ├── package.json           # Frontend dependencies
    ├── tsconfig.json          # TypeScript configuration
    ├── tailwind.config.ts     # Tailwind CSS configuration
    └── next.config.mjs        # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Go**: 1.24.1 or higher
- **Node.js**: 18.x or higher
- **PostgreSQL**: 15 or higher
- **Docker & Docker Compose** (optional, for containerized development)

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=campus_connect

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Verification (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@campusconnect.com
BREVO_SENDER_NAME=Campus Connect

# Server
PORT=8080
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Installation & Setup

#### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/kwabsntim/campus-connect.git
   cd campus-connect
   ```

2. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Backend API on port 8080

4. **Run database migrations**
   ```bash
   # Migrations run automatically on backend startup
   # Or manually:
   docker-compose exec api migrate -path migrations -database "postgres://user:password@db:5432/campus_connect?sslmode=disable" up
   ```

5. **Set up frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/health

#### Option 2: Local Development

1. **Set up PostgreSQL**
   ```bash
   # Install PostgreSQL 15+
   # Create database
   createdb campus_connect
   ```

2. **Backend setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Install Go dependencies
   go mod download
   
   # Run migrations
   go run cmd/server/main.go migrate
   
   # Start backend server
   go run cmd/server/main.go
   ```

3. **Frontend setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local
   
   # Start development server
   npm run dev
   ```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user (KNUST email required)
POST   /api/auth/signin          - Login user
POST   /api/auth/logout          - Logout user
GET    /api/auth/me              - Get current user
PUT    /api/auth/update-profile  - Update user profile
POST   /api/auth/upload-avatar   - Upload profile picture
```

### Delivery Requests
```
GET    /api/delivery-requests             - List all delivery requests
POST   /api/delivery-requests/create      - Create new delivery request
POST   /api/delivery-requests/offer       - Offer to deliver
POST   /api/delivery-requests/cancel      - Cancel delivery request
```

### Trips
```
GET    /api/trips            - List all trips
POST   /api/trips/create     - Create new trip
POST   /api/trips/join       - Join a trip
POST   /api/trips/leave      - Leave a trip
GET    /api/trips/my-trips   - Get user's trips
```

### Health
```
GET    /health               - API health check
```

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **Password Security**: Bcrypt hashing with salt rounds
- **SQL Injection Prevention**: Prepared statements for all database queries
- **CORS Protection**: Configured CORS middleware for API access control
- **Input Validation**: Server-side validation using go-playground/validator
- **Email Verification**: KNUST email verification required for registration
- **Secure Headers**: HTTP security headers configured

---

## 🧪 Testing

### Backend
```bash
cd backend
go test ./...
```

### Frontend
```bash
cd frontend
npm run test
```

---

## 🏗️ Building for Production

### Backend
```bash
cd backend

# Build binary
go build -o campus-connect cmd/server/main.go

# Or use Docker
docker build -t campus-connect-api .
docker run -p 8080:8080 --env-file .env campus-connect-api
```

### Frontend
```bash
cd frontend

# Build optimized production bundle
npm run build

# Start production server
npm start
```

---

## 🔄 Application Flow

### 1. User Registration & Authentication
```
User → Registers with KNUST email
     → Backend validates email domain
     → Verification email sent (Brevo)
     → User verifies email
     → JWT token issued → Stored in HTTP-only cookie
```

### 2. Creating a Delivery Request
```
User → Creates delivery request with details
     → Backend validates input
     → Request stored in PostgreSQL
     → Available to all users
```

### 3. Creating & Joining Trips
```
Driver → Creates trip (departure, destination, time)
      → Trip visible to all users
Passenger → Browses trips
          → Joins trip
          → Can offer delivery service
```

### 4. Profile Management
```
User → Uploads profile picture
     → Image sent to Cloudinary
     → CDN URL stored in database
     → Image served from Cloudinary CDN
```

---

## 🌐 Deployment

### Backend Deployment

**Recommended Platforms**:
- **Render**: Go service with PostgreSQL addon
- **Railway**: Go + PostgreSQL templates
- **Fly.io**: Docker deployment
- **AWS ECS/EKS**: Container orchestration

**Environment Setup**:
1. Set all required environment variables
2. Connect to managed PostgreSQL instance
3. Run database migrations on startup
4. Configure health check endpoint

### Frontend Deployment

**Recommended Platforms**:
- **Vercel**: Optimized for Next.js (zero-config)
- **Netlify**: Next.js support with plugins
- **AWS Amplify**: Full-stack deployment
- **Cloudflare Pages**: Edge deployment

**Build Command**: `npm run build`  
**Output Directory**: `.next`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **Go**: Follow standard Go conventions (`gofmt`, `golint`)
- **TypeScript**: Follow ESLint rules configured in the project
- **Commits**: Use conventional commits format

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed by the Campus Connect Team

---

## 🐛 Issues & Support

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/kwabsntim/campus-connect/issues).

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Go Documentation](https://golang.org/doc/)
- [Chi Router](https://github.com/go-chi/chi)
- [Radix UI](https://www.radix-ui.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Made with ❤️ for KNUST Students**
