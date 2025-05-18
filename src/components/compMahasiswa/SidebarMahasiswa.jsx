import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, fetchCurrentUser } from '../../services/authService';

// Import icon-icon yang diperlukan
import toggleSidebarIcon from '../../assets/images/imageMahasiswa/sidebarImage/toggleSidebar.png';
import myProgressIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyProgress.png';
import myCourseIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyCourse.png';
import myWellnessIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyWellness.png';
import myFinanceIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyFinance.png';
import myFeedbackIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyFeedback.png';
import logoutIcon from '../../assets/images/imageMahasiswa/sidebarImage/LogoutIcon.png';
import logoMITIGASI from '../../assets/images/logoMITIGASI.png';

const Sidebar = ({ expanded, setExpanded }) => {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        nim: '',
        class: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data on component mount
    useEffect(() => {
        const getUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetchCurrentUser();

                if (response.success) {
                    setUserData({
                        name: response.data.name || '',
                        nim: response.data.id || '',
                        class: response.data.class || '',
                    });
                } else {
                    console.error(
                        'Failed to fetch user data:',
                        response.message
                    );
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserData();
    }, []);

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

    // Bikin array object sidebar agar mempersingkat kode:
    const sidebarItems = [
        {
            path: '/student',
            name: 'MyProgress',
            icon: myProgressIcon,
            end: true,
        },
        { path: '/student/my-course', name: 'MyCourse', icon: myCourseIcon },
        {
            path: '/student/my-wellness',
            name: 'MyWellness',
            icon: myWellnessIcon,
        },
        { path: '/student/my-finance', name: 'MyFinance', icon: myFinanceIcon },
        {
            path: '/student/my-feedback',
            name: 'MyFeedback',
            icon: myFeedbackIcon,
        },
    ];

    return (
        <aside className="h-screen sticky top-0 flex-shrink-0">
            <nav className="h-full flex flex-col bg-[#951A22] border-r border-[#FAF0E6] shadow-sm transition-all duration-300 ease-in-out">
                {/* Header dari sidebar (Logo dan Tombol Toggle Sidebar) */}
                <div
                    className={`p-4 pb-2 flex justify-between items-center border-b border-white/10 transition-all duration-300 ease-in-out ${
                        expanded ? 'gap-4' : ''
                    }`}>
                    <span
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expanded ? 'w-40 opacity-100' : 'w-0 opacity-0'
                        }`}>
                        {expanded && (
                            <div className="bg-white rounded-lg p-2 w-full h-24 flex items-center justify-center">
                                <img
                                    src={logoMITIGASI}
                                    alt="MITIGASI Logo"
                                    className="max-h-20 max-w-[90%] object-contain"
                                />
                            </div>
                        )}
                    </span>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        aria-label="Toggle Sidebar"
                        className={`p-1.5 rounded-lg bg-transparent hover:bg-white/20 transition-all duration-300 ease-in-out ${
                            expanded ? '' : 'ml-auto mr-auto'
                        }`}>
                        <img
                            src={toggleSidebarIcon}
                            alt="Toggle Sidebar Button"
                            className="w-5 h-5 fill-white transition-transform duration-300 ease-in-out"
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
                                className={({ isActive }) =>
                                    isActive
                                        ? `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:translate-x-1 text-white group bg-white/20 shadow-md`
                                        : `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:translate-x-1 text-white group hover:bg-white/20`
                                }>
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-5 h-5 fill-white"
                                />
                                <span
                                    className={`overflow-hidden transition-all duration-300 ease-in-out text-sm ${
                                        expanded
                                            ? 'opacity-100 max-w-40 ml-3'
                                            : 'opacity-0 max-w-0'
                                    }`}>
                                    {item.name}
                                </span>

                                {/* Nampilin nama menu ketika sidebar tertutup dan mouse di hover */}
                                {!expanded && (
                                    <div
                                        className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-white text-[#951A22] text-sm invisible opacity-0 -translate-x-3 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black/10`}>
                                        {item.name}
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Footer Profil User */}
                <div className="border-t border-black/20 bg-black/20 p-3">
                    <div
                        className={`flex ${
                            expanded ? 'justify-between' : 'justify-center'
                        } items-center w-full`}>
                        {expanded && (
                            <div className="flex-grow overflow-hidden mr-2 transition-opacity duration-300 ease-in-out">
                                {isLoading ? (
                                    <div className="leading-4">
                                        <span className="block font-bold text-white text-xs">
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    <div className="leading-4">
                                        <span className="block font-bold text-white text-xs truncate">
                                            {userData.name}
                                        </span>
                                        <span className="block text-[0.65em] text-white truncate">
                                            {userData.nim}
                                        </span>
                                        <span className="block text-[0.65em] text-white truncate">
                                            {userData.class}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Updated logout button with fixed alignment */}
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-white no-underline flex items-center justify-center hover:opacity-80 transition-all duration-300 ease-in-out"
                            title="Logout">
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

export default Sidebar;
