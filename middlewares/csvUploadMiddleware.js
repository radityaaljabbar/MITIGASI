const multer = require('multer');

// Configure multer for memory storage (sama seperti yang existing)
const storage = multer.memoryStorage();

// Create multer instance khusus untuk CSV bulk import
const csvUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit (lebih besar untuk bulk data)
    },
    fileFilter: (req, file, cb) => {
        // Accept CSV and Excel files only
        const allowedMimeTypes = [
            'text/csv',
            'application/csv',
            'text/plain', // CSV sometimes detected as text/plain
            'application/vnd.ms-excel', // .xls files
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx files
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
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
