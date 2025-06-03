// config/database.js - Fixed MySQL2 configuration with Unix Socket support
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load appropriate environment file
const envFile =
    process.env.NODE_ENV === 'production'
        ? '.env.production'
        : process.env.NODE_ENV === 'gcp_dev'
        ? '.env.gcp_dev'
        : '.env.development';

dotenv.config({ path: envFile });

// Create database configuration based on environment
const createDbConfig = () => {
    const baseConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        // Pool configuration (VALID options)
        waitForConnections: true,
        connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
        queueLimit: 0,

        // Connection timeout settings (CORRECT property names)
        acquireTimeout: 60000, // ✅ Valid for pool

        // Individual connection settings
        connectTimeout: 30000, // ✅ Connection establishment timeout

        // Keep alive settings
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,

        // Additional pool settings
        idleTimeout: 900000, // ✅ 15 minutes idle timeout
        maxIdle: 10, // ✅ Max idle connections
    };

    // Use Unix socket for Cloud Run, fallback to host for local development
    if (process.env.INSTANCE_UNIX_SOCKET) {
        console.log('🔌 Using Unix socket connection for Cloud Run');
        baseConfig.socketPath = process.env.INSTANCE_UNIX_SOCKET;
        // Remove SSL for Unix socket (not needed)
    } else {
        console.log('🔌 Using TCP host connection for local development');
        baseConfig.host = process.env.DB_HOST;

        // SSL configuration for Cloud SQL (only for TCP connections)
        baseConfig.ssl =
            process.env.DB_HOST !== 'localhost'
                ? {
                      rejectUnauthorized: false,
                  }
                : false;
    }

    return baseConfig;
};

// Create connection pool with dynamic configuration
const pool = mysql.createPool(createDbConfig());

// Enhanced connection test with retry logic
const testConnection = async (retries = 3, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Database connection attempt ${attempt}/${retries}...`);

            const connection = await pool.getConnection();

            // Test the connection with a simple query
            await connection.execute('SELECT 1 as test');

            console.log(
                `✅ Database connection established successfully (attempt ${attempt})`
            );
            console.log(
                `   Connection method: ${
                    process.env.INSTANCE_UNIX_SOCKET
                        ? 'Unix Socket'
                        : 'TCP Host'
                }`
            );
            console.log(
                `   ${process.env.INSTANCE_UNIX_SOCKET ? 'Socket' : 'Host'}: ${
                    process.env.INSTANCE_UNIX_SOCKET || process.env.DB_HOST
                }`
            );
            console.log(`   Database: ${process.env.DB_NAME}`);
            console.log(`   User: ${process.env.DB_USER}`);

            connection.release();
            return true;
        } catch (error) {
            console.error(
                `❌ Database connection attempt ${attempt} failed:`,
                error.message
            );

            // Provide specific error guidance
            if (error.code === 'ETIMEDOUT') {
                console.error(
                    '   → Connection timeout - check network connectivity or Cloud SQL settings'
                );
            } else if (error.code === 'ECONNREFUSED') {
                console.error(
                    '   → Connection refused - check if Cloud SQL instance is running'
                );
            } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                console.error('   → Access denied - check username/password');
            } else if (error.code === 'ENOTFOUND') {
                console.error('   → Host not found - check DB_HOST value');
            } else if (error.code === 'ENOENT') {
                console.error(
                    '   → Unix socket not found - check INSTANCE_UNIX_SOCKET path'
                );
            }

            if (attempt < retries) {
                console.log(`   ⏳ Retrying in ${delay / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 1.5; // Exponential backoff
            }
        }
    }

    console.error('❌ All database connection attempts failed');
    return false;
};

// Simple connection test for services that need quick verification
const quickConnectionTest = async () => {
    try {
        const connection = await pool.getConnection();
        await connection.execute('SELECT 1 as test');
        connection.release();
        return true;
    } catch (error) {
        return false;
    }
};

// Graceful pool shutdown
const closePool = async () => {
    try {
        await pool.end();
        console.log('Database pool closed successfully');
    } catch (error) {
        console.error('Error closing database pool:', error.message);
    }
};

// Handle process termination
process.on('SIGINT', closePool);
process.on('SIGTERM', closePool);

module.exports = {
    pool,
    testConnection,
    quickConnectionTest,
    closePool,
};
