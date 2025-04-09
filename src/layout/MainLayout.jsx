import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarMahasiswa from '../components/compMahasiswa/SidebarMahasiswa';
import SidebarDosenWali from '../components/compDosenWali/SidebarDosenWali';

const MainLayout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const location = useLocation();

    // Determine which sidebar to show based on the URL path
    const isLecturerPath = location.pathname.startsWith('/lecturer');
    const isStudentPath = location.pathname.startsWith('/student');

    return (
        <div className="flex h-screen overflow-hidden">
            {isLecturerPath && (
                <SidebarDosenWali
                    expanded={sidebarExpanded}
                    setExpanded={setSidebarExpanded}
                />
            )}

            {isStudentPath && (
                <SidebarMahasiswa
                    expanded={sidebarExpanded}
                    setExpanded={setSidebarExpanded}
                />
            )}

            <div className="flex-1 overflow-auto bg-[#FAF0E6]">
                <Outlet />
                <ToastContainer />
            </div>
        </div>
    );
};

export default MainLayout;
