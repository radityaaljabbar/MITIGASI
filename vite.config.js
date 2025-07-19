import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/

export default defineConfig({
    // Daftar plugin yang digunakan oleh Vite.
    // List of plugins used by Vite.
    plugins: [react()],
    // Konfigurasi untuk server pengembangan (development server).
    // Configuration for the development server.
    server: {
        port: 3000,
        host: true,
        hmr: {
            port: 3000,
            host: 'localhost',
        },
        // Konfigurasi proxy untuk menghindari masalah CORS saat pengembangan.
        // Proxy configuration to avoid CORS issues during development.
        proxy: {
            // Setiap permintaan ke '/api' dari frontend akan diteruskan ke 'target'.
            // Any request to '/api' from the frontend will be forwarded to the 'target'.
            '/api': {
                target: 'https://capstone-backend-1059248723043.asia-southeast2.run.app',
                changeOrigin: true,
                secure: true,
                // Menulis ulang path: '/api/login' menjadi '/login' sebelum dikirim ke backend.
                // Rewriting the path: '/api/login' becomes '/login' before being sent to the backend.
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    // Konfigurasi untuk proses build produksi.
    // Configuration for the production build process.
    build: {
        outDir: 'dist', // Nama folder output.
        assetsDir: 'assets', // Nama folder untuk aset di dalam `outDir`.
        sourcemap: false, // Menonaktifkan sourcemap untuk build produksi.
        rollupOptions: {
            output: {
                // Konfigurasi code splitting untuk memisahkan library vendor ke dalam file terpisah.
                // Ini membantu caching browser dan mempercepat waktu muat awal.
                // Code splitting configuration to separate vendor libraries into different files.
                // This helps with browser caching and improves initial load times.
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    charts: ['chart.js', 'recharts'],
                },
            },
        },
    },
    // Path dasar publik saat aplikasi dideploy. '/' berarti aplikasi berada di root domain.
    // The public base path when the application is deployed. '/' means the app is at the domain root.
    base: '/', 
});
