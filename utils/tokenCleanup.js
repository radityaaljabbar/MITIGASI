// utils/tokenCleanup.js
const { pool } = require('../config/database');

const cleanupBlacklist = async () => {
    try {
        // Delete expired tokens from blacklist
        const [result] = await pool.execute(
            'DELETE FROM token_blacklist WHERE expires_at < NOW()'
        );

        console.log(
            `Token blacklist cleaned up: ${result.affectedRows} expired tokens removed`
        );
    } catch (error) {
        console.error('Error cleaning up token blacklist:', error);
    }
};

// Run cleanup immediately when server starts
cleanupBlacklist();

// Run cleanup every hour
setInterval(cleanupBlacklist, 60 * 60 * 1000);

module.exports = cleanupBlacklist;
