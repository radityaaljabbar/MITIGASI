/** @type {import('tailwindcss').Config} */
// File konfigurasi utama untuk Tailwind CSS.
// The main configuration file for Tailwind CSS.
export default {
    // Menentukan file-file mana yang akan dipindai oleh Tailwind untuk mencari class names.
    // Specifies which files Tailwind will scan for class names.
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    // Tempat untuk mengkustomisasi atau memperluas tema default Tailwind.
    // A place to customize or extend Tailwind's default theme.
    theme: {
        extend: {},
    },
    // Tempat untuk menambahkan plugin-plugin Tailwind.
    // A place to add Tailwind plugins.
    plugins: [],
};
