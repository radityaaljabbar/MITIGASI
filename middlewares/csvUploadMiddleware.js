// CSV Upload Middleware - Middleware untuk upload file CSV/Excel untuk bulk import
// CSV Upload Middleware for CSV/Excel file upload for bulk import operations
const multer = require('multer');

// Konfigurasi multer untuk memory storage (file disimpan di RAM)
// Configure multer for memory storage (files stored in RAM)
const storage = multer.memoryStorage();

// Buat instance multer khusus untuk CSV bulk import
// Create multer instance specifically for CSV bulk import
const csvUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Batas ukuran file 10MB (lebih besar untuk bulk data)
        // 10MB file size limit (larger for bulk data)
    },
    fileFilter: (req, file, cb) => {
        // Hanya terima file CSV dan Excel
        // Accept CSV and Excel files only
        const allowedMimeTypes = [
            'text/csv', // File CSV standar / Standard CSV files
            'application/csv', // File CSV alternatif / Alternative CSV files
            'text/plain', // CSV terkadang terdeteksi sebagai text/plain / CSV sometimes detected as text/plain
            'application/vnd.ms-excel', // File .xls (Excel lama) / .xls files (old Excel)
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // File .xlsx (Excel baru) / .xlsx files (new Excel)
        ];

        // Validasi tipe file yang diupload
        // Validate uploaded file type
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // File diterima / File accepted
        } else {
            // File ditolak dengan pesan error
            // File rejected with error message
            cb(
                new Error(
                    'Invalid file type. Only CSV, XLS, and XLSX files are allowed for bulk import.'
                ),
                false
            );
        }
    },
});

module.exports = csvUpload;
