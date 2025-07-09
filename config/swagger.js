// Import dependencies yang diperlukan untuk Swagger
// Import required dependencies for Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

// Load environment variables untuk digunakan di sini
// Load environment variables to be used here
dotenv.config();

// Ambil port dari environment, dengan default 5000 jika tidak ada
// Get port from environment, with default 5000 if not available
const port = process.env.PORT || 5000;

// Konfigurasi utama untuk Swagger JSDoc
// Main configuration for Swagger JSDoc
const options = {
  definition: {
    // Versi OpenAPI yang digunakan
    // OpenAPI version being used
    openapi: '3.0.0',
    
    // Informasi dasar tentang API
    // Basic information about the API
    info: {
      title: 'API MITIGASI',
      version: '1.0.0',
      description: 'Dokumentasi API lengkap untuk sistem MITIGASI, mencakup fitur untuk Admin, Dosen Wali, dan Mahasiswa.',
    },
    
    // Daftar server yang tersedia untuk API
    // List of available servers for the API
    servers: [
      {
          url: `http://localhost:${port}`,
          description: 'Local Development Server',
      },
    ],
    
    // Mendefinisikan semua Tags yang akan digunakan di aplikasi
    // Define all Tags that will be used in the application
    tags: [
        {
            name: 'Authentication',
            description: 'API untuk login, logout, dan manajemen sesi.'
        },
        {
            name: 'Admin',
            description: 'API untuk fitur-fitur Admin.'
        },
        {
            name: 'Admin - Logging',
            description: 'API untuk melihat log aktivitas admin.'
        },
        {
            name: 'Dosen Wali',
            description: 'API untuk fitur-fitur Dosen Wali.'
        },
        {
            name: 'Mahasiswa',
            description: 'API untuk fitur-fitur Mahasiswa.'
        }
    ],
    
    // Komponen yang dapat digunakan kembali di seluruh dokumentasi
    // Reusable components throughout the documentation
    components: {
        // Skema keamanan untuk autentikasi
        // Security schemes for authentication
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Masukkan token JWT dengan format: Bearer {token}'
            }
        }
    },
    
    // Keamanan global yang diterapkan ke semua endpoint
    // Global security applied to all endpoints
    security: [
        {
            bearerAuth: []
        }
    ]
  },
  
  // Path ke file-file yang berisi anotasi Swagger
  // Path to files containing Swagger annotations
  apis: ['./routes/*.js'], // Path ini akan memindai semua file route
};

// Generate spesifikasi Swagger dari konfigurasi yang telah didefinisikan
// Generate Swagger specification from the defined configuration
const swaggerSpec = swaggerJsdoc(options);

// Export fungsi untuk mengintegrasikan Swagger dengan aplikasi Express
// Export function to integrate Swagger with Express application
module.exports = (app) => {
  // Setup middleware Swagger UI pada endpoint /api-docs
  // Setup Swagger UI middleware on /api-docs endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
      // Mengaktifkan fitur explorer pada Swagger UI
      // Enable explorer feature in Swagger UI
      explorer: true,
      
      // CSS kustom untuk menyembunyikan topbar
      // Custom CSS to hide the topbar
      customCss: '.swagger-ui .topbar { display: none }',
      
      // Judul kustom untuk halaman Swagger
      // Custom title for Swagger page
      customSiteTitle: "Dokumentasi API - POS Skripsi"
  }));
};