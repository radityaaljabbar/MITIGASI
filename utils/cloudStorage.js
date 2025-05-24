const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Initialize storage client based on environment
let storage;

if (process.env.NODE_ENV === 'production') {
    // Production: Use Cloud Run's default service account
    storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT || 'capstoneproject-460811',
    });
    console.log('Using Cloud Run default service account for storage');
} else {
    // Development: Use service account key file
    const keyPath = path.join(
        __dirname,
        '../config/GCPKeys/CloudStorageAdmin/capstoneproject-460811-1e2c9b707d5c.json'
    );

    storage = new Storage({
        keyFilename: keyPath,
        projectId: 'capstoneproject-460811',
    });
    console.log('Using service account key file for storage');
}

const bucketName = process.env.GCS_BUCKET_NAME || 'lampiranfeedback-mhswa';
const bucket = storage.bucket(bucketName);

/**
 * Upload a file to Google Cloud Storage
 * @param {Object} file - The file object from multer
 * @param {string} folderName - Optional folder within bucket
 * @returns {Promise<Object>} - File info including URL
 */
const uploadFile = async (file, folderName = 'uploads') => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Create a unique filename
        const originalExt = path.extname(file.originalname);
        const filename = `${folderName}/${uuidv4()}${originalExt}`;

        console.log(`Uploading file: ${file.originalname} as ${filename}`);

        // Create a reference to the new file
        const blob = bucket.file(filename);

        // Create a write stream
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
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

        // Return a promise that resolves with the public URL when upload completes
        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                console.error('Upload stream error:', err);
                reject(new Error(`Upload failed: ${err.message}`));
            });

            blobStream.on('finish', async () => {
                try {
                    // Make the file public
                    await blob.makePublic();

                    // Construct the public URL
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

                    console.log(`File uploaded successfully: ${filename}`);

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

            // Write the file data to the stream and end it
            blobStream.end(file.buffer);
        });
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(`Error uploading file: ${error.message}`);
    }
};

/**
 * Delete a file from Google Cloud Storage
 * @param {string} filename - The file path in the bucket
 * @returns {Promise<boolean>}
 */
const deleteFile = async (filename) => {
    try {
        const file = bucket.file(filename);

        // Check if file exists first
        const [exists] = await file.exists();
        if (!exists) {
            console.warn(`File not found: ${filename}`);
            return false;
        }

        await file.delete();
        console.log(`File deleted successfully: ${filename}`);
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        throw new Error(`Error deleting file: ${error.message}`);
    }
};

/**
 * Get file metadata and info
 * @param {string} filename - The file path in the bucket
 * @returns {Promise<Object>}
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
 * List files in a folder
 * @param {string} folderName - The folder to list files from
 * @returns {Promise<Array>}
 */
const listFiles = async (folderName = '') => {
    try {
        const [files] = await bucket.getFiles({
            prefix: folderName,
        });

        return files.map((file) => ({
            name: file.name,
            publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`,
        }));
    } catch (error) {
        throw new Error(`Error listing files: ${error.message}`);
    }
};

/**
 * Test storage connection and bucket access
 * @returns {Promise<boolean>}
 */
const testConnection = async () => {
    try {
        // Test 1: Check if we can access the storage service
        const [buckets] = await storage.getBuckets();
        console.log(
            `✅ Storage connection successful. Found ${buckets.length} buckets.`
        );

        // Test 2: Check if our specific bucket exists and is accessible
        const [exists] = await bucket.exists();
        if (exists) {
            console.log(`✅ Bucket '${bucketName}' exists and is accessible.`);
        } else {
            console.warn(
                `⚠️ Bucket '${bucketName}' does not exist or is not accessible.`
            );
            return false;
        }

        // Test 3: Try to get bucket metadata
        const [metadata] = await bucket.getMetadata();
        console.log(
            `✅ Bucket metadata retrieved. Location: ${metadata.location}`
        );

        return true;
    } catch (error) {
        console.error('❌ Storage connection failed:', error.message);

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
 * Get storage client info for debugging
 * @returns {Object}
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

module.exports = {
    uploadFile,
    deleteFile,
    getFileInfo,
    listFiles,
    testConnection,
    getStorageInfo,
    bucket,
    storage,
};
