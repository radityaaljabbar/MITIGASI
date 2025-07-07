// Date Helper Utility - Utility untuk penanganan format tanggal MySQL dan timezone Indonesia
// Date Helper Utility for MySQL date format handling and Indonesia timezone
/**
 * Utility functions untuk penanganan datetime MySQL dan timezone Indonesia (WIB)
 * Utility functions for MySQL datetime handling and Indonesia timezone (WIB)
 * Mengatasi masalah format ISO string di MySQL 8.0 dan konversi timezone
 * Fixes issues with ISO string format in MySQL 8.0 and timezone conversion
 */

// =============================================
// ==          MYSQL DATE FORMATTING          ==
// =============================================

/**
 * Konversi JavaScript Date ke format MySQL DATETIME
 * Convert JavaScript Date to MySQL DATETIME format
 *
 * @param {Date} date - Object Date JavaScript (default: tanggal sekarang) / JavaScript Date object (default: current date)
 * @returns {string} - String datetime yang kompatibel dengan MySQL / MySQL compatible datetime string
 * @example formatDateForMySQL(new Date()) // "2025-05-24 22:42:55"
 */
const formatDateForMySQL = (date = new Date()) => {
    // Konversi: '2025-05-24T22:42:55.957Z' → '2025-05-24 22:42:55'
    // Convert: '2025-05-24T22:42:55.957Z' → '2025-05-24 22:42:55'
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Konversi MySQL DATETIME ke JavaScript Date
 * Convert MySQL DATETIME to JavaScript Date
 *
 * @param {string} mysqlDate - String datetime dari MySQL / MySQL datetime string
 * @returns {Date} - Object Date JavaScript / JavaScript Date object
 * @example formatDateFromMySQL('2025-05-24 22:42:55') // JavaScript Date object
 */
const formatDateFromMySQL = (mysqlDate) => {
    // Konversi: '2025-05-24 22:42:55' → JavaScript Date
    // Convert: '2025-05-24 22:42:55' → JavaScript Date
    return new Date(mysqlDate.replace(' ', 'T') + 'Z');
};

// =============================================
// ==        INDONESIA TIMEZONE FUNCTIONS     ==
// =============================================

/**
 * Mendapatkan datetime saat ini dalam format MySQL dengan timezone Indonesia (WIB)
 * Get current datetime in MySQL format with Indonesia timezone (WIB)
 *
 * @returns {string} - Datetime saat ini untuk MySQL dalam timezone Indonesia / Current datetime for MySQL in Indonesia timezone
 * @example getCurrentMySQLDateTime() // "2025-05-24 22:42:55" (WIB time)
 */
const getCurrentMySQLDateTime = () => {
    // MySQL server menggunakan UTC, jadi kita tambah 7 jam untuk WIB
    // MySQL server uses UTC, so we add 7 hours for WIB
    const now = new Date();
    const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Tambah 7 jam / Add 7 hours
    return wibTime.toISOString().slice(0, 19).replace('T', ' ');
};

/**
 * Mendapatkan tanggal MySQL saja (tanpa waktu) dalam timezone Indonesia
 * Get MySQL date only (without time) in Indonesia timezone
 *
 * @param {Date} date - Object Date (default: tanggal sekarang) / Date object (default: current date)
 * @returns {string} - String tanggal MySQL (YYYY-MM-DD) / MySQL date string (YYYY-MM-DD)
 * @example getCurrentMySQLDate() // "2025-05-24"
 */
const getCurrentMySQLDate = (date = new Date()) => {
    // Konversi ke timezone Indonesia terlebih dahulu
    // Convert to Indonesia timezone first
    const jakartaTime = new Date(
        date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );
    return jakartaTime.toISOString().slice(0, 10);
};

// =============================================
// ==          DATE CALCULATION FUNCTIONS     ==
// =============================================

/**
 * Menambah hari ke tanggal sekarang dan return dalam format MySQL (timezone Indonesia)
 * Add days to current date and return in MySQL format (Indonesia timezone)
 *
 * @param {number} days - Jumlah hari yang akan ditambahkan / Number of days to add
 * @returns {string} - Tanggal masa depan dalam format MySQL / Future date in MySQL format
 * @example addDaysToMySQLDate(7) // "2025-05-31 22:42:55" (7 days from now in WIB)
 */
const addDaysToMySQLDate = (days) => {
    const now = new Date();

    // Konversi ke timezone Jakarta terlebih dahulu
    // Convert to Jakarta timezone first
    const jakartaTime = new Date(
        now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );

    // Tambah hari yang diminta
    // Add requested days
    jakartaTime.setDate(jakartaTime.getDate() + days);

    return formatDateForMySQL(jakartaTime);
};

// =============================================
// ==              MODULE EXPORTS             ==
// =============================================

module.exports = {
    formatDateForMySQL, // Konversi Date ke format MySQL / Convert Date to MySQL format
    formatDateFromMySQL, // Konversi MySQL datetime ke Date / Convert MySQL datetime to Date
    getCurrentMySQLDateTime, // Datetime saat ini dalam WIB / Current datetime in WIB
    getCurrentMySQLDate, // Tanggal saat ini dalam WIB / Current date in WIB
    addDaysToMySQLDate, // Tambah hari ke tanggal saat ini / Add days to current date
};
