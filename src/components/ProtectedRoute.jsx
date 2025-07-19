import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredType }) => {
    // State untuk menyimpan data pengguna dan status loading
    // State to store user data and loading status
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Efek ini berjalan sekali saat komponen dimuat untuk memeriksa status otentikasi
    // This effect runs once on component mount to check the authentication status
    useEffect(() => {
        // Mengambil data pengguna dari localStorage
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Selesai memeriksa, set loading menjadi false
        // Finished checking, set loading to false
        setLoading(false);
    }, []);

    // Selama proses pengecekan, tampilkan indikator loading
    // While checking, display a loading indicator
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            </div>
        );
    }

    // Jika tidak ada pengguna atau token, alihkan ke halaman login
    // If there is no user or token, redirect to the login page
    if (!user || !user.token) {
        return <Navigate to="/" />;
    }

    // Jika tipe pengguna tidak sesuai dengan yang dibutuhkan, alihkan ke dashboard yang sesuai
    // If the user type does not match the required type, redirect to the appropriate dashboard
    if (user.type !== requiredType) {
        // Logika pengalihan berdasarkan tipe pengguna
        // Redirect logic based on user type
        let redirectPath = '/';
        if (user.type === 'students') {
            redirectPath = '/student';
        } else if (user.type === 'lecturers') {
            redirectPath = '/lecturer';
        } else if (user.type === 'admin') {
            redirectPath = '/admin';
        }

        return <Navigate to={redirectPath} />;
    }

    // Jika semua pengecekan berhasil, render komponen anak (konten yang dilindungi)
    // If all checks pass, render the children component (the protected content)
    return children;
};

export default ProtectedRoute;