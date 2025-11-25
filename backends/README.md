# JobHub Backend Services

This directory contains the microservices that power the JobHub platform. The backend is designed as a collection of independent services that communicate via APIs and message queues.

## Microservices Architecture

JobHub's backend consists of several independent services:

### Core Services
- **[Auth Service](./auth-service/README.md)** - User authentication, authorization, and JWT management
- **[User Service](./user-service/README.md)** - User profile management, registration, and personalization
- **[Job Service](./job-service/README.md)** - Job posting creation, management, and search functionality
- **[Application Service](./application-service/README.md)** - Job application processing and tracking
- **[Company Service](./company-service/README.md)** - Company profiles and employer management
- **[Notification Service](./notification-service/README.md)** - Email, SMS, and in-app notifications
- **[Analytics Service](./analytics-service/README.md)** - Usage analytics and reporting

### Infrastructure Services
- **[API Gateway](./api-gateway/README.md)** - Request routing, load balancing, and cross-cutting concerns
- **[Message Queue](./message-queue/README.md)** - Asynchronous processing and event handling

## Technology Stack

- **Languages**: [Node.js, Python, Go, Java, etc. - to be defined per service]
- **Frameworks**: [Express.js, FastAPI, Spring Boot, etc.]
- **Databases**: PostgreSQL, MongoDB, Redis
- **Message Brokers**: RabbitMQ or Apache Kafka
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Monitoring**: Prometheus, Grafana, ELK Stack

## API Documentation

- [API Documentation](./docs/api.md) - Comprehensive API documentation for all services
- [Authentication Guide](./docs/authentication.md) - Guide to authentication and authorization
- [Error Handling](./docs/errors.md) - Standard error response formats

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js v18+ (for Node.js services)
- Python 3.9+ (for Python services)
- [Additional prerequisites as needed]

### Running Backend Services

1. Navigate to the backends directory:
```bash
cd backends
```

2. Use Docker Compose to run all services:
```bash
docker-compose up --build
```

3. Or run individual services:
```bash
cd services/auth-service
npm install
npm run dev
```

4. The services will run on the following ports:
   - Auth Service: `http://localhost:8081`
   - User Service: `http://localhost:8082`
   - Job Service: `http://localhost:8083`
   - Application Service: `http://localhost:8084`
   - Company Service: `http://localhost:8085`
   - Notification Service: `http://localhost:8086`

## Development

### Service Development
Each service is developed independently. Check the README in each service directory for specific development instructions.

### Database Migrations
Database migrations are handled per service using tools like Prisma, Alembic, or Flyway.

### Testing
Each service includes unit, integration, and end-to-end tests. Run tests with:
```bash
npm run test  # In each service directory
```

### Environment Variables
Each service has its own `.env` file for configuration. See individual service READMEs for required environment variables.

## Configuration Management

Configuration is managed through:
- Environment variables
- Configuration files
- Kubernetes ConfigMaps and Secrets (in production)

## Monitoring and Logging

- Structured logging with consistent formats across services
- Centralized logging with ELK stack or similar
- Health check endpoints for each service
- Performance monitoring and alerting

## Deployment

Services can be deployed individually or as part of the complete system using:
- Docker containers
- Kubernetes manifests
- Infrastructure as Code templates

## Contributing

Please read the contributing guidelines (to be added) for details on developing backend services.

## API Specification

All services follow the OpenAPI 3.0 specification. API contracts are maintained in the `./specs` directory.

## Security

- OAuth 2.0 and JWT for authentication
- API rate limiting
- Input validation and sanitization
- Secure communication with HTTPS
- Regular security auditing

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.