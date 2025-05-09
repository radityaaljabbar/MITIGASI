import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { getFeedbackList } from '../../../services/dosenWali/myReport/listFeedbackMahasiswaService';

const StudentListView = ({ onViewDetail }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKelas, setFilterKelas] = useState('');

    // Fetch data dri API (dri file service)
    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const response = await getFeedbackList();

                if (response.success) {
                    setStudents(response.data);
                } else {
                    setError(
                        response.message ||
                            'Failed to fetch student feedback data'
                    );
                }
            } catch (error) {
                setError('An error occured while fetching the data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    // Filter mahasiswa berdasarkan search sama kelas
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.nim.includes(searchTerm) ||
            student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = !filterKelas || student.kelas === filterKelas;

        return matchesSearch && matchesFilter;
    });

    // Ekstrak value class untuk dropdown filter
    const uniqueClasses = [
        ...new Set(students.map((student) => student.kelas)),
    ];

    // State loading
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // State error
    if (error) {
        return (
            <div className="bg-white rounded-xl shadow p-4 md:p-6">
                <div className="text-center p-4 text-red-600">
                    <p className="font-medium">Error: {error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => window.location.reload()}>
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search
                        size={18}
                        className="absolute left-3 top-2.5 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Cari mahasiswa, NIM, kelas atau deskripsi..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            className="pl-3 pr-8 py-2 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
                            value={filterKelas}
                            onChange={(e) => setFilterKelas(e.target.value)}>
                            <option value="">Semua Kelas</option>
                            {uniqueClasses.map((kelas) => (
                                <option key={kelas} value={kelas}>
                                    {kelas}
                                </option>
                            ))}
                        </select>
                        <Filter
                            size={16}
                            className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                    <thead className="bg-neutral-100">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold">
                                #
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                Nama
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                NIM
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                Kelas
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                Deskripsi
                            </th>
                            <th className="text-left px-4 py-3 font-semibold">
                                Tanggal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, idx) => (
                                <tr
                                    key={student.feedbackId}
                                    className="hover:bg-blue-50 cursor-pointer border-t transition-colors"
                                    onClick={() => onViewDetail(student)}>
                                    <td className="px-4 py-3 font-medium">
                                        {idx + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.name}
                                    </td>
                                    <td className="px-4 py-3">{student.nim}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                                            {student.kelas}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                        {student.title}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {student.feedbackDate}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-4 py-6 text-center text-gray-500">
                                    Tidak ada data yang ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Total: {filteredStudents.length} mahasiswa
            </div>
        </div>
    );
};

export default StudentListView;
