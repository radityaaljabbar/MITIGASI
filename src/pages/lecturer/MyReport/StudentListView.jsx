import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * Komponen untuk menampilkan daftar feedback mahasiswa.
 * Dilengkapi dengan fitur pencarian dan filter berdasarkan kelas.
 * Component to display a list of student feedback.
 * Includes search and class-based filtering features.
 * @param {object} props - Props komponen.
 * @param {function} props.onViewDetail - Callback saat baris mahasiswa diklik.
 * @param {Array} props.students - Array data feedback mahasiswa.
 */
const StudentListView = ({ onViewDetail, students = [] }) => {
    // State untuk menyimpan nilai input pencarian.
    // State to store the value of the search input.
    const [searchTerm, setSearchTerm] = useState('');
    // State untuk menyimpan nilai filter kelas.
    // State to store the value of the class filter.
    const [filterKelas, setFilterKelas] = useState('');

    // Logika untuk memfilter mahasiswa berdasarkan pencarian dan kelas.
    // Logic to filter students based on search and class.
    const filteredStudents = students.filter((student) => {
        // Pengecekan null untuk setiap properti untuk menghindari error.
        // Null checks for each property to avoid errors.
        const name = student?.name || '';
        const nim = student?.nim || '';
        const kelas = student?.kelas || '';
        const title = student?.title || '';

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nim.includes(searchTerm) ||
            kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
            title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = !filterKelas || kelas === filterKelas;

        return matchesSearch && matchesFilter;
    });

    // Mengekstrak daftar kelas unik untuk opsi dropdown filter.
    // Extracting a unique list of classes for the filter dropdown options.
    const uniqueClasses = [
        ...new Set(
            students
                .filter((student) => student?.kelas)
                .map((student) => student.kelas)
        ),
    ];

    return (
        <div className="bg-white rounded-xl shadow p-4 md:p-6 transition-all duration-300 hover:shadow-lg">
            {/* Bagian kontrol filter dan pencarian */}
            {/* Filter and search controls section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Input pencarian */}
                {/* Search input */}
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

                {/* Dropdown filter kelas */}
                {/* Class filter dropdown */}
                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            className="pl-3 pr-8 py-2 border border-gray-300 rounded-xl appearance-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none transition-all"
                            value={filterKelas}
                            onChange={(e) => setFilterKelas(e.target.value)}>
                            <option value="">Semua Kelas</option>
                            {uniqueClasses.map((kelas, index) => (
                                <option
                                    key={`class-${index}-${kelas}`}
                                    value={kelas}>
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

            {/* Tabel daftar feedback */}
            {/* Feedback list table */}
            <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                    <thead className="bg-[#951A22] text-white">
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
                            <th className="text-left px-4 py-3 font-semibold">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, idx) => (
                                <tr
                                    key={`feedback-${
                                        student.feedbackId || idx
                                    }`}
                                    className="hover:bg-blue-50 cursor-pointer border-t transition-colors"
                                    onClick={() => onViewDetail(student)}>
                                    <td className="px-4 py-3 font-medium">
                                        {idx + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.nim || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {student.kelas ? (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                                                {student.kelas}
                                            </span>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                        {student.title || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {student.feedbackDate || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                student.status ===
                                                'Sudah Direspon'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {student.status ||
                                                'Menunggu Respon'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Tampilan jika tidak ada data yang cocok dengan filter
                            // View if no data matches the filter
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-6 text-center text-gray-500">
                                    Tidak ada data yang ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Menampilkan total hasil filter */}
            {/* Displaying the total number of filtered results */}
            <div className="mt-4 text-sm text-gray-500">
                Total: {filteredStudents.length} mahasiswa
            </div>
        </div>
    );
};

export default StudentListView;
