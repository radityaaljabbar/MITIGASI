import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/compMahasiswa/SidebarMahasiswa';

const MainLayout = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                expanded={sidebarExpanded}
                setExpanded={setSidebarExpanded}
            />
            <div className="flex-1 overflow-auto bg-[#FAF0E6]">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
