import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import logoMitigasi from '/src/assets/images/FIX_LOGO.png';

/**
 * Komponen untuk halaman login multi-peran (Mahasiswa, Dosen Wali, Admin).
 * Component for the multi-role login page (Student, Course Advisor, Admin).
 */
const Login = () => {
    // State untuk peran yang dipilih, ID, password, status loading, dan pesan error
    // State for the selected role, ID, password, loading status, and error message
    const [selectedRole, setSelectedRole] = useState('mahasiswa'); // Changed from isStudentLogin
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    /**
     * Menangani proses submit form login.
     * Handles the login form submission process.
     * @param {React.FormEvent} e - Event form.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Memanggil layanan API untuk login
            // Calling the API service for login
            const response = await loginUser(id, password, selectedRole);

            if (response.success) {
                // Menentukan tipe pengguna untuk routing di frontend
                // Determining the user type for frontend routing
                let userType;
                if (selectedRole === 'mahasiswa') {
                    userType = 'students';
                } else if (selectedRole === 'dosen_wali') {
                    userType = 'lecturers';
                } else if (selectedRole === 'admin') {
                    userType = 'admin';
                }

                // Menyimpan informasi pengguna dan token di localStorage
                // Storing user info and token in localStorage
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        id: response.user.id,
                        name: response.user.name,
                        type: userType,
                        token: response.token,
                        role: response.user.role,
                    })
                );

                // Navigasi ke dashboard yang sesuai
                // Navigate to the appropriate dashboard
                if (selectedRole === 'mahasiswa') {
                    navigate('/student');
                } else if (selectedRole === 'dosen_wali') {
                    navigate('/lecturer');
                } else if (selectedRole === 'admin') {
                    navigate('/admin');
                }
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Menangani perpindahan antar peran (role).
     * Handles switching between roles.
     * @param {string} role - Peran yang dipilih ('mahasiswa', 'dosen_wali', 'admin').
     */
    const handleRoleSwitch = (role) => {
        setSelectedRole(role);
        setId(''); // Clear form when switching
        setPassword('');
        setError('');
    };

    /**
     * Mendapatkan konfigurasi UI (judul, warna, placeholder) berdasarkan peran yang dipilih.
     * Gets UI configuration (title, color, placeholder) based on the selected role.
     * @returns {object} - Objek konfigurasi.
     */
    const getRoleConfig = () => {
        switch (selectedRole) {
            case 'mahasiswa':
                return {
                    title: 'Mahasiswa',
                    subtitle: 'Login dengan NIM',
                    placeholder: 'Masukkan NIM',
                    helpText: 'Gunakan NIM yang terdaftar di sistem akademik',
                    color: 'blue',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    buttonColor: 'bg-blue-500 hover:bg-blue-600',
                };
            case 'dosen_wali':
                return {
                    title: 'Dosen Wali',
                    subtitle: 'Login dengan NIP',
                    placeholder: 'Masukkan NIP',
                    helpText: 'Gunakan NIP yang terdaftar sebagai dosen wali',
                    color: 'red',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    buttonColor: 'bg-red-500 hover:bg-red-600',
                };
            case 'admin':
                return {
                    title: 'Administrator',
                    subtitle: 'Login dengan Username',
                    placeholder: 'Masukkan Username',
                    helpText: 'Gunakan username administrator yang terdaftar',
                    color: 'green',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    buttonColor: 'bg-green-500 hover:bg-green-600',
                };
            default:
                return {};
        }
    };

    const roleConfig = getRoleConfig();

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl">
                {/* Header dengan Logo dan Judul */}
                {/* Header with Logo and Title */}
                <div className="bg-gradient-to-r from-red-800 to-red-600 text-white py-4 px-5 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1">
                            <img
                                src={logoMitigasi}
                                alt="Logo MITIGASI"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold leading-tight">
                                MITIGASI
                            </h1>
                            <p className="text-red-100 text-sm">
                                Mitigasi Akademik Terintegrasi
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Tab Pemilihan Peran */}
                    {/* Role Selection Tabs */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                            Pilih Jenis Login
                        </h2>

                        <div className="flex bg-gray-100 rounded-xl p-2 mb-6">
                            {/* Mahasiswa Tab */}
                            <button
                                onClick={() => handleRoleSwitch('mahasiswa')}
                                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                    selectedRole === 'mahasiswa'
                                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                                        : 'text-gray-600 hover:text-blue-500'
                                }`}>
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5C13.1 2.9 13.1 3.4 13.5 3.8L18.2 8.5C18.6 8.9 19.1 8.9 19.5 8.5L21 7V9H21ZM12 7C14.8 7 17 9.2 17 12V15H19V17H5V15H7V12C7 9.2 9.2 7 12 7Z" />
                                    </svg>
                                    <div>
                                        <div className="text-lg">Mahasiswa</div>
                                        <div className="text-sm opacity-75">
                                            Login dengan NIM
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* Dosen Wali Tab */}
                            <button
                                onClick={() => handleRoleSwitch('dosen_wali')}
                                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                    selectedRole === 'dosen_wali'
                                        ? 'bg-red-500 text-white shadow-lg transform scale-105'
                                        : 'text-gray-600 hover:text-red-500'
                                }`}>
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5C13.1 2.9 13.1 3.4 13.5 3.8L18.2 8.5C18.6 8.9 19.1 8.9 19.5 8.5L21 7V9H21ZM15 4L20 9V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V9L9 4H15Z" />
                                    </svg>
                                    <div>
                                        <div className="text-lg">
                                            Dosen Wali
                                        </div>
                                        <div className="text-sm opacity-75">
                                            Login dengan NIP
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* Admin Tab */}
                            <button
                                onClick={() => handleRoleSwitch('admin')}
                                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                    selectedRole === 'admin'
                                        ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                        : 'text-gray-600 hover:text-green-500'
                                }`}>
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.71,4.29C19.19,5.79 20,7.79 20,10C20,12.21 19.19,14.21 17.71,15.71C16.21,17.19 14.21,18 12,18C9.79,18 7.79,17.19 6.29,15.71C4.81,14.21 4,12.21 4,10C4,7.79 4.81,5.79 6.29,4.29C7.79,2.81 9.79,2 12,2M12,20A2,2 0 0,1 14,22H10A2,2 0 0,1 12,20Z" />
                                    </svg>
                                    <div>
                                        <div className="text-lg">Admin</div>
                                        <div className="text-sm opacity-75">
                                            Administrator
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Form Login */}
                    {/* Login Form */}
                    <div className="max-w-md mx-auto">
                        <div
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${roleConfig.bgColor} ${roleConfig.borderColor}`}>
                            <div className="text-center mb-6">
                                <div
                                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                                        selectedRole === 'mahasiswa'
                                            ? 'bg-blue-500'
                                            : selectedRole === 'dosen_wali'
                                            ? 'bg-red-500'
                                            : 'bg-green-500'
                                    }`}>
                                    {selectedRole === 'mahasiswa' ? (
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 7C14.8 7 17 9.2 17 12V15H19V17H5V15H7V12C7 9.2 9.2 7 12 7Z" />
                                        </svg>
                                    ) : selectedRole === 'dosen_wali' ? (
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M15 4L20 9V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V9L9 4H15Z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.71,4.29C19.19,5.79 20,7.79 20,10C20,12.21 19.19,14.21 17.71,15.71C16.21,17.19 14.21,18 12,18C9.79,18 7.79,17.19 6.29,15.71C4.81,14.21 4,12.21 4,10C4,7.79 4.81,5.79 6.29,4.29C7.79,2.81 9.79,2 12,2M12,20A2,2 0 0,1 14,22H10A2,2 0 0,1 12,20Z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Login {roleConfig.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {roleConfig.subtitle}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
                                        </svg>
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 7C14.8 7 17 9.2 17 12V15H19V17H5V15H7V12C7 9.2 9.2 7 12 7Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={roleConfig.placeholder}
                                        value={id}
                                        onChange={(e) => setId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Masukkan Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                
                                {/* Tombol Login dengan status loading */}
                                {/* Login Button with loading state */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : `${roleConfig.buttonColor} hover:scale-105 active:scale-95`
                                    } shadow-lg`}>
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Memproses...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 24 24">
                                                <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
                                            </svg>
                                            Masuk
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Teks Bantuan */}
                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">

                                <p>{roleConfig.helpText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
