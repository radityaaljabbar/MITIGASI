import React, { useState, useEffect } from 'react';
import { 
    getRecommendedCourse, 
    getListPeminatan, 
    sendPeminatanMahasiswa,
    getStudentPeminatan 
} from '../../../services/mahasiswaServices/myCourseService';

/**
 * Komponen untuk menampilkan rekomendasi mata kuliah bagi mahasiswa.
 * Component to display course recommendations for students.
 */
const RekomendasiMataKuliah = () => {
    // State untuk menyimpan data rekomendasi dari API
    // State to store recommendation data from the API
    const [recommendedData, setRecommendedData] = useState({});
    // State untuk menyimpan data yang sudah dikelompokkan per semester
    // State to store data grouped by semester
    const [groupedData, setGroupedData] = useState({});
    // State untuk status loading saat mengambil data
    // State for loading status while fetching data
    const [loading, setLoading] = useState(false);
    // State untuk menyimpan pesan error
    // State to store error messages
    const [error, setError] = useState(null);
    // State untuk menandakan apakah ada rekomendasi atau tidak
    // State to indicate whether there are recommendations or not
    const [noRecommendations, setNoRecommendations] = useState(true);
    
    // State untuk fitur pemilihan kelompok keahlian (peminatan)
    // State for the specialization selection feature
    const [selectedKeahlian, setSelectedKeahlian] = useState('');
    const [kelompokKeahlianList, setKelompokKeahlianList] = useState([]);
    const [loadingPeminatan, setLoadingPeminatan] = useState(false);
    const [savingPeminatan, setSavingPeminatan] = useState(false);
    const [peminatanMessage, setPeminatanMessage] = useState('');

    // State untuk menyimpan peminatan yang sudah dipilih mahasiswa
    // State to store the specialization already chosen by the student
    const [currentPeminatan, setCurrentPeminatan] = useState('');
    const [loadingCurrentPeminatan, setLoadingCurrentPeminatan] = useState(true);

    /**
     * Mengambil daftar pilihan peminatan dari server untuk mengisi dropdown.
     * Fetches the list of specialization options from the server to populate the dropdown.
     */
    const fetchListPeminatan = async () => {
        try {
            setLoadingPeminatan(true);
            const response = await getListPeminatan();
            
            if (response.success && response.data) {
                const peminatanList = response.data.map(item => 
                    item.nama_peminatan || item.name || item
                );
                setKelompokKeahlianList(peminatanList);
            } else {
                // Gunakan daftar default jika fetch gagal
                // Use a default list if the fetch fails
                setKelompokKeahlianList([
                    'Data Science & Analytics', 'Software Engineering', 'Artificial Intelligence',
                    'Computer Networks & Security', 'Human Computer Interaction', 'Information Systems'
                ]);
                console.warn('Failed to fetch peminatan list, using default list');
            }
        } catch (error) {
            console.error('Error fetching peminatan list:', error);
            // Fallback ke daftar default jika terjadi error
            // Fallback to the default list if an error occurs
            setKelompokKeahlianList([
                'Data Science & Analytics', 'Software Engineering', 'Artificial Intelligence',
                'Computer Networks & Security', 'Human Computer Interaction', 'Information Systems'
            ]);
        } finally {
            setLoadingPeminatan(false);
        }
    };
    
    /**
     * Mengambil peminatan yang saat ini sudah dipilih oleh mahasiswa.
     * Fetches the specialization currently selected by the student.
     */
    const fetchCurrentPeminatan = async () => {
        setLoadingCurrentPeminatan(true);
        try {
            const response = await getStudentPeminatan();
            if (response.success && response.data.peminatan && response.data.peminatan !== 'Belum memilih peminatan') {
                const studentPeminatan = response.data.peminatan;
                setCurrentPeminatan(studentPeminatan);
                setSelectedKeahlian(studentPeminatan); // Atur dropdown sesuai pilihan saat ini
            }
        } catch (error) {
            console.error("Error fetching student's current peminatan:", error);
        } finally {
            setLoadingCurrentPeminatan(false);
        }
    };

    /**
     * Mengambil data rekomendasi mata kuliah dari server.
     * Fetches recommended course data from the server.
     * @param {string|null} kelompokKeahlian - Peminatan yang dipilih untuk filter.
     */
    const fetchRecommendedCourse = async (kelompokKeahlian = null) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRecommendedCourse(kelompokKeahlian);

            if (response.success) {
                if (response.data && response.data.length > 0) {
                    setRecommendedData(response);
                    setGroupedData(response.groupedData || {});
                    setNoRecommendations(false);
                } else {
                    setNoRecommendations(true);
                    setRecommendedData({});
                    setGroupedData({});
                }
            } else {
                setError(response.message || 'Failed to fetch recommended course');
                setNoRecommendations(true);
            }
        } catch (error) {
            console.error('An error occurred while fetching recommended course');
            setError('Terjadi kesalahan dalam mengambil data rekomendasi mata kuliah');
            setNoRecommendations(true);
        } finally {
            setLoading(false);
        }
    };

    // Effect untuk memuat semua data awal saat komponen pertama kali di-mount
    // Effect to load all initial data when the component first mounts
    useEffect(() => {
        // Menjalankan fetch secara berurutan agar terstruktur
        // Running fetches sequentially for a structured load
        const loadInitialData = async () => {
            await fetchListPeminatan();       // 1. Ambil daftar pilihan peminatan
            await fetchCurrentPeminatan();    // 2. Ambil peminatan mahasiswa saat ini
            await fetchRecommendedCourse();   // 3. Ambil rekomendasi MK
        };
        
        loadInitialData();
    }, []); // Dependensi kosong berarti hanya berjalan sekali

    /**
     * Menangani pengiriman pilihan kelompok keahlian ke server.
     * Handles submitting the chosen specialization to the server.
     */
    const handleSubmitKeahlian = async () => {
        if (!selectedKeahlian) return;

        try {
            setSavingPeminatan(true);
            setPeminatanMessage('');
            const response = await sendPeminatanMahasiswa(selectedKeahlian);

            if (response.success) {
                setPeminatanMessage({
                    type: 'success',
                    text: response.message || 'Peminatan berhasil disimpan!'
                });
                setCurrentPeminatan(selectedKeahlian); // Perbarui UI peminatan saat ini
                await fetchRecommendedCourse(selectedKeahlian); // Ambil rekomendasi baru
            } else {
                setPeminatanMessage({
                    type: 'error',
                    text: response.message || 'Gagal menyimpan peminatan'
                });
            }
        } catch (error) {
            console.error('Error saving peminatan:', error);
            setPeminatanMessage({
                type: 'error',
                text: 'Terjadi kesalahan saat menyimpan peminatan'
            });
        } finally {
            setSavingPeminatan(false);
            // Sembunyikan pesan setelah 3 detik
            // Hide the message after 3 seconds
            setTimeout(() => setPeminatanMessage(''), 3000);
        }
    };

    /**
     * Memformat string tanggal menjadi format yang lebih mudah dibaca.
     * Formats a date string into a more readable format.
     * @param {string} dateString - String tanggal dari API.
     * @returns {string} - Tanggal yang sudah diformat.
     */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    };

    // Tampilan saat loading
    // Loading view
    if (loading) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#951a22] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course recommendations...</p>
                </div>
            </div>
        );
    }

    // Tampilan saat terjadi error
    // Error view
    if (error) {
        return (
            <div className="bg-white w-full max-w-[1200px] min-h-[500px] p-6 rounded-2xl shadow-xl border border-gray-200 flex justify-center items-center">
                <div className="text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        className="px-6 py-2 bg-[#951a22] text-white rounded-lg hover:bg-[#7a1419] transition-colors duration-200 shadow-md"
                        onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white w-full max-w-[1200px] min-h-[500px] max-h-[1000px] p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center space-y-5">
            {/* Header Komponen */}
            {/* Component Header */}
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center mb-2">
                    <div className="bg-gradient-to-r from-[#951a22] to-[#7a1419] p-3 rounded-lg mr-4">
                        <i className="fas fa-graduation-cap text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            Mata Kuliah Rekomendasi
                        </h2>
                    </div>
                </div>

            </div>

            {/* Bagian Pemilihan Kelompok Keahlian */}
            {/* Specialization Selection Section */}
            <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="bg-blue-500 text-white p-2 rounded-full mr-3">🎯</div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Kelompok Keahlian</h3>
                        <p className="text-sm text-gray-600">
                            Pilih kelompok keahlian untuk mendapatkan rekomendasi mata kuliah yang lebih personal.
                            {loadingCurrentPeminatan ? (
                                <span className="block text-gray-500 italic mt-1">Memuat peminatan saat ini...</span>
                            ) : (
                                currentPeminatan && (
                                    <span className="block mt-1">
                                        Pilihan saat ini: <strong className="text-blue-600">{currentPeminatan}</strong>
                                    </span>
                                )
                            )}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Keahlian:</label>
                        <div className="relative flex gap-4">
                            <select
                                value={selectedKeahlian}
                                onChange={(e) => setSelectedKeahlian(e.target.value)}
                                disabled={loadingPeminatan}
                                className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">{loadingPeminatan ? 'Loading...' : 'Pilih Kelompok Keahlian...'}</option>
                                {kelompokKeahlianList.map((keahlian, index) => (
                                    <option key={index} value={keahlian}>{keahlian}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <button
                                onClick={handleSubmitKeahlian}
                                disabled={!selectedKeahlian || savingPeminatan || loadingPeminatan}
                                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md transform hover:scale-105 ${
                                    selectedKeahlian && !savingPeminatan && !loadingPeminatan
                                        ? 'bg-red-700 text-white hover:bg-red-800 hover:shadow-lg'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {savingPeminatan ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Menyimpan...
                                    </span>
                                ) : ('Simpan')}
                            </button>
                        </div>
                        
                        {/* Pesan feedback setelah menyimpan peminatan */}
                        {/* Feedback message after saving specialization */}
                        {peminatanMessage && (
                            <div className={`mt-3 p-3 rounded-lg text-sm ${
                                peminatanMessage.type === 'success' 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                                <div className="flex items-center">
                                    <span className="mr-2">{peminatanMessage.type === 'success' ? '✅' : '❌'}</span>
                                    {peminatanMessage.text}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Konten Utama: Daftar Rekomendasi atau Pesan Kosong */}
            {/* Main Content: Recommendation List or Empty Message */}
            {noRecommendations ? (
                // Tampilan jika tidak ada rekomendasi
                // View if there are no recommendations
                <div className="w-full flex-1 flex flex-col justify-center items-center py-16">
                    <div className="text-center">
                        <div className="text-6xl mb-6">📚</div>
                        <p className="text-gray-500 italic text-lg mb-4">Belum ada rekomendasi mata kuliah dari dosen wali</p>
                        <p className="text-gray-400 text-sm mb-6">Pilih kelompok keahlian di atas untuk mendapatkan rekomendasi yang sesuai dengan minat Anda</p>
                        <button onClick={() => fetchRecommendedCourse()} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md">
                            Retry
                        </button>
                    </div>
                </div>
            ) : (
                // Tampilan jika ada rekomendasi
                // View if there are recommendations
                <div className="w-full h-[calc(100%-200px)] overflow-y-auto overflow-x-auto rounded-lg">
                    {Object.entries(groupedData)
                        // Urutkan berdasarkan semester
                        // Sort by semester
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([semester, courses]) => (
                            <div key={semester} className="mb-6 last:mb-0">
                                
                                {/* Header untuk setiap semester */}
                                {/* Header for each semester */}
                                <div className="flex items-center justify-between mb-3 p-4 bg-gradient-to-r from-[#951a22] to-[#7a1419] rounded-lg text-white shadow-md">
                                    <div className="flex items-center">
                                        <div className="bg-white text-[#951a22] px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                                            Diperuntukan untuk Semester: {semester}
                                        </div>
                                        <div className="ml-4 text-sm">
                                            <span className="font-medium">{courses.length} mata kuliah</span>
                                            <span className="mx-2">•</span>
                                            <span className="font-medium">{courses.reduce((total, course) => total + course.sks_mk, 0)} SKS</span>
                                        </div>
                                    </div>
                                    <div className="text-sm opacity-90">Dibuat: {formatDate(courses[0]?.tanggal_dibuat)}</div>
                                </div>

                                {/* Tabel Mata Kuliah */}
                                {/* Course Table */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 text-bol bg-gradient-to-r from-[#951a22] to-[#7a1419]">
                                                <th className="p-4 text-left font-bold text-white uppercase tracking-wide ">Kode</th>
                                                <th className="p-4 text-left font-bold text-white uppercase tracking-wide">Nama Mata Kuliah</th>
                                                <th className="p-4 text-center font-bold text-white uppercase tracking-wide">Jenis</th>
                                                <th className="p-4 text-center font-bold text-white uppercase tracking-wide">SKS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course, index) => (
                                                <tr key={index} className="hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                                                    <td className="p-4 text-gray-800 font-mono text-sm">{course.kode_mk}</td>
                                                    <td className="p-4 text-gray-800 font-medium">{course.nama_mk}</td>
                                                    <td className="p-4 text-center">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{course.jenis_mk}</span>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{course.sks_mk} SKS</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default RekomendasiMataKuliah;