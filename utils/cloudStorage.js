const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
    keyFilename: path.join(
        __dirname,
        '../config/GCPKeys/CloudStorageAdmin/elliptical-flow-459613-j8-c1617bebfac0.json'
    ),
    projectId: 'elliptical-flow-459613-j8', // Replace with your actual GCP project ID
});

const bucketName = 'lampiranfeedback-mhswa';

const bucket = storage.bucket(bucketName);

/**
 * Upload a file to Google Cloud Storage
 * @param {Object} file - The file object from multer
 * @param {string} folderName - Optional folder within bucket
 * @returns {Promise<string>} - URL of the uploaded file
 */
const uploadFile = async (file, folderName = 'uploads') => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Create a unique filename
        const originalExt = path.extname(file.originalname);
        const filename = `${folderName}/${uuidv4()}${originalExt}`;

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
                },
            },
        });

        // Return a promise that resolves with the public URL when upload completes
        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                reject(err);
            });

            blobStream.on('finish', async () => {
                // Make the file public
                try {
                    await blob.makePublic();

                    // Construct the public URL
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
                    resolve({
                        url: publicUrl,
                        filename: filename,
                        originalName: file.originalname,
                        size: file.size,
                        mimetype: file.mimetype,
                    });
                } catch (err) {
                    reject(err);
                }
            });

            // Write the file data to the stream and end it
            blobStream.end(file.buffer);
        });
    } catch (error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }
};

/**
 * Delete a file from Google Cloud Storage
 * @param {string} filename - The file path in the bucket
 * @returns {Promise<void>}
 */
const deleteFile = async (filename) => {
    try {
        await bucket.file(filename).delete();
        return true;
    } catch (error) {
        throw new Error(`Error deleting file: ${error.message}`);
    }
};

module.exports = {
    uploadFile,
    deleteFile,
};
