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

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl grid md:grid-cols-2">
                {/* Left Panel */}
                <div className="bg-gradient-to-br from-red-800 to-red-600 text-white p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">
                        {isStudentLogin
                            ? 'Mahasiswa Login'
                            : 'Dosen Wali Login'}
                    </h2>
                    <p className="mb-6">
                        {isStudentLogin
                            ? 'Akses portal akademik dan jadwal perkuliahan Anda'
                            : 'Kelola informasi mahasiswa perwalian Anda'}
                    </p>
                    <button
                        onClick={() => setIsStudentLogin(!isStudentLogin)}
                        className="border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-red-700 transition">
                        {isStudentLogin ? 'Dosen Wali' : 'Mahasiswa'}
                    </button>
                </div>

                {/* Right Panel - Login Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-semibold text-gray-700">
                                {isStudentLogin
                                    ? 'Mahasiswa Login'
                                    : 'Dosen Wali Login'}
                            </h3>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {isStudentLogin ? (
                                <input
                                    type="text"
                                    placeholder="NIM"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder="NIP"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            )}

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-700 text-white py-3 rounded-full hover:bg-red-800 transition disabled:bg-red-300">
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
