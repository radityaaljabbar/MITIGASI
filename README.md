# MITIGASI - Frontend

Frontend project for **MITIGASI (Integrated Academic Mitigation)** system.

## 🚀 Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.4.0
- **Charts**: Chart.js 4.4.8, Recharts 2.15.3
- **Icons**: Lucide React 0.483.0, React Icons 5.5.0
- **HTTP Client**: Axios 1.9.0 & Native Fetch API
- **Notifications**: React Toastify 11.0.5

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

## Prerequisites
-   Node.js (version 18.0.0 or higher)
-   npm or yarn

## Installation & Setup
1.  **Clone repository**
    ```bash
    git clone https://github.com/miftahfrdmaulana/CapstoneDesgin_MITIGASI.git
    cd "Frontend/frontendCode"
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup environment variables**
    ```bash
    # .env.development
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4.  **Run development server**
    ```bash
    npm run dev
    ```

5.  **Access the application**
    Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Available Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Runs the Vite development server.               |
| `npm run build`   | Builds the application for production.          |
| `npm run build:dev` | Builds the application in development mode.     |
| `npm run lint`    | Runs ESLint for code checking.                  |
| `npm run preview` | Runs local server for build preview.            |

## User Roles & Features
### Admin
- **User Management**: CRUD for all users (Admin, Lecturer, Student).
- **Class Management**: Managing class data and Academic Advisor assignments.
- **Curriculum / Course Management**: Managing courses within the curriculum.
- **Academic Management**: Managing student academic data (course grades, GPA, semester GPA, credits).
- **Activity Logs**: Monitoring all activities performed by admin.

### Academic Advisor
-   **MyStudent**: View list of all mentored students along with summary of their academic, psychological, and financial status.
    -   **Academic Analysis**: GPA trends, credit progress, and detailed grade history.
    -   **Psychological Analysis**: Visualization of DASS-21 test results, test history, and areas of strength and development.
    -   **Financial Analysis**: Reviewing and responding to tuition fee relief requests from students.
- **Course Advisor**: Providing course recommendations.
- **Reports & Feedback**: Reading and responding to student feedback.

### Student
- **My Progress**: Dashboard summary of academic progress (GPA, semester GPA, credits, TAK).
- **My Course**: Viewing course history and recommendations.
- **My Wellness**: Filling out DASS-21 questionnaire and viewing mental health history.
- **My Finance**: Submitting tuition fee relief requests.
- **My Feedback**: Providing feedback or complaints to Academic Advisor.

## Data Visualization
### Chart Components
- **Line & Bar Charts**: Used to display semester GPA trends and credit progress.
- **Custom Tooltips**: Interactive tooltips to provide additional details on charts.

#### Implementation Example (`src/components/compDosenWali/compMyStudent/compAnalisisAkademik/AnalisisTrendContent.jsx`)
```javascript
import Chart from 'chart.js/auto';

ipkChartInstance.current = new Chart(ctx, {
    type: 'line',
    data: { /* ... data ... */ },
    options: { /* ... options ... */ },
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

## Configuration
### Environment Variables
```
# .env.development
VITE_API_BASE_URL=http://localhost:5000/api

# .env.production
VITE_API_BASE_URL=https://capstone-backend-1059248723043.asia-southeast2.run.app/api
VITE_APP_ENV=production
VITE_APP_NAME="MITIGASI - Integrated Academic Mitigation"
VITE_APP_VERSION=1.0.0
```

### API Configuration (config/api.js)
This file provides helper functions to dynamically get API URLs and authentication headers (including JWT tokens).
```javascript
import axios from 'axios';
// Example of getting API URL
export const getApiUrl = (endpoint) => {
    const cleanEndpoint = endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Example of getting authentication headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `Bearer ${token}` };
};
```

### Docker
...

### Deployment
...

### Contributing
...

### License
...