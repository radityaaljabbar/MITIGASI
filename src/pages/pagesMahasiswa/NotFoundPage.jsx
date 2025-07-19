import React from 'react';
import { Link } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Komponen untuk menampilkan halaman 404 Not Found ketika rute tidak ditemukan.
 * Component to display the 404 Not Found page when a route is not found.
 */
const NotFoundPage = () => {
    return (
        <section className="text-center flex flex-col justify-center items-center h-96">
            {/* Ikon peringatan */}
            {/* Warning icon */}
            <FaExclamationTriangle className="fas fa-exclamation-triangle text-yellow-400 text-6xl mb-4" />
            
            {/* Teks utama halaman */}
            {/* Main page text */}
            <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
            <p className="text-xl mb-5">This page does not exist</p>
            
            {/* Tombol untuk kembali ke halaman utama */}
            {/* Button to go back to the main page */}
            <Link
                to="/"
                className="text-white bg-[#951A22] hover:bg-[#951a22c2] rounded-md px-3 py-2 mt-4">
                Go Back
            </Link>
        </section>
    );
};

export default NotFoundPage;