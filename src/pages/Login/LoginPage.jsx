import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const Login = () => {
    const [isStudentLogin, setIsStudentLogin] = useState(true);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Determine the role based on login type
        const role = isStudentLogin ? 'mahasiswa' : 'dosen_wali';

        try {
            // Call the API login endpoint
            const response = await loginUser(id, password, role);

            if (response.success) {
                // Store user info and token in localStorage
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        id: response.user.id,
                        name: response.user.name,
                        type: isStudentLogin ? 'students' : 'lecturers',
                        token: response.token,
                        role: response.user.role,
                    })
                );

                // Navigate to appropriate dashboard
                navigate(isStudentLogin ? '/student' : '/lecturer');
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

    const handleRoleSwitch = (isStudent) => {
        setIsStudentLogin(isStudent);
        setId(''); // Clear form when switching
        setPassword('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl">
                {/* Header with Logo and Title */}
                <div className="bg-gradient-to-r from-red-800 to-red-600 text-white py-4 px-5 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1">
                            <img
                                src="/src/assets/images/FIX_LOGO.png"
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
                    {/* Role Selection Tabs */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                            Pilih Jenis Login
                        </h2>

                        <div className="flex bg-gray-100 rounded-xl p-2 mb-6">
                            <button
                                onClick={() => handleRoleSwitch(true)}
                                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                    isStudentLogin
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

                            <button
                                onClick={() => handleRoleSwitch(false)}
                                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                                    !isStudentLogin
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
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="max-w-md mx-auto">
                        <div
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                                isStudentLogin
                                    ? 'border-blue-200 bg-blue-50'
                                    : 'border-red-200 bg-red-50'
                            }`}>
                            <div className="text-center mb-6">
                                <div
                                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                                        isStudentLogin
                                            ? 'bg-blue-500'
                                            : 'bg-red-500'
                                    }`}>
                                    {isStudentLogin ? (
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 7C14.8 7 17 9.2 17 12V15H19V17H5V15H7V12C7 9.2 9.2 7 12 7Z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M15 4L20 9V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V9L9 4H15Z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Login{' '}
                                    {isStudentLogin
                                        ? 'Mahasiswa'
                                        : 'Dosen Wali'}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {isStudentLogin
                                        ? 'Masukkan NIM dan password Anda'
                                        : 'Masukkan NIP dan password Anda'}
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
                                        placeholder={
                                            isStudentLogin
                                                ? 'Masukkan NIM'
                                                : 'Masukkan NIP'
                                        }
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : isStudentLogin
                                            ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
                                            : 'bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95'
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

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                <p className="font-medium mb-2">
                                    Butuh bantuan?
                                </p>
                                <p>
                                    {isStudentLogin
                                        ? 'Gunakan NIM yang terdaftar di sistem akademik'
                                        : 'Gunakan NIP yang terdaftar sebagai dosen wali'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
