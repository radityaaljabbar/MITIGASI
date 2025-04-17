import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import students from '../../assets/data/mockupjsonMahasiswa/dataStudent.json'
import lecturers from '../../assets/data/mockupjsonDosenWali/dataLecturer.json'

const Login = () => {
    const [isStudentLogin, setIsStudentLogin] = useState(true);
    const [nim, setNim] = useState('');
    const [nip, setNip] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Simulated user data (in a real app, this would come from a backend)
    const users = {
        students,
        lecturers
        // students: {
        //     1: { password: '2', name: 'John Doe' },
        //     2023002: { password: 'mahasiswa456', name: 'Jane Smith' },
        // },
        // lecturers: {
        //     2: { password: '3', name: 'Dr. Ahmad' },
        //     198602022021: { password: 'dosen456', name: 'Dr. Siti' },
        // },
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const userType = isStudentLogin ? 'students' : 'lecturers';
        const loginId = isStudentLogin ? nim : nip;

        const user = users[userType][loginId];

        if (user && user.password === password) {
            // Store user session
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: loginId,
                    name: user.name,
                    type: userType,
                })
            );

            // Navigate to appropriate dashboard
            if (isStudentLogin) {
                navigate('/student');
            } else {
                navigate('/lecturer');
            }
        } else {
            alert('Invalid credentials');
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

                        <div className="space-y-4">
                            {isStudentLogin ? (
                                <input
                                    type="text"
                                    placeholder="NIM"
                                    value={nim}
                                    onChange={(e) => setNim(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            ) : (
                                <input
                                    type="text"
                                    placeholder="NIP"
                                    value={nip}
                                    onChange={(e) => setNip(e.target.value)}
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
                            className="w-full bg-red-700 text-white py-3 rounded-full hover:bg-red-800 transition">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
