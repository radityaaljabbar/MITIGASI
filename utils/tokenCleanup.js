// utils/tokenCleanup.js
const { pool } = require('../config/database');

const cleanupBlacklist = async () => {
    try {
        // Check if pool is available
        if (!pool) {
            console.warn('Database pool not available, skipping token cleanup');
            return;
        }

        // Delete expired tokens from blacklist
        const [result] = await pool.execute(
            'DELETE FROM token_blacklist WHERE expires_at < NOW()'
        );

        console.log(
            `Token blacklist cleaned up: ${result.affectedRows} expired tokens removed`
        );
    } catch (error) {
        // Handle specific database connection errors
        if (error.code === 'ECONNABORTED') {
            console.error('Database connection timed out during token cleanup');
        } else if (error.code === 'EHOSTUNREACH') {
            console.error('Database server unreachable during token cleanup');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('Database connection refused during token cleanup');
        } else {
            console.error('Error cleaning up token blacklist:', error.message);
        }

        // Don't crash the application, just log and continue
        console.log('Token cleanup will retry in the next cycle');
    }
};

// Function to test database connectivity
const testDatabaseConnection = async () => {
    try {
        await pool.execute('SELECT 1');
        console.log('Database connection test successful');
        return true;
    } catch (error) {
        console.error('Database connection test failed:', error.message);
        return false;
    }
};

// Run cleanup with initial connection test
const initializeCleanup = async () => {
    console.log('Initializing token cleanup service...');

    // Test connection before starting cleanup
    const isConnected = await testDatabaseConnection();

    if (isConnected) {
        // Run initial cleanup
        await cleanupBlacklist();

        // Set up recurring cleanup
        setInterval(cleanupBlacklist, 60 * 60 * 1000);
        console.log('Token cleanup service started successfully');
    } else {
        console.warn(
            'Database not available, token cleanup service will retry...'
        );

        // Retry connection every 5 minutes if initial connection fails
        const retryInterval = setInterval(async () => {
            const connected = await testDatabaseConnection();
            if (connected) {
                clearInterval(retryInterval);
                await cleanupBlacklist();
                setInterval(cleanupBlacklist, 60 * 60 * 1000);
                console.log('Token cleanup service started after retry');
            }
        }, 5 * 60 * 1000);
    }
};

// Initialize the cleanup service
initializeCleanup();

module.exports = cleanupBlacklist;
