# Portfolio Backend API

A robust Go backend API built with Fiber framework for managing personal portfolio data including projects, experiences, skills, certifications, and volunteer work.

## Features

- **JWT Authentication** - Secure admin authentication for write operations
- **MongoDB Integration** - MongoDB database with MGM (Mongo ODM) for data persistence
- **RESTful API** - Clean REST endpoints for portfolio data management
- **CORS Support** - Configurable CORS for frontend integration
- **Structured Logging** - Configurable logging levels with slog
- **Environment Configuration** - Flexible configuration via environment variables
- **Graceful Shutdown** - Proper signal handling for clean shutdowns

## Tech Stack

- **Go 1.24.4** - Programming language
- **Fiber v2** - Web framework
- **MongoDB** - Database
- **MGM v3** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```text
├── main.go                    # Application entry point
├── Stats.go                   # Statistics functionality
├── API_DOCS.md               # Detailed API documentation
├── controller/               # Request handlers
│   ├── admin.controller.go
│   ├── certifications.controller.go
│   ├── experience.controller.go
│   ├── iterator.controller.go
│   ├── project.controller.go
│   ├── skill.controller.go
│   ├── timeline.controller.go
│   └── volunteer.controller.go
├── database/                 # Database connection
│   └── connect.database.go
├── middleware/               # Custom middleware
│   └── jwt.middleware.go
├── models/                   # Data models
│   ├── config.models.go
│   └── data.models.go
├── route/                    # Route definitions
│   ├── admin.route.go
│   ├── certification.route.go
│   ├── exp.route.go
│   ├── project.route.go
│   ├── skill.route.go
│   ├── time.route.go
│   └── volunteer.route.go
└── util/                     # Utility functions
    ├── apiResponse.util.go
    ├── getEnv.util.go
    ├── jwt.util.go
    ├── pass.util.go
    └── test.util.go
```

## Getting Started

### Prerequisites

- Go 1.24.4 or higher
- MongoDB instance
- Git

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MishraShardendu22/MishraShardendu22-Backend-PersonalWebsite.git
   cd MishraShardendu22-Backend-PersonalWebsite
   ```

2. **Install dependencies:**

   ```bash
   go mod download
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   ENVIRONMENT=development
   CORS_ALLOW_ORIGINS=*
   LOG_LEVEL=info
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=portfolio_db
   ADMIN_PASS=your_admin_password
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Build the application:**

   ```bash
   go build -o main
   ```

5. **Run the application:**

   ```bash
   ./main
   ```

The server will start on the configured port (default: 5000).

## Configuration

The application uses environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `ENVIRONMENT` | `development` | Application environment |
| `CORS_ALLOW_ORIGINS` | `*` | CORS allowed origins |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |
| `MONGODB_URI` | - | MongoDB connection string |
| `DB_NAME` | `test` | Database name |
| `ADMIN_PASS` | - | Admin authentication password |
| `JWT_SECRET` | - | JWT signing secret |

## API Endpoints

### Authentication

- `POST /api/admin/auth` - Admin authentication (returns JWT token)

### Projects (Public)

- `GET /api/public/projects` - Get all projects
- `GET /api/public/projects/:id` - Get project by ID

### Projects (Protected - JWT Required)

- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Experiences (Public)

- `GET /api/public/experience` - Get all experiences
- `GET /api/public/experience/:id` - Get experience by ID

### Experiences (Protected - JWT Required)

- `POST /api/experience` - Create experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience

### Skills (Public)

- `GET /api/public/skills` - Get all skills

### Skills (Protected - JWT Required)

- `POST /api/skills` - Create/update skills

### Certifications (Public)

- `GET /api/public/certifications` - Get all certifications
- `GET /api/public/certifications/:id` - Get certification by ID

### Certifications (Protected - JWT Required)

- `POST /api/certifications` - Create certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification

### Volunteer Work (Public)

- `GET /api/public/volunteer` - Get all volunteer experiences
- `GET /api/public/volunteer/:id` - Get volunteer experience by ID

### Volunteer Work (Protected - JWT Required)

- `POST /api/volunteer` - Create volunteer experience
- `PUT /api/volunteer/:id` - Update volunteer experience
- `DELETE /api/volunteer/:id` - Delete volunteer experience

### Timeline/Statistics

- `GET /api/public/timeline` - Get timeline data
- `POST /api/timeline` - Update timeline (Protected)

For detailed API documentation with request/response examples, see [API_DOCS.md](./API_DOCS.md).

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login:** Send admin credentials to `/api/admin/auth`
2. **Receive JWT:** The response includes a JWT token
3. **Use Token:** Include the token in the Authorization header for protected routes:

   ```text
   Authorization: Bearer <your_jwt_token>
   ```

## Data Models

### Project

```go
type Project struct {
    ID                ObjectID `json:"id"`
    Order             int      `json:"order"`
    ProjectName       string   `json:"project_name"`
    SmallDescription  string   `json:"small_description"`
    Description       string   `json:"description"`
    Skills            []string `json:"skills"`
    ProjectRepository string   `json:"project_repository"`
    ProjectLiveLink   string   `json:"project_live_link"`
    ProjectVideo      string   `json:"project_video"`
}
```

### Experience

```go
type Experience struct {
    ID                 ObjectID             `json:"id"`
    CompanyName        string               `json:"company_name"`
    CompanyLogo        string               `json:"company_logo"`
    Description        string               `json:"description"`
    Technologies       []string             `json:"technologies"`
    Images             []string             `json:"images"`
    CertificateURL     string               `json:"certificate_url"`
    ExperienceTimeline []ExperienceTimeLine `json:"experience_time_line"`
    Projects           []ObjectID           `json:"projects"`
}
```

## Development

### Running in Development Mode

```bash
# Install air for hot reloading (optional)
go install github.com/cosmtrek/air@latest

# Run with hot reload
air

# Or run directly
go run main.go
```

### Building for Production

```bash
# Build binary
go build -o portfolio-backend

# Run binary
./portfolio-backend
```

### Testing

```bash
# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...
```

## Deployment

### Docker (Recommended)

1. **Create Dockerfile:**

   ```dockerfile
   FROM golang:1.24.4-alpine AS builder
   WORKDIR /app
   COPY go.mod go.sum ./
   RUN go mod download
   COPY . .
   RUN go build -o main .

   FROM alpine:latest
   RUN apk --no-cache add ca-certificates
   WORKDIR /root/
   COPY --from=builder /app/main .
   EXPOSE 5000
   CMD ["./main"]
   ```

2. **Build and run:**

   ```bash
   docker build -t portfolio-backend .
   docker run -p 5000:5000 --env-file .env portfolio-backend
   ```

### Traditional Deployment

1. **Build for target OS:**

   ```bash
   # For Linux
   GOOS=linux GOARCH=amd64 go build -o portfolio-backend

   # For Windows
   GOOS=windows GOARCH=amd64 go build -o portfolio-backend.exe
   ```

2. **Deploy binary with environment variables**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue in the GitHub repository.

## Related Projects

- [Portfolio Frontend](https://github.com/MishraShardendu22/portfolio-frontend) - React frontend for this API
- [Portfolio Admin Panel](https://github.com/MishraShardendu22/portfolio-admin) - Admin dashboard

---

**Author:** Shardendu Mishra  
**GitHub:** [@MishraShardendu22](https://github.com/MishraShardendu22)
