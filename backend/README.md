# Campus Connect Backend API

A Go-based REST API for the Campus Connect application, built with Chi router, PostgreSQL database, and Cloudinary for image storage.

## Features

- **Authentication & Authorization**: JWT-based auth with HTTP-only cookies
- **User Management**: Registration, login, profile management with verification
- **Delivery Requests**: Create, browse, match delivery requests
- **Trip Management**: Create trips, join/leave trips, offer delivery services
- **Image Upload**: Profile images via Cloudinary integration
- **Database**: PostgreSQL with migrations
- **Security**: Input validation, CORS protection, secure password hashing

## Tech Stack

- **Framework**: Chi Router
- **Database**: PostgreSQL 15+
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Storage**: Cloudinary
- **Migration**: golang-migrate
- **Validation**: go-playground/validator
- **Environment**: godotenv for configuration

## Project Structure

```
backend/
├── cmd/server/          # Application entry point
├── internal/
│   ├── auth/           # Authentication services
│   ├── config/         # Configuration management
│   ├── database/       # Database connection and setup
│   ├── handlers/       # HTTP request handlers
│   ├── middleware/     # HTTP middleware
│   ├── models/         # Data models and structs
│   ├── repositories/   # Data access layer
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic services
│   └── utils/          # Utility functions
├── migrations/         # Database migration files
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose for development
├── go.mod             # Go module definition
└── README.md          # This file
```

## Quick Start

### Prerequisites

- Go 1.24.1 or later
- PostgreSQL 15+
- (Optional) Docker and Docker Compose

### Environment Setup

1. Copy the environment template:

   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your configuration:

   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=campus_connect

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Cloudinary (optional)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Running with Docker (Recommended)

1. Start the services:

   ```bash
   docker-compose up --build
   ```

2. The API will be available at `http://localhost:8080`

### Running Locally

1. Install dependencies:

   ```bash
   go mod download
   ```

2. Set up PostgreSQL database:

   ```sql
   CREATE DATABASE campus_connect;
   ```

3. Run migrations:

   ```bash
   go run cmd/server/main.go
   ```

   (Migrations run automatically on startup)

4. Start the server:
   ```bash
   go run cmd/server/main.go
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile

### Delivery Requests

- `GET /api/delivery-requests` - List pending delivery requests
- `POST /api/delivery-requests/create` - Create new delivery request
- `POST /api/delivery-requests/offer` - Offer to deliver a request
- `DELETE /api/delivery-requests/cancel` - Cancel delivery offer

### Trips

- `GET /api/trips` - List active trips
- `POST /api/trips/create` - Create new trip
- `POST /api/trips/join` - Join a trip
- `DELETE /api/trips/leave` - Leave a trip
- `GET /api/trips/my-trips` - Get user's trips

### Health Check

- `GET /health` - API health status

## Database Schema

### Users

- Basic user information and verification status
- Authentication credentials
- Profile data and ratings

### Delivery Requests

- Item details and locations
- Pickup/delivery preferences
- Status tracking and matching

### Trips

- Travel itineraries and capacity
- Traveler information
- Participant management

### Junction Tables

- Trip participants
- Trip-delivery request matching

## Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: XSS protection for web clients
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable CORS policies
- **SQL Injection Prevention**: Parameterized queries

## Development

### Adding New Endpoints

1. Define models in `internal/models/`
2. Create repository methods in `internal/repositories/`
3. Implement handlers in `internal/handlers/`
4. Add routes in `internal/routes/routes.go`

### Database Migrations

Create new migration files:

```bash
# Create up and down migration files
touch migrations/002_your_migration.up.sql
touch migrations/002_your_migration.down.sql
```

### Testing

Run tests:

```bash
go test ./...
```

### Building for Production

```bash
# Build binary
go build -o main cmd/server/main.go

# Or use Docker
docker build -t campus-connect-api .
```

## Environment Variables

| Variable                | Description           | Default          |
| ----------------------- | --------------------- | ---------------- |
| `PORT`                  | Server port           | `8080`           |
| `HOST`                  | Server host           | `0.0.0.0`        |
| `GO_ENV`                | Environment           | `development`    |
| `DB_HOST`               | Database host         | `localhost`      |
| `DB_PORT`               | Database port         | `5432`           |
| `DB_USER`               | Database user         | `postgres`       |
| `DB_PASSWORD`           | Database password     | ``               |
| `DB_NAME`               | Database name         | `campus_connect` |
| `DB_SSL_MODE`           | SSL mode              | `disable`        |
| `JWT_SECRET`            | JWT signing key       | Required         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Optional         |
| `CLOUDINARY_API_KEY`    | Cloudinary API key    | Optional         |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Optional         |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
