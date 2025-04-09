import React from 'react';
import { NavLink } from 'react-router-dom';

//Import icon-icon yang diperlukan
import toggleSidebarIcon from '../../assets/images/imageMahasiswa/sidebarImage/toggleSidebar.png';
import myProgressIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyProgress.png';
import myCourseIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyCourse.png';
import myWellnessIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyWellness.png';
import myFinanceIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyFinance.png';
import myFeedbackIcon from '../../assets/images/imageMahasiswa/sidebarImage/MyFeedback.png';
import settingsIcon from '../../assets/images/imageMahasiswa/sidebarImage/SettingsIcon.png';

const Sidebar = ({ expanded, setExpanded }) => {
    //Bikin array object sidebar agar mempersingkat kode:
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
                                className={({ isActive }) =>
                                    isActive
                                        ? `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 text-white group bg-white/20 shadow-md`
                                        : `relative flex items-center py-2 px-3 font-medium rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 text-white group hover:bg-white/20`
                                }>
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

                                {/* Nampilin nama menu ketika sidebar tertutup dan mouse di hover */}
                                {!expanded && (
                                    <div
                                        className={`absolute left-full rounded-md px-2 py-1 ml-6 bgwhite text-[#951A22] text-sm invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-black/10`}>
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
                        className="w-10 h-10 rounded-sm" //Nambah expanded belum
                    />
                    <div
                        className={`flex justify-between items-center overflow-hidden transition-all ${
                            expanded ? 'w-40 ml-3' : 'w-0'
                        }`}>
                        <div className="leading-4">
                            <span className="block font-bold text-white text-xs">
                                John Doe
                            </span>
                            <span className="block text-[0.65em] text-white">
                                johndoe@gmail.com
                            </span>
                        </div>
                        <NavLink
                            to="/system-settings"
                            className="text-white no-underline flex items-center hover:opacity-80">
                            <img
                                src={settingsIcon}
                                alt="Settings Icon"
                                className="w-5 h-5"
                            />
                        </NavLink>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
