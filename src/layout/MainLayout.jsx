import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarMahasiswa from '../components/compMahasiswa/SidebarMahasiswa';
import SidebarDosenWali from '../components/compDosenWali/SidebarDosenWali';
import SidebarAdmin from '../components/compAdmin/SidebarAdmin';

/**
 * Komponen layout utama yang membungkus halaman-halaman yang memerlukan sidebar.
 * Komponen ini secara dinamis menentukan sidebar mana yang akan ditampilkan berdasarkan role pengguna
 * yang diindikasikan oleh path URL.
 * Main layout component that wraps pages requiring a sidebar.
 * It dynamically determines which sidebar to display based on the user's role
 * as indicated by the URL path.
 */
const MainLayout = () => {
    // State untuk mengontrol apakah sidebar dalam keadaan diperluas atau diciutkan.
    // State to control whether the sidebar is expanded or collapsed.
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    // Hook dari React Router untuk mendapatkan informasi lokasi (URL) saat ini.
    // Hook from React Router to get the current location (URL) information.
    const location = useLocation();

    // Menentukan sidebar yang akan ditampilkan berdasarkan awalan path URL.
    // Determine which sidebar to show based on the URL path prefix.
    const isLecturerPath = location.pathname.startsWith('/lecturer');
    const isStudentPath = location.pathname.startsWith('/student');
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Render Sidebar Dosen Wali jika path URL adalah untuk dosen. */}
            {/* Render the Course Advisor's Sidebar if the URL path is for a lecturer. */}
            {isLecturerPath && (
                <SidebarDosenWali
                    expanded={sidebarExpanded}
                    setExpanded={setSidebarExpanded}
                />
            )}

            {/* Render Sidebar Mahasiswa jika path URL adalah untuk mahasiswa. */}
            {/* Render the Student's Sidebar if the URL path is for a student. */}
            {isStudentPath && (
                <SidebarMahasiswa
                    expanded={sidebarExpanded}
                    setExpanded={setSidebarExpanded}
                />
            )}

            {/* Render Sidebar Admin jika path URL adalah untuk admin. */}
            {/* Render the Admin's Sidebar if the URL path is for an admin. */}
            {isAdminPath && (
                <SidebarAdmin
                    expanded={sidebarExpanded}
                    setExpanded={setSidebarExpanded}
                />
            )}

            {/* Kontainer untuk konten utama halaman. */}
            {/* Container for the main page content. */}
            <div className="flex-1 overflow-auto bg-[#FAF0E6]">
                {/* <Outlet> adalah placeholder dari React Router tempat komponen rute anak akan dirender. */}
                {/* <Outlet> is a placeholder from React Router where child route components will be rendered. */}
                <Outlet />
                
                {/* Kontainer untuk notifikasi toast (pop-up). */}
                {/* Container for toast (pop-up) notifications. */}
                <ToastContainer />
            </div>
        </div>
    );
};

export default MainLayout;
