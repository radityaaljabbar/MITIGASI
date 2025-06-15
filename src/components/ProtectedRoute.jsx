import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredType }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
            </div>
        );
    }

    // If not logged in, redirect to login
    if (!user || !user.token) {
        return <Navigate to="/" />;
    }

    // If wrong user type, redirect to appropriate dashboard
    if (user.type !== requiredType) {
        // Redirect based on user type
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

    // Otherwise, render the protected content
    return children;
};

export default ProtectedRoute;
