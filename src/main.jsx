import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Membuat root React dan me-render komponen App di dalam elemen dengan id 'root'
// Creating the React root and rendering the App component inside the element with the id 'root'
createRoot(document.getElementById('root')).render(
  // StrictMode alat untuk menyoroti potensi masalah dalam aplikasi
  // StrictMode is a tool for highlighting potential problems in an application
  <StrictMode>
    <App />
  </StrictMode>,
)
