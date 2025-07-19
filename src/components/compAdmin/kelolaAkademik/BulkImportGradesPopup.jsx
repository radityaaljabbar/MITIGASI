// Komponen Pop-up untuk Import Nilai Secara Massal - Mengimpor nilai mahasiswa melalui file CSV
// Pop-up Component for Bulk Grade Import - Import student grades through CSV file
import React, { useState, useRef } from 'react';

const BulkImportGradesPopup = ({
    isOpen,
    onClose,
    onImport,
    loading,
    mahasiswaData,
}) => {
    // State untuk file yang dipilih user
    // State for selected file by user
    const [selectedFile, setSelectedFile] = useState(null);
    
    // State untuk proses importing
    // State for importing process
    const [importing, setImporting] = useState(false);
    
    // State untuk hasil import
    // State for import results
    const [results, setResults] = useState(null);
    
    // Reference untuk input file element
    // Reference for file input element
    const fileInputRef = useRef(null);

    /**
     * Handler untuk perubahan file input
     * Handler for file input change
     * @param {Event} e - Event object dari file input
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ekstensi file - hanya menerima CSV
            // Validate file extension - only accept CSV
            if (!file.name.toLowerCase().endsWith('.csv')) {
                alert('Hanya file CSV yang diperbolehkan');
                return;
            }
            setSelectedFile(file);
        }
    };

    /**
     * Handler untuk proses import data
     * Handler for data import process
     * @desc    Import grades from CSV file
     * @access  Private (Admin only)
     */
    const handleImport = async () => {
        // Validasi apakah file sudah dipilih
        // Validate if file is selected
        if (!selectedFile) {
            alert('Pilih file CSV terlebih dahulu');
            return;
        }

        setImporting(true); // Set state importing menjadi true
        
        // Panggil fungsi import yang dikirim sebagai props
        // Call import function passed as props
        const importResults = await onImport(selectedFile);

        // Set hasil import jika ada
        // Set import results if available
        if (importResults) {
            setResults(importResults);
        }
        setImporting(false); // Set state importing kembali ke false
    };

    /**
     * Handler untuk menutup popup dan reset state
     * Handler to close popup and reset state
     */
    const handleClose = () => {
        setSelectedFile(null); // Reset selected file
        setResults(null); // Reset import results
        setImporting(false); // Reset importing state
        
        // Reset file input value
        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose(); // Panggil function onClose dari props
    };

    /**
     * Fungsi untuk download template CSV
     * Function to download CSV template
     * @desc    Generate and download CSV template for grade import
     */
    const downloadTemplate = () => {
        // Template CSV dengan header dan contoh data
        // CSV template with header and sample data
        const csvContent =
            'kode_mk,indeks_nilai,semester,tahun_ajaran\nMK001,A,GANJIL,2024/2025\nMK002,B+,GANJIL,2024/2025';
        
        // Buat blob dari string CSV
        // Create blob from CSV string
        const blob = new Blob([csvContent], { type: 'text/csv' });
        
        // Buat URL untuk download
        // Create URL for download
        const url = window.URL.createObjectURL(blob);
        
        // Buat element anchor untuk trigger download
        // Create anchor element to trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_nilai_mahasiswa.csv';
        a.click();
        
        // Cleanup URL object
        // Cleanup URL object
        window.URL.revokeObjectURL(url);
    };

    // Jika popup tidak terbuka, return null
    // If popup is not open, return null
    if (!isOpen) return null;

    return (
        // Overlay backdrop untuk modal
        // Backdrop overlay for modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Container modal */}
            {/* Modal container */}
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header modal dengan judul dan tombol close */}
                {/* Modal header with title and close button */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Import Nilai dari CSV - {mahasiswaData?.name} (
                        {mahasiswaData?.nim})
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Tampilkan form import jika belum ada hasil */}
                {/* Show import form if no results yet */}
                {!results ? (
                    <>
                        {/* Petunjuk penggunaan import */}
                        {/* Import usage instructions */}
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">
                                Petunjuk Import:
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• File harus dalam format CSV</li>
                                <li>
                                    • Kolom yang diperlukan: kode_mk,
                                    indeks_nilai, semester, tahun_ajaran
                                </li>
                                <li>• Semester: GANJIL/GENAP/ANTARA</li>
                                <li>
                                    • Indeks nilai: A, A-, AB, B+, B, B-, BC,
                                    C+, C, C-, D+, D, E, T
                                </li>
                                <li>• Tahun ajaran format: 2024/2025</li>
                            </ul>
                        </div>

                        {/* Tombol download template */}
                        {/* Download template button */}
                        <div className="mb-4">
                            <button
                                onClick={downloadTemplate}
                                className="text-blue-600 hover:text-blue-800 underline text-sm">
                                📥 Download Template CSV
                            </button>
                        </div>

                        {/* Input file CSV */}
                        {/* CSV file input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih File CSV
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white file:px-4 file:py-2 hover:file:bg-blue-600 transition duration-300"
                            />
                            {/* Indikator file yang dipilih */}
                            {/* Selected file indicator */}
                            {selectedFile && (
                                <p className="mt-2 text-sm text-green-600">
                                    ✓ File dipilih: {selectedFile.name}
                                </p>
                            )}
                        </div>

                        {/* Tombol aksi */}
                        {/* Action buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleClose}
                                disabled={importing}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50">
                                Batal
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!selectedFile || importing}
                                className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50">
                                {importing ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Mengimpor...
                                    </div>
                                ) : (
                                    'Import Data'
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    /* Tampilan hasil import */
                    /* Import results display */
                    <div>
                        {/* Ringkasan hasil import */}
                        {/* Import results summary */}
                        <div className="mb-4 p-4 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-2">
                                Hasil Import:
                            </h4>
                            <div className="text-sm text-green-700 space-y-1">
                                <p>📊 Total data: {results.total}</p>
                                <p>✅ Berhasil: {results.created}</p>
                                <p>❌ Gagal: {results.failed}</p>
                            </div>
                        </div>

                        {/* Detail error jika ada */}
                        {/* Error details if any */}
                        {results.errors && results.errors.length > 0 && (
                            <div className="mb-4 p-4 bg-red-50 rounded-lg max-h-60 overflow-y-auto">
                                <h4 className="font-medium text-red-800 mb-2">
                                    Detail Error:
                                </h4>
                                <div className="text-sm text-red-700 space-y-2">
                                    {results.errors.map((error, index) => (
                                        <div
                                            key={index}
                                            className="border-b border-red-200 pb-1">
                                            <strong>Baris {error.row}:</strong>{' '}
                                            {error.kode_mk} ({error.semester}{' '}
                                            {error.tahun_ajaran}) -{' '}
                                            {error.error}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tombol tutup */}
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                            Tutup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkImportGradesPopup;