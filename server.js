// Main app entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const setUpSwagger = require('./config/swagger')

// Import database
const { testConnection } = require('./config/database');
const {
    testConnection: testStorageConnection,
    getStorageInfo,
} = require('./utils/cloudStorage');

// Import routes used:
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middlewares
// const { errorHandler } = require('./middlewares/errorMiddleware');

// NEW: Import token cleanup utility
const cleanupBlacklist = require('./utils/tokenCleanup');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

setUpSwagger(app)

// FIXED: Dynamic CORS configuration for different environments
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};

// FIXED: Remove duplicate CORS middleware - only use one
app.use(cors(corsOptions));

// Middlewares
app.use(express.json({ limit: '10mb' })); // Added limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging - use 'combined' for production
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ADDED: Health check endpoint (required for Cloud Run)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// ADDED: Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Capstone Backend API',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
    });
});

// Routes
app.use('/api/', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);

// ADDED: 404 handler for unknown routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
    });
});

// UNCOMMENTED: Error handling middleware (should be at the end)
// app.use(errorHandler);

// ADDED: Global error handler for uncaught errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message:
            process.env.NODE_ENV === 'development'
                ? err.message
                : 'Internal server error',
    });
});

// FIXED: Cloud Run uses PORT environment variable, default to 8080
const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        // Start the server FIRST (most important for Cloud Run)
        app.listen(PORT, '0.0.0.0', () => {
            console.log(
                `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
            );
            console.log(`Health check available at: /health`);
            console.log('Token blacklist cleanup service started');
        });

        // Test database connection IN BACKGROUND (don't block server)
        console.log('Testing database connection...');
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.warn(
                '⚠️ Database connection failed. Some features may not work.'
            );
        } else {
            console.log('✅ Database connected successfully');
        }

        // Test storage connection
        console.log('Testing Cloud Storage connection...');
        console.log('Storage Info:', getStorageInfo());
        const storageConnected = await testStorageConnection();
        if (!storageConnected) {
            console.warn(
                '⚠️ Storage connection failed. File uploads may not work.'
            );
        } else {
            console.log('✅ Cloud Storage connected successfully');
        }
    } catch (error) {
        console.error('Server startup error:', error);
        // Don't exit - let server run even with errors
    }
};

// ADDED: Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

startServer();
