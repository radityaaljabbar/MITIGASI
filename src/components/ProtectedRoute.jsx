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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // If wrong user type, redirect to appropriate dashboard
  if (user.type !== requiredType) {
    return <Navigate to={`/${user.type === 'students' ? 'student' : 'lecturer'}/dashboard`} />;
  }

  // Otherwise, render the protected content
  return children;
};

export default ProtectedRoute;