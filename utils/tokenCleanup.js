// utils/tokenCleanup.js - Fixed to use shared pool properly
const { pool, quickConnectionTest } = require('../config/database');

const cleanupBlacklist = async () => {
    try {
        // Quick connection test first
        const isConnected = await quickConnectionTest();
        if (!isConnected) {
            console.warn(
                'Database not available for token cleanup, skipping...'
            );
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
        if (error.code === 'ETIMEDOUT') {
            console.warn('Database connection timed out during token cleanup');
        } else if (error.code === 'EHOSTUNREACH') {
            console.warn('Database server unreachable during token cleanup');
        } else if (error.code === 'ECONNREFUSED') {
            console.warn('Database connection refused during token cleanup');
        } else {
            console.warn('Error cleaning up token blacklist:', error.message);
        }

        // Don't crash the application, just log and continue
        console.log('Token cleanup will retry in the next cycle');
    }
};

// Initialize cleanup service (removed the complex retry logic)
const initializeCleanup = async () => {
    console.log('Initializing token cleanup service...');

    try {
        // Run initial cleanup (will skip if DB not available)
        await cleanupBlacklist();

        // Set up recurring cleanup every hour
        setInterval(cleanupBlacklist, 60 * 60 * 1000);
        console.log('Token cleanup service started successfully');
    } catch (error) {
        console.warn(
            'Token cleanup service initialization failed:',
            error.message
        );
        console.log('Service will still attempt periodic cleanup');

        // Still set up the interval even if first cleanup fails
        setInterval(cleanupBlacklist, 60 * 60 * 1000);
    }
};

// Initialize the cleanup service when module is loaded
initializeCleanup();

module.exports = cleanupBlacklist;
