# MITIGASI Backend (REST API)

**Mitigasi Akademik Terintegrasi** - Backend Service

Sistem informasi akademik terintegrasi untuk mitigasi dan monitoring progress akademik mahasiswa. Dikembangkan sebagai proyek tugas akhir S1 Teknik Komputer Universitas Telkom.

## Tech Stack

-   **Framework**: Express.js
-   **Database**: MySQL
-   **Runtime**: Node.js
-   **Cloud Storage**: Google Cloud Storage
-   **Container**: Docker
-   **Deployment**: Google Cloud Run

## Prerequisites

-   Node.js (v14 atau lebih baru)
-   MySQL Database
-   NPM atau Yarn
-   **Google Cloud SDK** (untuk deployment)

## Installation

1. Clone repository

```bash
git clone https://github.com/miftahfrdmaulana/CapstoneDesgin_MITIGASI.git
cd "Backend (RestAPI)/backendCode"
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.development .env
```

4. Configure environment variables:

```env
NODE_ENV=development
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
CORS_ORIGIN=your_frontend_url
```

5. Run the application

```bash
# Development
npm run dev

# Production
npm start
```

## Environment Configuration

| Variable      | Description           | Example                      |
| ------------- | --------------------- | ---------------------------- |
| `NODE_ENV`    | Environment mode      | `development` / `production` |
| `DB_HOST`     | Database host         | `localhost`                  |
| `DB_USER`     | Database username     | `root`                       |
| `DB_PASSWORD` | Database password     | `password123`                |
| `DB_NAME`     | Database name         | `mitigasi_db`                |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000`      |

## API Endpoints

### System

-   `GET /` - Root endpoint (API info)
-   `GET /health` - Health check endpoint
-   `GET /api-docs` - Swagger API documentation

### Authentication

-   `POST /api/auth/login` - User login
-   `POST /api/auth/logout` - User logout
-   `POST /api/auth/refresh` - Refresh token

### Admin Routes

-   `GET /api/admin/*` - Admin management endpoints
-   `POST /api/admin/*` - Admin creation endpoints
-   `PUT /api/admin/*` - Admin update endpoints
-   `DELETE /api/admin/*` - Admin deletion endpoints

### Faculty (Dosen Wali) Routes

-   `GET /api/faculty/*` - Faculty data endpoints
-   `POST /api/faculty/*` - Faculty management endpoints

### Student Routes

-   `GET /api/student/*` - Student data endpoints
-   `POST /api/student/*` - Student management endpoints

## Project Structure

```
backendCode/
├── config/           # Database & app configuration
├── controllers/      # Request handlers
├── middlewares/      # Authentication & validation
├── models/          # Database queries & models
├── routes/          # API route definitions
├── service/         # Business logic services
├── utils/           # Helper functions & utilities
├── ml_models/       # Machine learning models
└── server.js        # Application entry point
```

## Key Features

-   **Authentication & Authorization**: JWT-based authentication with token blacklist
-   **Role-based Access**: Admin, Faculty (Dosen Wali), Student roles
-   **Academic Management**: Course, grade, and curriculum management
-   **Student Monitoring**: Academic progress tracking
-   **File Upload**: CSV upload with validation (10MB limit)
-   **Cloud Storage**: Google Cloud Storage integration
-   **API Documentation**: Swagger/OpenAPI documentation
-   **Logging**: Comprehensive activity logging with Morgan
-   **Health Monitoring**: Health check endpoint for Cloud Run
-   **Graceful Shutdown**: Proper SIGTERM/SIGINT handling

## Development

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Health check
curl http://localhost:5000/health  # Development
curl http://localhost:8080/health  # Production
```

## Docker & Deployment

### Docker Build & Push

**Prerequisites**: Pastikan Google Cloud SDK sudah terinstall dan authenticated

```bash
# Build Docker image
docker build -t gcr.io/capstoneproject-460811/capstone-backend:latest .

# Push to Google Container Registry
docker push gcr.io/capstoneproject-460811/capstone-backend:latest
```

### Dockerfile Architecture

This Dockerfile uses a **hybrid Node.js + Python environment**:

-   **Base Image**: Node.js 18 Alpine (lightweight & secure)
-   **Python Environment**: Virtual environment with ML libraries (scikit-learn, numpy, joblib)
-   **Security**: Non-root user (`nodejs:nodejs`) for production safety
-   **Health Check**: Built-in health monitoring for Cloud Run
-   **Production Optimized**: Uses `npm ci --only=production`

### Local Docker Testing

```bash
# Run container locally
docker run -p 8080:8080 gcr.io/capstoneproject-460811/capstone-backend:latest

# Run with environment variables
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e DB_HOST=your_db_host \
  gcr.io/capstoneproject-460811/capstone-backend:latest
```

## Cloud Run Deployment

### Manual Deployment via Console

1. Go to [Google Cloud Run Console](https://console.cloud.google.com/run)
2. Click "Create Service"
3. Select "Deploy one revision from an existing container image"
4. Use image: `gcr.io/capstoneproject-460811/capstone-backend:latest`
5. Set environment variables
6. Configure memory (1GB recommended) and CPU allocation

### CLI Deployment

```bash
# Deploy to Cloud Run
gcloud run deploy capstone-backend \
  --image gcr.io/capstoneproject-460811/capstone-backend:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### Environment Variables for Cloud Run

Set these in Cloud Run console or via CLI:

| Variable      | Production Value       | Description        |
| ------------- | ---------------------- | ------------------ |
| `NODE_ENV`    | `production`           | Environment mode   |
| `DB_HOST`     | Cloud SQL Private IP   | Database host      |
| `DB_USER`     | `your_db_user`         | Database username  |
| `DB_PASSWORD` | `your_db_password`     | Database password  |
| `DB_NAME`     | `mitigasi_production`  | Database name      |
| `CORS_ORIGIN` | Frontend Cloud Run URL | CORS configuration |
| `JWT_SECRET`  | `your_jwt_secret`      | JWT signing secret |

## Cloud SQL Integration

### Connection Setup

The backend connects to **Google Cloud SQL (MySQL)** using private IP for security.

### Cloud SQL Proxy (Development)

```bash
# Download Cloud SQL Proxy
curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64

# Make executable
chmod +x cloud_sql_proxy

# Connect (replace with your instance details)
./cloud_sql_proxy -instances=capstoneproject-460811:asia-southeast1:your-instance=tcp:3306
```

## Monitoring & Logs

```bash
# View real-time logs
gcloud run logs tail capstone-backend --region=asia-southeast1

# View logs for specific deployment
gcloud run logs read --service=capstone-backend --region=asia-southeast1 --limit=50

# Monitor service status
gcloud run services describe capstone-backend --region=asia-southeast1
```

## Troubleshooting

### Common Issues

**🐳 Docker Build Fails**

```bash
# Clear Docker cache and rebuild
docker system prune -a
docker build --no-cache -t gcr.io/capstoneproject-460811/capstone-backend:latest .
```

**☁️ Cloud Run Deployment Issues**

-   Check image exists in Container Registry
-   Verify environment variables are set correctly
-   Monitor memory usage (increase if needed)

**🗄️ Database Connection Issues**

-   Verify Cloud SQL instance is running
-   Check private IP connectivity
-   Validate database credentials

**🔍 Debug Commands**

```bash
# Test container locally
docker run -it gcr.io/capstoneproject-460811/capstone-backend:latest /bin/sh

# Check Cloud Run service status
gcloud run services list --region=asia-southeast1

# Test health endpoint
curl https://your-cloud-run-url/health
```

### Performance Optimization

**Memory & CPU Settings:**

-   **Memory**: 1GB minimum (can increase for ML operations)
-   **CPU**: 1 vCPU (adjust based on load)
-   **Concurrency**: 80 requests per instance (Cloud Run default)

## Database Schema

The application uses MySQL database with tables for:

-   Users (Admin, Faculty, Students)
-   Academic data (Courses, Grades, Curriculum)
-   Monitoring data (Progress, Reports)
-   System logs

## Contributing

Proyek tugas akhir S1 Teknik Komputer - Universitas Telkom

**🚀 Quick Start:**

1. `npm install`
2. Setup `.env` file
3. `npm run dev`
4. Build: `docker build -t gcr.io/capstoneproject-460811/capstone-backend:latest .`
5. Push: `docker push gcr.io/capstoneproject-460811/capstone-backend:latest`
