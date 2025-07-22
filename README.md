# MITIGASI Frontend

**Mitigasi Akademik Terintegrasi** - Frontend Application

React-based web application untuk sistem mitigasi dan monitoring progress akademik mahasiswa. Dikembangkan sebagai proyek tugas akhir S1 Teknik Komputer Universitas Telkom.

## Tech Stack

-   **Framework**: React 19
-   **Build Tool**: Vite 6.2.0
-   **Styling**: Tailwind CSS 3.4.17
-   **Routing**: React Router DOM 7.4.0
-   **Charts**: Chart.js 4.4.8, Recharts 2.15.3
-   **Icons**: Lucide React 0.483.0, React Icons 5.5.0
-   **HTTP Client**: Axios 1.9.0 & Native Fetch API
-   **Notifications**: React Toastify 11.0.5
-   **Container**: Docker with Nginx
-   **Deployment**: Google Cloud Run

## Prerequisites

-   Node.js (v18.0.0 atau lebih baru)
-   NPM atau Yarn
-   **Google Cloud SDK** (untuk deployment)

## Installation

1. Clone repository

```bash
git clone https://github.com/miftahfrdmaulana/CapstoneDesgin_MITIGASI.git
cd "Frontend/frontendCode"
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Run development server

```bash
npm run dev
```

5. Access the application

```
http://localhost:3000
```

## Environment Configuration

| Variable            | Development                 | Production                                                           | Description             |
| ------------------- | --------------------------- | -------------------------------------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | `https://capstone-backend-1059248723043.asia-southeast2.run.app/api` | Backend API endpoint    |
| `VITE_APP_ENV`      | `development`               | `production`                                                         | Application environment |
| `VITE_APP_NAME`     | `MITIGASI - Development`    | `MITIGASI - Integrated Academic Mitigation`                          | Application name        |
| `VITE_APP_VERSION`  | `1.0.0-dev`                 | `1.0.0`                                                              | Application version     |

## Available Scripts

| Script              | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Runs the Vite development server           |
| `npm run build`     | Builds the application for production      |
| `npm run build:dev` | Builds the application in development mode |
| `npm run lint`      | Runs ESLint for code checking              |
| `npm run preview`   | Runs local server for build preview        |

## Project Structure

```
src/
├── assets/
│   ├── data/UsedData/          # Mock data for psychology test purposes
│   └── images/                 # Image assets
├── components/
│   ├── compAdmin/              # Admin-specific components
│   ├── compDosenWali/          # Academic Advisor-specific components
│   ├── compMahasiswa/          # Student-specific components
│   └── shared/                 # Reusable components
├── config/
│   └── api.js                  # API configuration
├── layout/
│   └── MainLayout.jsx          # Main application layout
├── pages/                      # Pages based on roles
├── services/                   # Service layer for API calls
└── main.jsx                    # Application entry point
```

## User Roles & Features

### 👨‍💻 **Admin**

-   **User Management**: CRUD for all users (Admin, Lecturer, Student)
-   **Class Management**: Managing class data and Academic Advisor assignments
-   **Curriculum / Course Management**: Managing courses within the curriculum
-   **Academic Management**: Managing student academic data (course grades, GPA, semester GPA, credits)
-   **Activity Logs**: Monitoring all activities performed by admin

### 👨‍🏫 **Academic Advisor (Dosen Wali)**

-   **MyStudent**: View list of all mentored students along with summary of their academic, psychological, and financial status
    -   **Academic Analysis**: GPA trends, credit progress, and detailed grade history
    -   **Psychological Analysis**: Visualization of DASS-21 test results, test history, and areas of strength and development
    -   **Financial Analysis**: Reviewing and responding to tuition fee relief requests from students
-   **Course Advisor**: Providing course recommendations
-   **Reports & Feedback**: Reading and responding to student feedback

### 🎓 **Student**

-   **My Progress**: Dashboard summary of academic progress (GPA, semester GPA, credits, TAK)
-   **My Course**: Viewing course history and recommendations
-   **My Wellness**: Filling out DASS-21 questionnaire and viewing mental health history
-   **My Finance**: Submitting tuition fee relief requests
-   **My Feedback**: Providing feedback or complaints to Academic Advisor

## Data Visualization

### Chart Components

-   **Line & Bar Charts**: Used to display semester GPA trends and credit progress
-   **Custom Tooltips**: Interactive tooltips to provide additional details on charts

#### Implementation Example

```javascript
import Chart from 'chart.js/auto';

ipkChartInstance.current = new Chart(ctx, {
    type: 'line',
    data: {
        /* ... data ... */
    },
    options: {
        /* ... options ... */
    },
});
```

## Route Structure

```
/                         # Login Page
/student/*                # Student Dashboard & Features
/lecturer/*               # Academic Advisor Dashboard & Features
/admin/*                  # Admin Dashboard & Features
/*                        # Not Found page for invalid routes
```

## API Configuration

### API Helper Functions (config/api.js)

```javascript
import axios from 'axios';

// Get API URL dynamically
export const getApiUrl = (endpoint) => {
    const cleanEndpoint = endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Get authentication headers with JWT
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};
```

## Docker & Deployment

### Docker Build & Push

**Prerequisites**: Pastikan Google Cloud SDK sudah terinstall dan authenticated

```bash
# Build Docker image
docker build -t gcr.io/capstoneproject-460811/capstone-frontend:latest .

# Push to Google Container Registry
docker push gcr.io/capstoneproject-460811/capstone-frontend:latest
```

### Dockerfile Architecture

This Dockerfile uses a **multi-stage build approach**:

#### Stage 1: Build

-   **Base Image**: Node.js 20 Alpine
-   **Build Process**: Compiles React app using Vite
-   **Environment**: Production optimized build
-   **Output**: Static files in `/app/dist`

#### Stage 2: Serve

-   **Base Image**: Nginx stable Alpine
-   **Web Server**: Nginx for serving static files
-   **Configuration**: Dynamic environment variable substitution
-   **Port**: 8080 (Cloud Run standard)

### Local Docker Testing

```bash
# Run container locally
docker run -p 8080:8080 gcr.io/capstoneproject-460811/capstone-frontend:latest

# Run with custom environment variables
docker run -p 8080:8080 \
  -e VITE_API_BASE_URL=http://localhost:5000/api \
  gcr.io/capstoneproject-460811/capstone-frontend:latest
```

## Cloud Run Deployment

### Manual Deployment via Console

1. Go to [Google Cloud Run Console](https://console.cloud.google.com/run)
2. Click "Create Service"
3. Select "Deploy one revision from an existing container image"
4. Use image: `gcr.io/capstoneproject-460811/capstone-frontend:latest`
5. Set environment variables
6. Configure port to 8080

### CLI Deployment

```bash
# Deploy to Cloud Run
gcloud run deploy capstone-frontend \
  --image gcr.io/capstoneproject-460811/capstone-frontend:latest \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5
```

### Environment Variables for Cloud Run

Set these in Cloud Run console or via CLI:

| Variable            | Production Value      | Description          |
| ------------------- | --------------------- | -------------------- |
| `VITE_API_BASE_URL` | Backend Cloud Run URL | Backend API endpoint |
| `VITE_APP_ENV`      | `production`          | Environment mode     |
| `VITE_APP_NAME`     | `MITIGASI`            | Application name     |
| `VITE_APP_VERSION`  | `1.0.0`               | Application version  |

## Monitoring & Logs

```bash
# View real-time logs
gcloud run logs tail capstone-frontend --region=asia-southeast1

# View logs for specific deployment
gcloud run logs read --service=capstone-frontend --region=asia-southeast1 --limit=50

# Monitor service status
gcloud run services describe capstone-frontend --region=asia-southeast1
```

## Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

**⚛️ Build Fails**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

**🐳 Docker Build Issues**

```bash
# Clear Docker cache
docker system prune -a
docker build --no-cache -t gcr.io/capstoneproject-460811/capstone-frontend:latest .
```

**☁️ Cloud Run Issues**

-   Verify image exists in Container Registry
-   Check environment variables are set correctly
-   Ensure port 8080 is configured
-   Monitor memory usage (increase if needed)

**🔍 Debug Commands**

```bash
# Test container locally
docker run -it gcr.io/capstoneproject-460811/capstone-frontend:latest /bin/sh

# Check build output
npm run build && ls -la dist/

# Test production build locally
npm run preview
```

### Performance Optimization

**Memory & CPU Settings:**

-   **Memory**: 512MB (sufficient for static files)
-   **CPU**: 1 vCPU
-   **Concurrency**: 80 requests per instance (Cloud Run default)

**Build Optimization:**

-   Code splitting with Vite
-   Tree shaking for unused imports
-   Optimized asset compression
-   Lazy loading for route components

## Key Features Implementation

### Authentication Flow

-   JWT token storage in localStorage
-   Automatic token refresh
-   Role-based route protection
-   Secure logout with token cleanup

### State Management

-   React Context for global state
-   Local state with useState/useEffect
-   Form state management
-   Error boundary implementation

### UI/UX Features

-   Responsive design with Tailwind CSS
-   Interactive charts and visualizations
-   Real-time notifications with React Toastify
-   Loading states and error handling
-   Accessible components with ARIA labels

## Contributing

Proyek tugas akhir S1 Teknik Komputer - Universitas Telkom

---

**🚀 Quick Start:**

1. `npm install`
2. Setup `.env` file
3. `npm run dev`
4. Build: `docker build -t gcr.io/capstoneproject-460811/capstone-frontend:latest .`
5. Push: `docker push gcr.io/capstoneproject-460811/capstone-frontend:latest`
