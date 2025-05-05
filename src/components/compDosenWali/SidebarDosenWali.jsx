import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';

// Import icon-icon yang diperlukan
import toggleSidebarIcon from '../../assets/images/imageDosenWali/sidebarImages/toggleSidebar.png';
import logoutIcon from '../../assets/images/imageDosenWali/sidebarImages/LogoutIcon.png';
import myStudentsIcon from '../../assets/images/imageDosenWali/sidebarImages/MyStudentsIcon.png';
import myCourseAdvisorIcon from '../../assets/images/imageDosenWali/sidebarImages/MyCourseAdvisorIcon.png';
import myReportIcon from '../../assets/images/imageDosenWali/sidebarImages/MyReportIcon.png';

const SidebarDosenWali = ({ expanded, setExpanded }) => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Handle logout function
    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            setIsLoggingOut(true);
            const result = await logoutUser();

            if (result.success) {
                // Redirect to login page on successful logout
                navigate('/');
            } else {
                console.error('Logout failed:', result.message);
                // Still redirect to login page even if server-side logout fails
                // Since we've already cleared localStorage
                navigate('/');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Redirect to login regardless of error
            navigate('/');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Updated array object sidebar to match your actual routes:
    const sidebarItems = [
        {
            path: '/lecturer/dashboard',
            name: 'MyStudents',
            icon: myStudentsIcon,
            end: true,
        },
        {
            path: '/lecturer/course-advisor',
            name: 'MyCourseAdvisor',
            icon: myCourseAdvisorIcon,
        },
        {
            path: '/lecturer/my-report',
            name: 'MyReport',
            icon: myReportIcon,
        },
    ];

    return (
        <aside className="h-screen sticky top-0 flex-shrink-0">
            <nav className="h-full flex flex-col bg-[#951A22] border-r border-[#FAF0E6] shadow-sm">
                {/* Header dari sidebar (Logo dan Tombol Toggle Sidebar) */}
                <div className="p-4 pb-2 flex justify-between items-center">
                    <span
                        className={`font-bold text-lg text-white overflow-hidden transition-all ${
                            expanded ? 'w-40' : 'w-0'
                        }`}>
                        MITIGASI
                    </span>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        aria-label="Toggle Sidebar"
                        className="p-1.5 rounded-lg bg-transparent hover:bg-white/20 transition-all duration-300">
                        <img
                            src={toggleSidebarIcon}
                            alt="Toggle Sidebar Button"
                            className="w-5 h-5 fill-white transition-transform duration-300"
                        />
                    </button>
                </div>

                {/* Isi dari sidebar (Menu-menu fitur) */}
                <ul className="flex-1 px-3 space-y-4 mt-4">
                    {sidebarItems.map((item) => (
                        <li key={item.path} className="relative">
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => {
                                    return isActive
                                        ? `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 text-white group bg-white/20 shadow-md`
                                        : `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 text-white group hover:bg-white/20`;
                                }}>
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-5 h-5 fill-white"
                                />
                                <span
                                    className={`overflow-hidden transition-all text-sm ${
                                        expanded ? 'w-40 ml-3' : 'w-0'
                                    }`}>
                                    {item.name}
                                </span>
                                {!expanded && (
                                    <div
                                        className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-white text-[#951A22] text-sm invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black/10`}>
                                        {item.name}
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Footer Profil User */}
                <div className="border-t border-black/20 bg-black/20 flex p-3">
                    <img
                        src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
                        alt="User Profile Picture"
                        className="w-10 h-10 rounded-sm"
                    />
                    <div
                        className={`flex justify-between items-center overflow-hidden transition-all ${
                            expanded ? 'w-40 ml-3' : 'w-0'
                        }`}>
                        <div className="leading-4">
                            <span className="block font-bold text-white text-xs">
                                Dr. Jane Smith
                            </span>
                            <span className="block text-[0.65em] text-white">
                                janesmith@faculty.edu
                            </span>
                        </div>
                        {/* Updated logout button with onClick handler */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-white no-underline flex items-center hover:opacity-80">
                            <img
                                src={logoutIcon}
                                alt="Logout"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default SidebarDosenWali;
