import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Komponen halaman dashboard untuk dosen. (Saat ini terlihat sebagai contoh/placeholder)
 * Dashboard page component for lecturers. (Currently appears to be an example/placeholder)
 */
const LecturerDashboard = () => {
  // State untuk menyimpan data pengguna yang login
  // State to store the logged-in user's data
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Effect untuk mengambil data pengguna dari localStorage saat komponen dimuat
  // Effect to get user data from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * Menangani proses logout.
   * Handles the logout process.
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Jika tidak ada data pengguna, jangan render apapun (mencegah error)
  // If there's no user data, render nothing (prevents errors)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Halaman */}
      {/* Page Header */}
      <header className="bg-red-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Academic Portal</h1>
          
          <div className="flex items-center mt-3 md:mt-0">
            <span className="mr-4">Welcome, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigasi Utama */}
      {/* Main Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-3 space-x-6">
            <Link to="/lecturer/dashboard" className="text-red-700 font-medium whitespace-nowrap">Dashboard</Link>
            <Link to="/lecturer/advisees" className="text-gray-600 hover:text-red-700 whitespace-nowrap">Advisees</Link>
            <Link to="/lecturer/schedule" className="text-gray-600 hover:text-red-700 whitespace-nowrap">Schedule</Link>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Advisor Dashboard</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Jadwal Mengajar */}
          {/* Teaching Schedule Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Today's Classes</h3>
            <ul className="space-y-3">
              <li className="border-b pb-2">
                <p className="font-medium">Advanced Database Systems</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Room 405</span>
                  <span>10:00 - 11:30</span>
                </div>
              </li>
              <li>
                <p className="font-medium">Research Methods</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Room 301</span>
                  <span>14:00 - 15:30</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Card Peringatan Mahasiswa Bimbingan */}
          {/* Advisee Alerts Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Advisee Alerts</h3>
            <div className="space-y-3">
              <div className="p-2 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-medium">John Doe (2023001)</p>
                <p className="text-sm text-gray-600">At risk: 2 courses below passing grade</p>
              </div>
              <div className="p-2 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-medium">Jane Smith (2023002)</p>
                <p className="text-sm text-gray-600">Missed 3 consecutive classes</p>
              </div>
            </div>
          </div>
          
          {/* Card Profil Dosen */}
          {/* Advisor Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">My Profile</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">NIP:</span>
                <span>{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span>Computer Science</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advisees:</span>
                <span>12 Students</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;