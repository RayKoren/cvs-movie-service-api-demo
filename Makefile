# Makefile for Movie API

.PHONY: help build test dev prod clean docker-build docker-test docker-run

# Default target
help:
	@echo "Available commands:"
	@echo "  build       - Build the application"
	@echo "  test        - Run tests"
	@echo "  dev         - Start development server"
	@echo "  prod        - Start production server"
	@echo "  clean       - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-test - Run tests in Docker"
	@echo "  docker-run  - Run production container"

# Local development
build:
	npm run build

test:
	npm test

dev:
	npm run dev

prod:
	npm start

clean:
	rm -rf dist coverage test-db

# Docker commands
docker-build:
	docker build -t movie-api:latest .

docker-test:
	docker build --target test -t movie-api:test .
	docker run --rm movie-api:test

docker-run:
	docker run -it --rm -p 4000:4000 -v $(PWD)/db:/app/db:ro movie-api:latest

# Docker Compose commands
compose-dev:
	docker-compose --profile dev up --build

compose-test:
	docker-compose --profile test up --build

compose-prod:
	docker-compose --profile prod up --build

# CI/CD helpers
ci-test:
	docker build --target test -t movie-api:test .
	docker run --rm movie-api:test

ci-build:
	docker build --target runtime -t movie-api:latest .

# Database helpers
db-shell:
	sqlite3 db/movies.db

db-ratings-shell:
	sqlite3 db/ratings.db
