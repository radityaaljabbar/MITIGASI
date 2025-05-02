// Main app entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Import database
const { testConnection } = require('./config/database');

// Import routes used:
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import middlewares
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/', authRoutes);
// app.use('/api/student', studentRoutes);
// app.use('/api/faculty', facultyRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware (hrs diletakan di trakhiran disini)
// app.use(errorHandler);

// Mulai server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('Database connection failed. Server will not start.');
            process.exit(1);
        }

        // Start the server
        app.listen(PORT, () => {
            console.log(
                `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
            );
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();
