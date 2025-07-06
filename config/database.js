// config/database.js - Konfigurasi MySQL2 dengan dukungan Unix Socket
// MySQL2 configuration with Unix Socket support
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Memuat file environment yang sesuai berdasarkan NODE_ENV
// Load appropriate environment file based on NODE_ENV
const envFile =
    process.env.NODE_ENV === 'production'
        ? '.env.production'
        : process.env.NODE_ENV === 'gcp_dev'
        ? '.env.gcp_dev'
        : '.env.development';

dotenv.config({ path: envFile });

/**
 * Membuat konfigurasi database berdasarkan environment
 * Creates database configuration based on environment
 * @returns {Object} Konfigurasi database / Database configuration
 */
const createDbConfig = () => {
    // Konfigurasi dasar untuk koneksi database
    // Base configuration for database connection
    const baseConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        // Konfigurasi pool koneksi untuk mengoptimalkan performa
        // Connection pool configuration for performance optimization
        waitForConnections: true,
        connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
        queueLimit: 0,

        // Pengaturan timeout untuk koneksi
        // Connection timeout settings
        acquireTimeout: 60000, // Timeout untuk mendapatkan koneksi dari pool / Timeout to acquire connection from pool
        connectTimeout: 30000, // Timeout untuk membuat koneksi baru / Timeout to establish new connection

        // Pengaturan keep alive untuk menjaga koneksi tetap hidup
        // Keep alive settings to maintain connection
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,

        // Pengaturan tambahan untuk pool
        // Additional pool settings
        idleTimeout: 900000, // 15 menit timeout untuk koneksi idle / 15 minutes idle timeout
        maxIdle: 10, // Maksimal koneksi idle / Maximum idle connections
    };

    // Menggunakan Unix socket untuk Cloud Run, fallback ke host untuk development lokal
    // Use Unix socket for Cloud Run, fallback to host for local development
    if (process.env.INSTANCE_UNIX_SOCKET) {
        baseConfig.socketPath = process.env.INSTANCE_UNIX_SOCKET;
        // Unix socket tidak memerlukan SSL / Unix socket doesn't need SSL
    } else {
        baseConfig.host = process.env.DB_HOST;

        // Konfigurasi SSL untuk Cloud SQL (hanya untuk koneksi TCP)
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

// Membuat pool koneksi dengan konfigurasi dinamis
// Create connection pool with dynamic configuration
const pool = mysql.createPool(createDbConfig());

/**
 * Tes koneksi database dengan logika retry
 * Enhanced connection test with retry logic
 * @param {number} retries - Jumlah percobaan ulang / Number of retry attempts
 * @param {number} delay - Delay antara percobaan (ms) / Delay between attempts (ms)
 * @returns {boolean} Status koneksi berhasil atau gagal / Connection success status
 */
const testConnection = async (retries = 3, delay = 2000) => {
    // Melakukan percobaan koneksi sesuai jumlah retry yang ditentukan
    // Attempt connection based on specified retry count
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const connection = await pool.getConnection();

            // Menguji koneksi dengan query sederhana
            // Test connection with simple query
            await connection.execute('SELECT 1 as test');

            // Melepaskan koneksi kembali ke pool
            // Release connection back to pool
            connection.release();
            return true;
        } catch (error) {
            // Memberikan panduan error yang spesifik
            // Provide specific error guidance
            if (error.code === 'ETIMEDOUT') {
                // Timeout koneksi - periksa konektivitas jaringan atau pengaturan Cloud SQL
                // Connection timeout - check network connectivity or Cloud SQL settings
            } else if (error.code === 'ECONNREFUSED') {
                // Koneksi ditolak - periksa apakah instance Cloud SQL berjalan
                // Connection refused - check if Cloud SQL instance is running
            } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                // Akses ditolak - periksa username/password
                // Access denied - check username/password
            } else if (error.code === 'ENOTFOUND') {
                // Host tidak ditemukan - periksa nilai DB_HOST
                // Host not found - check DB_HOST value
            } else if (error.code === 'ENOENT') {
                // Unix socket tidak ditemukan - periksa path INSTANCE_UNIX_SOCKET
                // Unix socket not found - check INSTANCE_UNIX_SOCKET path
            }

            // Retry jika masih ada percobaan tersisa
            // Retry if attempts remaining
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 1.5; // Exponential backoff
            }
        }
    }

    return false;
};

/**
 * Tes koneksi cepat untuk layanan yang memerlukan verifikasi cepat
 * Quick connection test for services that need quick verification
 * @returns {boolean} Status koneksi / Connection status
 */
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

/**
 * Menutup pool koneksi dengan graceful shutdown
 * Graceful pool shutdown
 */
const closePool = async () => {
    try {
        await pool.end();
    } catch (error) {
        // Error handling untuk penutupan pool
        // Error handling for pool closure
    }
};

// Menangani terminasi proses untuk menutup pool dengan baik
// Handle process termination to close pool gracefully
process.on('SIGINT', closePool);
process.on('SIGTERM', closePool);

// Mengeksport fungsi dan objek yang diperlukan untuk modul lain
// Export functions and objects needed by other modules
module.exports = {
    pool,
    testConnection,
    quickConnectionTest,
    closePool,
};
