import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser, fetchCurrentUser } from '../../services/authService';

// Import ikon-ikon yang diperlukan untuk menu dan fungsionalitas sidebar
// Import icons needed for the sidebar menu and functionality
import toggleSidebarIcon from '../../assets/images/imageDosenWali/sidebarImages/toggleSidebar.png';
import logoutIcon from '../../assets/images/imageDosenWali/sidebarImages/LogoutIcon.png';
import myStudentsIcon from '../../assets/images/imageDosenWali/sidebarImages/MyStudentsIcon.png';
import myCourseAdvisorIcon from '../../assets/images/imageDosenWali/sidebarImages/MyCourseAdvisorIcon.png';
import myReportIcon from '../../assets/images/imageDosenWali/sidebarImages/MyReportIcon.png';
import logoMITIGASI from '../../assets/images/logoMITIGASI.png';

/**
 * Komponen Sidebar untuk antarmuka Dosen Wali.
 * Sidebar component for the Course Advisor (Dosen Wali) interface.
 * @param {object} props - Props komponen.
 * @param {boolean} props.expanded - Status apakah sidebar diperluas.
 * @param {function} props.setExpanded - Fungsi untuk mengubah status `expanded`.
 */
const SidebarDosenWali = ({ expanded, setExpanded }) => {
    const navigate = useNavigate();
    // State untuk mengelola status proses logout dan data pengguna
    // State to manage logout process status and user data
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        nip: '',
        code: '',
    });
    // State untuk loading saat mengambil data pengguna
    // State for loading while fetching user data
    const [isLoading, setIsLoading] = useState(true);

    // Mengambil data pengguna yang sedang login saat komponen dimuat
    // Fetch current logged-in user data on component mount
    useEffect(() => {
        const getUserData = async () => {
            try {
                setIsLoading(true);
                const response = await fetchCurrentUser();

                if (response.success) {
                    setUserData({
                        name: response.data.name || '',
                        nip: response.data.id || '',
                        code: response.data.code || '',
                    });
                } else {
                    console.error(
                        'Failed to fetch lecturer data:',
                        response.message
                    );
                }
            } catch (error) {
                console.error('Error fetching lecturer data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserData();
    }, []);

    /**
     * Menangani fungsi logout pengguna.
     * Handles the user logout function.
     * @param {React.MouseEvent} e - Event klik.
     */
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

    // Daftar item menu untuk sidebar dosen wali, disesuaikan dengan rute aplikasi
    // List of menu items for the course advisor sidebar, matching the application routes
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
            <nav className="h-full flex flex-col bg-[#951A22] border-r border-[#FAF0E6] shadow-sm transition-all duration-300 ease-in-out">
                {/* Header sidebar: Logo dan tombol toggle */}
                {/* Sidebar header: Logo and toggle button */}
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

                {/* Daftar menu navigasi */}
                {/* Navigation menu list */}
                <ul className="flex-1 px-3 space-y-4 mt-4">
                    {sidebarItems.map((item) => (
                        <li key={item.path} className="relative">
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => {
                                    // Beri style berbeda jika link sedang aktif
                                    // Apply a different style if the link is active
                                    return isActive
                                        ? `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:translate-x-1 text-white group bg-white/20 shadow-md`
                                        : `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:translate-x-1 text-white group hover:bg-white/20`;
                                }}>
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

                {/* Footer sidebar: Profil pengguna dan tombol logout */}
                {/* Sidebar footer: User profile and logout button */}
                <div className="border-t border-black/20 bg-black/20 p-3">
                    <div
                        className={`flex ${
                            expanded ? 'justify-between' : 'justify-center'
                        } items-center w-full`}>
                        {expanded && (
                            <div className="flex-grow overflow-hidden mr-2 transition-opacity duration-300 ease-in-out">
                                {isLoading ? (
                                    // Tampilan saat data profil sedang dimuat
                                    // Display when profile data is loading
                                    <div className="leading-4">
                                        <span className="block font-bold text-white text-xs">
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    // Tampilan data profil setelah dimuat
                                    // Display profile data after loading
                                    <div className="leading-4">
                                        <span className="block font-bold text-white text-xs truncate">
                                            {userData.name}
                                        </span>
                                        <span className="block text-[0.65em] text-white truncate">
                                            NIP: {userData.nip}
                                        </span>
                                        <span className="block text-[0.65em] text-white truncate">
                                            Kode: {userData.code}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tombol Logout */}
                        {/* Logout button */}
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

export default SidebarDosenWali;
