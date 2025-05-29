import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Info,
    ChevronDown,
    Search,
    Filter,
    User,
    ChevronUp,
    ArrowUpDown,
} from 'lucide-react';
import { getListMahasiswa } from '../../../services/dosenWali/myStudent/listMahasiswaService';

export default function DaftarMahasiswaWali() {
    const [selectedClass, setSelectedClass] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetail, setShowDetail] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classOptions, setClassOptions] = useState([]);

    // New state for sorting
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });

    const navigate = useNavigate();

    // Fetch data from backend when component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await getListMahasiswa();
                if (response.success) {
                    setStudents(response.data);

                    // Extract unique class options from the data
                    const uniqueClasses = [
                        ...new Set(
                            response.data.map((student) => student.kelas)
                        ),
                    ];
                    setClassOptions(uniqueClasses);
                } else {
                    setError(response.message || 'Failed to fetch data');
                }
            } catch (error) {
                setError('Error connecting to the server');
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Sorting function
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sort icon
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="h-4 w-4 ml-1 text-white" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUp className="h-4 w-4 ml-1 text-white" />
        ) : (
            <ChevronDown className="h-4 w-4 ml-1 text-white" />
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Aman':
                return 'bg-green-100';
            case 'Siaga':
                return 'bg-yellow-100';
            case 'Bermasalah':
                return 'bg-red-100';
            default:
                return 'bg-white';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'Aman':
                return 'bg-green-500';
            case 'Siaga':
                return 'bg-yellow-500';
            case 'Bermasalah':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleRowClick = (nim) => {
        navigate(`/lecturer/detailMahasiswa/${nim}`);
    };

    // Enhanced filtering and sorting
    const filteredAndSortedStudents = students
        .filter(
            (student) =>
                selectedClass === 'all' || student.kelas === selectedClass
        )
        .filter(
            (student) =>
                filterStatus === 'all' || student.status === filterStatus
        )
        .filter(
            (student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.nim.includes(searchTerm)
        )
        .sort((a, b) => {
            if (!sortConfig.key) return 0;

            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle numeric values (IPK and TAK)
            if (sortConfig.key === 'ipk' || sortConfig.key === 'tak') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    return (
        <div className="min-h-screen bg-orange-50">
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Daftar Mahasiswa Wali
                </h2>

                {/* Control Panel */}
                <div className="bg-white p-4 mb-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Class Selector */}
                    <div className="w-full md:w-auto">
                        <div className="relative">
                            <select
                                value={selectedClass}
                                onChange={(e) =>
                                    setSelectedClass(e.target.value)
                                }
                                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 w-full md:w-48">
                                <option value="all">Semua Kelas</option>
                                {classOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Cari nama atau NIM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 w-full">
                                <option value="all">Semua Status</option>
                                <option value="Aman">Aman</option>
                                <option value="Siaga">Siaga</option>
                                <option value="Bermasalah">Bermasalah</option>
                            </select>
                            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Sorting Info */}
                {sortConfig.key && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                            <Info className="h-4 w-4 inline mr-1" />
                            Data diurutkan berdasarkan{' '}
                            {sortConfig.key.toUpperCase()}(
                            {sortConfig.direction === 'asc'
                                ? 'terkecil ke terbesar'
                                : 'terbesar ke terkecil'}
                            )
                            <button
                                onClick={() =>
                                    setSortConfig({
                                        key: null,
                                        direction: 'asc',
                                    })
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 underline">
                                Reset pengurutan
                            </button>
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <p className="text-lg">Loading student data...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <p className="text-lg text-red-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-red-800 text-white px-4 py-2 rounded">
                            Reload Page
                        </button>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-red-800 text-white">
                                    <th className="py-3 px-4 text-left">
                                        NAMA
                                    </th>
                                    <th className="py-3 px-4 text-left">NIM</th>
                                    <th className="py-3 px-4 text-left">
                                        KELAS
                                    </th>
                                    <th className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleSort('ipk')}
                                            className="flex items-center justify-center w-full hover:bg-red-700 px-2 py-1 rounded transition-colors">
                                            IPK
                                            {getSortIcon('ipk')}
                                        </button>
                                    </th>
                                    <th className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleSort('tak')}
                                            className="flex items-center justify-center w-full hover:bg-red-700 px-2 py-1 rounded transition-colors">
                                            TAK
                                            {getSortIcon('tak')}
                                        </button>
                                    </th>
                                    <th className="py-3 px-4 text-center">
                                        STATUS
                                    </th>
                                    <th className="py-3 px-4 text-center">
                                        DETAIL
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedStudents.length > 0 ? (
                                    filteredAndSortedStudents.map(
                                        (student, index) => (
                                            <tr
                                                key={student.nim || index}
                                                className={`${getStatusColor(
                                                    student.status
                                                )} border-b hover:bg-gray-50 cursor-pointer`}
                                                onClick={() =>
                                                    handleRowClick(student.nim)
                                                }>
                                                <td className="py-3 px-4">
                                                    {student.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {student.nim}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {student.kelas}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {typeof student.ipk ===
                                                    'number'
                                                        ? student.ipk.toFixed(2)
                                                        : student.ipk}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {student.tak}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-flex items-center">
                                                        <span
                                                            className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusDot(
                                                                student.status
                                                            )}`}></span>
                                                        {student.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowDetail(
                                                                showDetail ===
                                                                    student.nim
                                                                    ? null
                                                                    : student.nim
                                                            );
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800">
                                                        <Info className="h-5 w-5 mx-auto" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="py-4 text-center text-gray-500">
                                            Tidak ada data mahasiswa yang
                                            ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Student Detail Popup */}
                {showDetail && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">
                                    Detail Mahasiswa
                                </h3>
                                <button
                                    onClick={() => setShowDetail(null)}
                                    className="text-gray-500 hover:text-gray-700">
                                    &times;
                                </button>
                            </div>

                            {(() => {
                                const student = students.find(
                                    (s) => s.nim === showDetail
                                );
                                if (!student) return null;

                                return (
                                    <>
                                        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
                                            <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center">
                                                <User className="h-12 w-12 text-gray-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold">
                                                    {student.name}
                                                </h4>
                                                <p className="text-gray-600">
                                                    {student.nim}
                                                </p>
                                                <p className="text-gray-600">
                                                    {student.kelas}
                                                </p>
                                                <p className="mt-1">
                                                    <span
                                                        className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusDot(
                                                            student.status
                                                        )}`}></span>
                                                    {student.status}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="p-3 bg-gray-50 rounded">
                                                <p className="text-sm text-gray-500">
                                                    IPK
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {typeof student.ipk ===
                                                    'number'
                                                        ? student.ipk.toFixed(2)
                                                        : student.ipk}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded">
                                                <p className="text-sm text-gray-500">
                                                    TAK
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {student.tak}{' '}
                                                    {typeof student.tak !==
                                                        'string' && 'poin'}
                                                </p>
                                            </div>
                                        </div>

                                        <h5 className="font-semibold mb-2">
                                            Status Monitoring
                                        </h5>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span>Akademik:</span>
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusDot(
                                                            student.details
                                                                ?.akademik ||
                                                                'Aman'
                                                        )}`}></span>
                                                    {student.details
                                                        ?.akademik || 'Aman'}
                                                </div>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span>Psikologis:</span>
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusDot(
                                                            student.details
                                                                ?.psikologis ||
                                                                'Aman'
                                                        )}`}></span>
                                                    {student.details
                                                        ?.psikologis || 'Aman'}
                                                </div>
                                            </div>
                                            <div className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span>Finansial:</span>
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusDot(
                                                            student.details
                                                                ?.finansial ||
                                                                'Aman'
                                                        )}`}></span>
                                                    {student.details
                                                        ?.finansial || 'Aman'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(
                                                        `/lecturer/detailMahasiswa/${student.nim}`
                                                    );
                                                }}>
                                                Lihat Detail Lengkap
                                            </button>
                                            <button
                                                className="bg-red-800 text-white px-4 py-2 rounded"
                                                onClick={() =>
                                                    setShowDetail(null)
                                                }>
                                                Tutup
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}

                {/* Pagination - Only show if we have data */}
                {!loading && !error && filteredAndSortedStudents.length > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Menampilkan {filteredAndSortedStudents.length} dari{' '}
                            {students.length} mahasiswa
                        </p>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 border border-gray-300 rounded bg-white">
                                1
                            </button>
                            {students.length > 10 && (
                                <>
                                    <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-400">
                                        2
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-400">
                                        3
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
