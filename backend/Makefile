# Variables
APP_NAME=campus-connect-api
DOCKER_IMAGE=campus-connect-api:latest
GO_VERSION=1.24.1

# Development commands
.PHONY: dev
dev:
	go run cmd/server/main.go

.PHONY: build
build:
	go build -o bin/$(APP_NAME) cmd/server/main.go

.PHONY: clean
clean:
	rm -rf bin/

.PHONY: test
test:
	go test -v ./...

.PHONY: test-coverage
test-coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

.PHONY: deps
deps:
	go mod download
	go mod tidy

.PHONY: lint
lint:
	golangci-lint run ./...

# Database commands
.PHONY: db-up
db-up:
	docker-compose up postgres -d

.PHONY: db-down
db-down:
	docker-compose down postgres

.PHONY: db-reset
db-reset:
	docker-compose down postgres -v
	docker-compose up postgres -d

# Docker commands
.PHONY: docker-build
docker-build:
	docker build -t $(DOCKER_IMAGE) .

.PHONY: docker-run
docker-run:
	docker run -p 8080:8080 --env-file .env $(DOCKER_IMAGE)

.PHONY: docker-up
docker-up:
	docker-compose up --build

.PHONY: docker-down
docker-down:
	docker-compose down

.PHONY: docker-logs
docker-logs:
	docker-compose logs -f api

# Setup commands
.PHONY: setup
setup:
	@echo "Setting up development environment..."
	@if [ ! -f .env ]; then cp env.example .env; echo "Created .env file from template"; fi
	$(MAKE) deps
	@echo "Setup complete! Run 'make dev' to start the server"

.PHONY: setup-docker
setup-docker:
	@echo "Setting up Docker environment..."
	@if [ ! -f .env ]; then cp env.example .env; echo "Created .env file from template"; fi
	$(MAKE) docker-up
	@echo "Docker setup complete! API is running on http://localhost:8080"

# Help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  dev              - Run the application in development mode"
	@echo "  build            - Build the application binary"
	@echo "  clean            - Clean build artifacts"
	@echo "  test             - Run tests"
	@echo "  test-coverage    - Run tests with coverage report"
	@echo "  deps             - Download and tidy dependencies"
	@echo "  lint             - Run linter"
	@echo "  db-up            - Start PostgreSQL container"
	@echo "  db-down          - Stop PostgreSQL container"
	@echo "  db-reset         - Reset PostgreSQL database"
	@echo "  docker-build     - Build Docker image"
	@echo "  docker-run       - Run Docker container"
	@echo "  docker-up        - Start all services with Docker Compose"
	@echo "  docker-down      - Stop all Docker services"
	@echo "  docker-logs      - View API logs"
	@echo "  setup            - Set up development environment"
	@echo "  setup-docker     - Set up Docker environment"
	@echo "  help             - Show this help message"
