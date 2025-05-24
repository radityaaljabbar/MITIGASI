// utils/dateHelper.js
/**
 * Utility functions for MySQL datetime handling
 * Fixes issues with ISO string format in MySQL 8.0
 */

/**
 * Convert JavaScript Date to MySQL DATETIME format
 * @param {Date} date - Date object (defaults to current date)
 * @returns {string} - MySQL compatible datetime string
 */
const formatDateForMySQL = (date = new Date()) => {
    // Convert: '2025-05-24T22:42:55.957Z' → '2025-05-24 22:42:55'
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Convert MySQL DATETIME to JavaScript Date
 * @param {string} mysqlDate - MySQL datetime string
 * @returns {Date} - JavaScript Date object
 */
const formatDateFromMySQL = (mysqlDate) => {
    // Convert: '2025-05-24 22:42:55' → JavaScript Date
    return new Date(mysqlDate.replace(' ', 'T') + 'Z');
};

/**
 * Get current datetime in MySQL format
 * @returns {string} - Current datetime for MySQL
 */
const getCurrentMySQLDateTime = () => {
    return formatDateForMySQL(new Date());
};

/**
 * Get MySQL date only (without time)
 * @param {Date} date - Date object (defaults to current date)
 * @returns {string} - MySQL date string (YYYY-MM-DD)
 */
const getCurrentMySQLDate = (date = new Date()) => {
    return date.toISOString().slice(0, 10);
};

/**
 * Add days to current date and return in MySQL format
 * @param {number} days - Number of days to add
 * @returns {string} - Future date in MySQL format
 */
const addDaysToMySQLDate = (days) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return formatDateForMySQL(futureDate);
};

module.exports = {
    formatDateForMySQL,
    formatDateFromMySQL,
    getCurrentMySQLDateTime,
    getCurrentMySQLDate,
    addDaysToMySQLDate,
};
