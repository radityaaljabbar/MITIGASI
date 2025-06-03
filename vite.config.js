import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://capstone-backend-1059248723043.asia-southeast2.run.app',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false, // Disable for production
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    charts: ['chart.js', 'recharts'],
                },
            },
        },
    },
    base: '/', // For root deployment
});
