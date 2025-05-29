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
    X,
    Brain,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Eye,
    Sparkles,
    BarChart3,
    Calendar,
    Award
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
    const [activeTab, setActiveTab] = useState('overview');
    const [showPrediction, setShowPrediction] = useState(false);
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);

    // New state for sorting
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });

    const navigate = useNavigate();

    // Mock prediction result (replace with actual API call)
    const getPredictionResult = (student) => ({
        predictedStatus: "Bermasalah",
        confidence: 78,
        riskFactors: [
            { factor: "IPK Menurun", weight: 35, status: "high" },
            { factor: "Masalah Finansial", weight: 28, status: "high" },
            { factor: "Absensi Rendah", weight: 15, status: "medium" }
        ],
        recommendations: [
            "Konseling akademik intensif",
            "Bantuan beasiswa/keringanan biaya",
            "Monitoring kehadiran ketat"
        ]
    });

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

    // Reset popup states when showDetail changes
    useEffect(() => {
        if (showDetail) {
            setActiveTab('overview');
            setShowPrediction(false);
            setIsLoadingPrediction(false);
        }
    }, [showDetail]);

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
            case 'aman':
                return 'bg-green-100 text-green-800 border-green-200 capitalize-text';
            case 'siaga':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 capitalize-text';
            case 'bermasalah':
                return 'bg-red-100 text-red-800 border-red-200 capitalize-text';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 capitalize-text';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'aman':
                return 'bg-green-500';
            case 'siaga':
                return 'bg-yellow-500';
            case 'bermasalah':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'aman': return <CheckCircle className="h-4 w-4" />;
            case 'siaga': return <AlertTriangle className="h-4 w-4" />;
            case 'bermasalah': return <X className="h-4 w-4" />;
            default: return <Eye className="h-4 w-4" />;
        }
    };

    const handleRowClick = (nim) => {
        navigate(`/lecturer/detailMahasiswa/${nim}`);
    };

    const handlePrediction = async () => {
        setIsLoadingPrediction(true);
        // Simulate API call - replace with actual ML prediction API
        setTimeout(() => {
            setShowPrediction(true);
            setIsLoadingPrediction(false);
        }, 2000);
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

                {/* Enhanced Student Detail Popup */}
                {showDetail && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start sm:items-center p-2 sm:p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 sm:my-0 max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
                            
                            {(() => {
                                const student = students.find(
                                    (s) => s.nim === showDetail
                                );
                                if (!student) return null;

                                const predictionResult = getPredictionResult(student);

                                return (
                                    <>
                                        {/* Header - Mobile Optimized */}
                                        <div className="bg-[#951A22] p-4 sm:p-6 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
                                            
                                            <div className="relative flex justify-between items-start">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
                                                    <div className="bg-white bg-opacity-20 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                                        <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-xl sm:text-2xl font-bold mb-1 truncate">{student.name}</h3>
                                                        <p className="text-blue-100 text-xs sm:text-sm break-all sm:break-normal">{student.nim} • {student.kelas}</p>
                                                        <div className="flex items-center mt-2">
                                                            <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                                                                {getStatusIcon(student.status)}
                                                                <span className="ml-1">{student.status}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowDetail(null)}
                                                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 flex-shrink-0 ml-2">
                                                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tabs - Mobile Scrollable */}
                                        <div className="border-b border-gray-200 overflow-x-auto">
                                            <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max">
                                                <button
                                                    onClick={() => setActiveTab('overview')}
                                                    className={`py-3 sm:py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                                                        activeTab === 'overview'
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}>
                                                    Overview
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('prediction')}
                                                    className={`py-3 sm:py-4 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center whitespace-nowrap ${
                                                        activeTab === 'prediction'
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}>
                                                    <Brain className="h-4 w-4 mr-1" />
                                                    AI Prediction
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content - Mobile Optimized */}
                                        <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
                                            {activeTab === 'overview' && (
                                                <div className="space-y-4 sm:space-y-6">
                                                    {/* Stats Cards - Responsive Grid */}
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl border border-blue-200">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="mb-2 sm:mb-0">
                                                                    <p className="text-xs sm:text-sm text-blue-600 font-medium">IPK</p>
                                                                    <p className="text-lg sm:text-2xl font-bold text-blue-800">
                                                                        {typeof student.ipk === 'number' ? student.ipk.toFixed(2) : student.ipk}
                                                                    </p>
                                                                </div>
                                                                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 self-end sm:self-auto" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl border border-purple-200">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="mb-2 sm:mb-0">
                                                                    <p className="text-xs sm:text-sm text-purple-600 font-medium">TAK</p>
                                                                    <p className="text-lg sm:text-2xl font-bold text-purple-800">{student.tak}</p>
                                                                </div>
                                                                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 self-end sm:self-auto" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl border border-green-200">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="mb-2 sm:mb-0">
                                                                    <p className="text-xs sm:text-sm text-green-600 font-medium">Semester</p>
                                                                    <p className="text-lg sm:text-2xl font-bold text-green-800">{student.semester || 0}</p>
                                                                </div>
                                                                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 self-end sm:self-auto" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-xl border border-orange-200">
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="mb-2 sm:mb-0">
                                                                    <p className="text-xs sm:text-sm text-orange-600 font-medium">Total SKS</p>
                                                                    <p className="text-lg sm:text-2xl font-bold text-orange-800">{student.sks || 0}</p>
                                                                </div>
                                                                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 self-end sm:self-auto" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Quick Status Overview - Mobile Optimized */}
                                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                                        <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Status Monitoring</h4>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            {student.details && Object.entries(student.details).map(([key, value]) => (
                                                                <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs sm:text-sm font-medium capitalize text-gray-700 truncate flex-1 mr-2">{key}</span>
                                                                        <div className="flex items-center flex-shrink-0">
                                                                            <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(value)}`}></span>
                                                                            <span className="text-xs sm:text-sm font-medium capitalize-text">{value}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'prediction' && (
                                                <div className="space-y-4 sm:space-y-6">
                                                    {!showPrediction ? (
                                                        <div className="text-center py-6 sm:py-8">
                                                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 sm:p-8 border border-purple-200">
                                                                <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-purple-500 mx-auto mb-4" />
                                                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">AI Prediction Analysis</h3>
                                                                <p className="text-gray-600 mb-6 text-sm sm:text-base px-2">
                                                                    Gunakan machine learning untuk memprediksi status mahasiswa berdasarkan data historis dan pola perilaku
                                                                </p>
                                                                <button
                                                                    onClick={handlePrediction}
                                                                    disabled={isLoadingPrediction}
                                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center mx-auto text-sm sm:text-base">
                                                                    {isLoadingPrediction ? (
                                                                        <>
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                            Menganalisis...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Sparkles className="h-4 w-4 mr-2" />
                                                                            Mulai Prediksi
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4 sm:space-y-6">
                                                            {/* Prediction Result - Mobile Optimized */}
                                                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 sm:p-6 border border-red-200">
                                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                                                                    <h3 className="text-base sm:text-lg font-semibold text-red-800">Prediksi Status</h3>
                                                                    <span className="text-xs sm:text-sm text-red-600">Confidence: {predictionResult.confidence}%</span>
                                                                </div>
                                                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                                                    <span className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-sm sm:text-lg font-bold border w-fit ${getStatusColor(predictionResult.predictedStatus)}`}>
                                                                        {getStatusIcon(predictionResult.predictedStatus)}
                                                                        <span className="ml-2">{predictionResult.predictedStatus}</span>
                                                                    </span>
                                                                    <div className="flex-1">
                                                                        <div className="w-full bg-red-200 rounded-full h-2 sm:h-3">
                                                                            <div 
                                                                                className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-1000"
                                                                                style={{ width: `${predictionResult.confidence}%` }}>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Risk Factors - Mobile Optimized */}
                                                            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                                                                <h4 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">Faktor Risiko</h4>
                                                                <div className="space-y-3">
                                                                    {predictionResult.riskFactors.map((factor, index) => (
                                                                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                                                                            <span className="font-medium text-gray-700 text-sm sm:text-base">{factor.factor}</span>
                                                                            <div className="flex items-center space-x-2">
                                                                                <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                                                                    <div 
                                                                                        className={`h-2 rounded-full ${
                                                                                            factor.status === 'high' ? 'bg-red-500' : 
                                                                                            factor.status === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                                                        }`}
                                                                                        style={{ width: `${factor.weight}%` }}>
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-xs sm:text-sm font-medium text-gray-600 min-w-max">{factor.weight}%</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Recommendations - Mobile Optimized */}
                                                            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                                                                <h4 className="font-semibold text-blue-800 mb-4 text-sm sm:text-base">Rekomendasi Tindakan</h4>
                                                                <ul className="space-y-2">
                                                                    {predictionResult.recommendations.map((rec, index) => (
                                                                        <li key={index} className="flex items-start">
                                                                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                            <span className="text-blue-800 text-sm sm:text-base leading-relaxed">{rec}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer - Mobile Optimized */}
                                        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                                                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                                                </p>
                                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                                    <button
                                                        className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/lecturer/detailMahasiswa/${student.nim}`);
                                                        }}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Detail Lengkap
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDetail(null)}
                                                        className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base">
                                                        Tutup
                                                    </button>
                                                </div>
                                            </div>
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
                    </div>
                )}
            </main>
        </div>
    );
}
