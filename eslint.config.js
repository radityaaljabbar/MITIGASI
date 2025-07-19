import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Konfigurasi ESLint untuk menjaga kualitas dan konsistensi kode.
// ESLint configuration to maintain code quality and consistency.
export default [
  // Mengabaikan folder 'dist' (hasil build) dari proses linting.
  // Ignores the 'dist' folder (build output) from the linting process.
  { ignores: ['dist'] },

  // Konfigurasi utama untuk file JavaScript dan JSX.
  // Main configuration for JavaScript and JSX files.
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    // Mendaftarkan plugin yang akan digunakan.
    // Registering the plugins to be used.
    plugins: {
      'react-hooks': reactHooks, // Plugin untuk aturan terkait React Hooks.
      'react-refresh': reactRefresh, // Plugin untuk memastikan React Fast Refresh bekerja dengan benar.
    },
    // Aturan-aturan linting yang akan diterapkan.
    // The linting rules that will be applied.
    rules: {
      ...js.configs.recommended.rules, // Menggunakan set aturan dasar yang direkomendasikan ESLint.
      ...reactHooks.configs.recommended.rules, // Menggunakan aturan yang direkomendasikan untuk React Hooks.
      // Aturan untuk variabel yang tidak digunakan.
      // Rule for unused variables.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Memberi error, tapi mengabaikan variabel yang diawali huruf besar atau underscore.
      // Aturan untuk React Fast Refresh.
      // Rule for React Fast Refresh.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
