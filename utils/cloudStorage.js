// Cloud Storage Utility - Utility untuk mengelola file upload ke Google Cloud Storage
// Cloud Storage Utility for managing file uploads to Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// =============================================
// ==         STORAGE INITIALIZATION          ==
// =============================================

// Inisialisasi storage client berdasarkan environment
// Initialize storage client based on environment
let storage;

if (process.env.NODE_ENV === 'production') {
    // Production: Gunakan default service account dari Cloud Run
    // Production: Use Cloud Run's default service account
    storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT || 'capstoneproject-460811',
    });
} else {
    // Development: Gunakan service account key file
    // Development: Use service account key file
    const keyPath = path.join(
        __dirname,
        '../config/GCPKeys/CloudStorageAdmin/capstoneproject-460811-1e2c9b707d5c.json'
    );

    storage = new Storage({
        keyFilename: keyPath,
        projectId: 'capstoneproject-460811',
    });
}

// Konfigurasi bucket name dan inisialisasi bucket object
// Configure bucket name and initialize bucket object
const bucketName = process.env.GCS_BUCKET_NAME || 'lampiranfeedback-mhswa';
const bucket = storage.bucket(bucketName);

// =============================================
// ==           FILE UPLOAD FUNCTIONS         ==
// =============================================

/**
 * Upload file ke Google Cloud Storage dengan metadata lengkap
 * Upload file to Google Cloud Storage with complete metadata
 *
 * @param {Object} file - File object dari multer middleware / File object from multer middleware
 * @param {string} folderName - Nama folder dalam bucket (opsional) / Folder name within bucket (optional)
 * @returns {Promise<Object>} - Informasi file termasuk URL publik / File info including public URL
 * @throws {Error} - Error jika upload gagal / Error if upload fails
 */
const uploadFile = async (file, folderName = 'uploads') => {
    try {
        // Validasi keberadaan file
        // Validate file existence
        if (!file) {
            throw new Error('No file provided');
        }

        // Buat nama file unik dengan UUID untuk menghindari konflik
        // Create unique filename with UUID to avoid conflicts
        const originalExt = path.extname(file.originalname);
        const filename = `${folderName}/${uuidv4()}${originalExt}`;

        // Buat referensi ke file baru di bucket
        // Create reference to new file in bucket
        const blob = bucket.file(filename);

        // Buat write stream dengan konfigurasi metadata lengkap
        // Create write stream with complete metadata configuration
        const blobStream = blob.createWriteStream({
            resumable: false, // Non-resumable untuk file kecil (lebih cepat)
            contentType: file.mimetype, // Set content type berdasarkan file
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    originalName: file.originalname,
                    uploadedAt: new Date().toISOString(),
                    uploadedBy: 'capstone-backend',
                    environment: process.env.NODE_ENV || 'development',
                },
            },
        });

        // Return Promise yang resolve dengan public URL saat upload selesai
        // Return Promise that resolves with public URL when upload completes
        return new Promise((resolve, reject) => {
            // Handle error selama upload stream
            // Handle error during upload stream
            blobStream.on('error', (err) => {
                console.error('Upload stream error:', err);
                reject(new Error(`Upload failed: ${err.message}`));
            });

            // Handle sukses upload dan membuat file publik
            // Handle successful upload and make file public
            blobStream.on('finish', async () => {
                try {
                    // Buat file dapat diakses publik
                    // Make file publicly accessible
                    await blob.makePublic();

                    // Konstruksi URL publik untuk akses file
                    // Construct public URL for file access
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

                    // Return informasi lengkap file yang berhasil diupload
                    // Return complete information of successfully uploaded file
                    resolve({
                        url: publicUrl,
                        filename: filename,
                        originalName: file.originalname,
                        size: file.size,
                        mimetype: file.mimetype,
                        uploadedAt: new Date().toISOString(),
                        bucket: bucketName,
                    });
                } catch (err) {
                    console.error('Error making file public:', err);
                    reject(
                        new Error(`Failed to make file public: ${err.message}`)
                    );
                }
            });

            // Tulis data file ke stream dan akhiri
            // Write file data to stream and end it
            blobStream.end(file.buffer);
        });
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(`Error uploading file: ${error.message}`);
    }
};

// =============================================
// ==         FILE MANAGEMENT FUNCTIONS       ==
// =============================================

/**
 * Hapus file dari Google Cloud Storage
 * Delete file from Google Cloud Storage
 *
 * @param {string} filename - Path file dalam bucket / File path in bucket
 * @returns {Promise<boolean>} - Status keberhasilan penghapusan / Deletion success status
 * @throws {Error} - Error jika penghapusan gagal / Error if deletion fails
 */
const deleteFile = async (filename) => {
    try {
        const file = bucket.file(filename);

        // Cek apakah file ada sebelum mencoba menghapus
        // Check if file exists before attempting deletion
        const [exists] = await file.exists();
        if (!exists) {
            console.warn(`File not found: ${filename}`);
            return false;
        }

        // Hapus file dari storage
        // Delete file from storage
        await file.delete();
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        throw new Error(`Error deleting file: ${error.message}`);
    }
};

/**
 * Mendapatkan metadata dan informasi file
 * Get file metadata and information
 *
 * @param {string} filename - Path file dalam bucket / File path in bucket
 * @returns {Promise<Object>} - Metadata file / File metadata
 * @throws {Error} - Error jika gagal mendapatkan info / Error if failed to get info
 */
const getFileInfo = async (filename) => {
    try {
        const file = bucket.file(filename);
        const [metadata] = await file.getMetadata();

        return {
            name: metadata.name,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
            publicUrl: `https://storage.googleapis.com/${bucketName}/${filename}`,
            bucket: bucketName,
        };
    } catch (error) {
        throw new Error(`Error getting file info: ${error.message}`);
    }
};

/**
 * Mendapatkan daftar file dalam folder tertentu
 * List files in a specific folder
 *
 * @param {string} folderName - Nama folder untuk dicari / Folder name to search
 * @returns {Promise<Array>} - Array file dalam folder / Array of files in folder
 * @throws {Error} - Error jika gagal mendapatkan daftar / Error if failed to get list
 */
const listFiles = async (folderName = '') => {
    try {
        const [files] = await bucket.getFiles({
            prefix: folderName, // Filter berdasarkan prefix folder
        });

        // Map file objects ke format yang lebih sederhana
        // Map file objects to simpler format
        return files.map((file) => ({
            name: file.name,
            publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`,
        }));
    } catch (error) {
        throw new Error(`Error listing files: ${error.message}`);
    }
};

// =============================================
// ==        CONNECTION TEST FUNCTIONS        ==
// =============================================

/**
 * Test koneksi storage dan akses bucket untuk debugging
 * Test storage connection and bucket access for debugging
 *
 * @returns {Promise<boolean>} - Status koneksi berhasil / Connection success status
 */
const testConnection = async () => {
    try {
        // Test 1: Cek apakah bisa akses storage service
        // Test 1: Check if we can access the storage service
        const [buckets] = await storage.getBuckets();

        // Test 2: Cek apakah bucket spesifik ada dan dapat diakses
        // Test 2: Check if our specific bucket exists and is accessible
        const [exists] = await bucket.exists();
        if (!exists) {
            console.warn(
                `⚠️ Bucket '${bucketName}' does not exist or is not accessible.`
            );
            return false;
        }

        // Test 3: Coba mendapatkan metadata bucket
        // Test 3: Try to get bucket metadata
        const [metadata] = await bucket.getMetadata();

        return true;
    } catch (error) {
        console.error('❌ Storage connection failed:', error.message);

        // Berikan pesan error yang membantu berdasarkan masalah umum
        // Provide helpful error messages based on common issues
        if (error.code === 403) {
            console.error('   → Check IAM permissions for the service account');
        } else if (error.code === 404) {
            console.error(
                '   → Bucket may not exist or project ID may be incorrect'
            );
        } else if (error.message.includes('keyFilename')) {
            console.error(
                '   → Service account key file may be missing or invalid'
            );
        }

        return false;
    }
};

/**
 * Mendapatkan informasi storage client untuk debugging
 * Get storage client info for debugging
 *
 * @returns {Object} - Informasi konfigurasi storage / Storage configuration info
 */
const getStorageInfo = () => {
    return {
        projectId: storage.projectId,
        bucketName: bucketName,
        environment: process.env.NODE_ENV || 'development',
        authType:
            process.env.NODE_ENV === 'production'
                ? 'default-service-account'
                : 'key-file',
    };
};

// =============================================
// ==              MODULE EXPORTS             ==
// =============================================

module.exports = {
    uploadFile, // Fungsi utama untuk upload file
    deleteFile, // Fungsi untuk menghapus file
    getFileInfo, // Fungsi untuk mendapatkan info file
    listFiles, // Fungsi untuk list file dalam folder
    testConnection, // Fungsi untuk test koneksi
    getStorageInfo, // Fungsi untuk mendapatkan info storage
    bucket, // Bucket object untuk akses langsung
    storage, // Storage client untuk akses langsung
};
