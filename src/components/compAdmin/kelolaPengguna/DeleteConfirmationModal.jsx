import React from 'react';

/**
 * Komponen modal konfirmasi sebelum melakukan aksi penghapusan.
 * Confirmation modal component before performing a delete action.
 * @param {object} props - Props komponen.
 * @param {boolean} props.isOpen - Status apakah modal terbuka.
 * @param {function} props.onClose - Fungsi untuk menutup modal.
 * @param {function} props.onConfirm - Fungsi yang dipanggil saat penghapusan dikonfirmasi.
 * @param {object} props.data - Data item yang akan dihapus (untuk menampilkan nama).
 * @param {boolean} props.loading - Status loading untuk tombol konfirmasi.
 */
const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    data,
    loading,
}) => {
    if (!isOpen) return null;

    /**
     * Mendapatkan nama item yang akan dihapus secara aman dari objek data.
     * Safely gets the name of the item to be deleted from the data object.
     * @returns {string} - Nama item atau teks default.
     */
    const getName = () => {
        return data?.name || data?.nama || 'item ini';
    };

    return (
        // Latar belakang modal
        // Modal backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Konten modal */}
            {/* Modal content */}
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                {/* Ikon Peringatan */}
                {/* Warning Icon */}
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Konfirmasi Hapus
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus data{' '}
                        <span className="font-semibold">{getName()}</span>?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>

                    {/* Tombol Aksi (Batal & Hapus) */}
                    {/* Action Buttons (Cancel & Delete) */}
                    <div className="flex space-x-3">
                        <button onClick={onClose} disabled={loading} className="...">
                            Batal
                        </button>
                        <button onClick={onConfirm} disabled={loading} className="...">
                            {loading ? (
                                // Tampilan loading
                                // Loading state
                                <div className="flex items-center justify-center">...</div>
                            ) : (
                                'Hapus'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;