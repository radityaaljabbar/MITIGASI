import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SidebarDosenWali from '../components/compDosenWali/SidebarDosenWali';

const MainLayoutDosenWali = () => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarDosenWali
                expanded={sidebarExpanded}
                setExpanded={setSidebarExpanded}
            />
            <div className="flex-1 overflow-auto bg-[#FAF0E6]">
                <Outlet />
                <ToastContainer />
            </div>
        </div>
    );
};

export default MainLayoutDosenWali;
