import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    getPrestasiData,
    createPrestasiData,
    updatePrestasiData,
    deletePrestasiData,
} from '../../../services/adminServices/kelolaAkademikServices';

const DataPrestasiTab = ({ mahasiswaData }) => {
    // State untuk data
    const [prestasiData, setPrestasiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    // State untuk mode edit
    const [isEditing, setIsEditing] = useState(false);

    // State untuk form
    const [formData, setFormData] = useState({
        tak: '',
        sks_lulus: '',
        ipk_lulus: '',
    });

    // Load data saat component mount
    useEffect(() => {
        if (mahasiswaData?.nim) {
            loadPrestasiData();
        }
    }, [mahasiswaData]);

    // Load prestasi data
    const loadPrestasiData = async () => {
        setLoading(true);
        try {
            const response = await getPrestasiData(mahasiswaData.nim);
            if (response.success) {
                setPrestasiData(response.data);
                // Set form data jika ada data
                if (response.data) {
                    setFormData({
                        tak: response.data.tak?.toString() || '',
                        sks_lulus: response.data.totalSks?.toString() || '',
                        ipk_lulus: response.data.ipk?.toString() || '',
                    });
                }
            } else {
                // Jika data tidak ditemukan, set null
                setPrestasiData(null);
                setFormData({
                    tak: '',
                    sks_lulus: '',
                    ipk_lulus: '',
                });
            }
        } catch (error) {
            console.error('Error loading prestasi data:', error);
            setPrestasiData(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingAction(true);

        try {
            let response;
            const submitData = {
                nim: mahasiswaData.nim,
                tak: formData.tak,
                sks_lulus: formData.sks_lulus,
                ipk_lulus: formData.ipk_lulus,
            };

            if (prestasiData) {
                // Update existing data
                response = await updatePrestasiData(
                    mahasiswaData.nim,
                    submitData
                );
            } else {
                // Create new data
                response = await createPrestasiData(submitData);
            }

            if (response.success) {
                toast.success(response.message);
                setIsEditing(false);
                loadPrestasiData();
            } else {
                toast.error(response.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menyimpan data');
        } finally {
            setLoadingAction(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (
            !window.confirm(
                'Apakah Anda yakin ingin menghapus data prestasi ini?'
            )
        ) {
            return;
        }

        setLoadingAction(true);
        try {
            const response = await deletePrestasiData(mahasiswaData.nim);
            if (response.success) {
                toast.success(response.message);
                setPrestasiData(null);
                setFormData({
                    tak: '',
                    sks_lulus: '',
                    ipk_lulus: '',
                });
                setIsEditing(false);
            } else {
                toast.error(response.message || 'Gagal menghapus data');
            }
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus data');
        } finally {
            setLoadingAction(false);
        }
    };

    // Handle edit mode
    const handleEdit = () => {
        setIsEditing(true);
        if (prestasiData) {
            setFormData({
                tak: prestasiData.tak?.toString() || '',
                sks_lulus: prestasiData.totalSks?.toString() || '',
                ipk_lulus: prestasiData.ipk?.toString() || '',
            });
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        setIsEditing(false);
        if (prestasiData) {
            setFormData({
                tak: prestasiData.tak?.toString() || '',
                sks_lulus: prestasiData.totalSks?.toString() || '',
                ipk_lulus: prestasiData.ipk?.toString() || '',
            });
        } else {
            setFormData({
                tak: '',
                sks_lulus: '',
                ipk_lulus: '',
            });
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Data Prestasi Akademik
                    </h3>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-white border rounded-lg p-6">
                        {/* Display Mode */}
                        {!isEditing && prestasiData ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* TAK */}
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-8 h-8 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-blue-900">
                                                    TAK (Transkrip Aktivitas
                                                    Kemahasiswaan)
                                                </p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {prestasiData.tak || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* IPK */}
                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-8 h-8 text-green-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-green-900">
                                                    IPK Lulus
                                                </p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {prestasiData.ipk?.toFixed(
                                                        2
                                                    ) || '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SKS */}
                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-8 h-8 text-purple-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-purple-900">
                                                    Total SKS Lulus
                                                </p>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {prestasiData.totalSks || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={handleEdit}
                                        disabled={loadingAction}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        <span>Edit Data</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={loadingAction}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        <span>Hapus Data</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Form Mode */
                            <div>
                                <div className="mb-4">
                                    <h4 className="text-md font-medium text-gray-800">
                                        {prestasiData
                                            ? 'Edit Data Prestasi'
                                            : 'Tambah Data Prestasi'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {prestasiData
                                            ? 'Perbarui informasi prestasi akademik mahasiswa'
                                            : 'Masukkan data prestasi akademik mahasiswa'}
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4">
                                    {/* TAK */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            TAK (Test of Academic Knowledge){' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            name="tak"
                                            value={formData.tak}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            max="150"
                                            step="0.01"
                                            placeholder="Masukkan nilai TAK"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <small className="text-gray-500">
                                            Nilai TAK biasanya antara 0-150
                                        </small>
                                    </div>

                                    {/* IPK Lulus */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            IPK Lulus{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            name="ipk_lulus"
                                            value={formData.ipk_lulus}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            max="4"
                                            step="0.01"
                                            placeholder="Masukkan IPK lulus"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <small className="text-gray-500">
                                            IPK dalam skala 0.00 - 4.00
                                        </small>
                                    </div>

                                    {/* SKS Lulus */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total SKS Lulus{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            name="sks_lulus"
                                            value={formData.sks_lulus}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            max="200"
                                            placeholder="Masukkan total SKS lulus"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <small className="text-gray-500">
                                            Total SKS yang sudah diselesaikan
                                        </small>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={loadingAction}
                                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200">
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loadingAction}
                                            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50">
                                            {loadingAction ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                    Menyimpan...
                                                </div>
                                            ) : (
                                                'Simpan Data'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isEditing && !prestasiData && (
                            <div className="text-center py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    Belum ada data prestasi
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Mulai dengan menambahkan data prestasi
                                    akademik mahasiswa.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        <span>Tambah Data Prestasi</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataPrestasiTab;
