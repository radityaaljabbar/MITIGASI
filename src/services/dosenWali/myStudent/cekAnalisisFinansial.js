import { getApiUrl, getAuthHeaders } from '../../../config/api';

/**
 * Mengambil data analisis finansial seorang mahasiswa berdasarkan NIM.
 * Fetches the financial analysis data of a student by NIM.
 * @param {string} nim - Nomor Induk Mahasiswa.
 * @returns {Promise<Object>} - Data finansial yang sudah ditransformasi.
 */
export const getFinancialRelief = async (nim) => {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Make the API request
        const response = await fetch(
            getApiUrl(`/faculty/analisisFinansial/${nim}`),
            {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
            }
        );

        // Parse response
        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Failed to get financial relief data'
            );
        }

        // Mengubah data dari backend agar sesuai dengan format frontend
        // Transforming backend data to match the frontend format
        return transformFinancialData(result.data, nim);
    } catch (error) {
        console.error('Error in getFinancialRelief:', error);
        throw error;
    }
};

/**
 * Mengubah struktur data finansial dari backend agar sesuai dengan ekspektasi frontend.
 * Transforms the financial data structure from the backend to match frontend expectations.
 * @param {Array} backendData - Array data dari backend.
 * @param {string} nim - NIM mahasiswa.
 */
const transformFinancialData = (backendData, nim) => {
    if (!backendData || backendData.length === 0) {
        // Mengembalikan struktur default jika tidak ada data
        // Returning a default structure if there is no data
        return {
            name: 'Data Tidak Ditemukan',
            nim: nim || '-',
            semester: '-',
            financialStatus: '-',
            lastUpdated: '-',
            pendingRequests: [],
            previousRequests: [],
        };
    }

    // Mengambil data terbaru untuk informasi dasar
    // Getting the latest entry for basic information
    const latestEntry = backendData[0];

    // Transform each relief request
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };
    const transformedRequests = backendData.map((item) => ({
        id: item.id,
        type: getReliefTypeLabel(item.jenis_keringanan),
        status: getStatusLabel(item.status_pengajuan),
        requestDate: formatDate(item.tanggal_dibuat),
        approvalDate:
            item.status_pengajuan !== 'Menunggu'
                ? formatDate(item.tanggal_response)
                : null,
        rejectionDate:
            item.status_pengajuan === 'Ditolak'
                ? formatDate(item.tanggal_response)
                : null,
        reason: item.alasan_keringan || 'Tidak ada alasan',
        requestAmount: parseFloat(item.jumlah_diajukan) || 0,
        monthlyIncome: parseFloat(item.penghasilan_orangtua) || 0,
        monthlyExpenses: parseFloat(item.pengeluaran_perbulan) || 0,
        familyDependents: item.tanggungan_orangtua || 0,
        residenceType: item.tempat_tinggal || '-',
        detailReason:
            item.detail_alasan || item.alasan_keringan || 'Tidak ada detail',
        installmentPlan:
            item.status_pengajuan === 'Disetujui'
                ? 'Rencana cicilan akan dibahas lebih lanjut'
                : null,
        rejectionReason:
            item.status_pengajuan === 'Ditolak'
                ? 'Tidak memenuhi kriteria bantuan'
                : null,
        lampiran: item.lampiran_url
            ? {
                  url: item.lampiran_url,
                  originalName: item.lampiran_name,
                  fileType: 'application/pdf', // Default, bisa disesuaikan jika ada info file type dari backend
              }
            : null,
    }));

    // Memisahkan pengajuan yang masih pending dan yang sudah selesai
    // Separating pending and completed requests
    const pendingRequests = transformedRequests.filter(
        (req) => req.status === 'Menunggu Review'
    );
    const previousRequests = transformedRequests.filter(
        (req) => req.status !== 'Menunggu Review'
    );

    // Get the most recent update date
    const lastUpdated =
        backendData.length > 0
            ? formatDate(
                  Math.max(
                      ...backendData.map((item) =>
                          new Date(item.tanggal_dibuat).getTime()
                      )
                  )
              )
            : '-';

    return {
        name: latestEntry.nama,
        nim: nim,
        semester: latestEntry.current_semester,
        financialStatus: determineFinancialStatus(backendData),
        lastUpdated: lastUpdated,
        pendingRequests: pendingRequests,
        previousRequests: previousRequests,
    };
};

// Fungsi-fungsi helper untuk transformasi data
// Helper functions for data transformation

/**
 * Convert backend relief type to readable label
 */
const getReliefTypeLabel = (jenisKeringanan) => {
    const typeMap = {
        ukt: 'Keringanan UKT',
        beasiswa: 'Beasiswa',
        bantuan_hidup: 'Bantuan Hidup',
        emergency: 'Dana Darurat',
    };
    return typeMap[jenisKeringanan] || jenisKeringanan || 'Bantuan Finansial';
};

/**
 * Convert backend status to frontend status
 */
const getStatusLabel = (status) => {
    const statusMap = {
        Menunggu: 'Menunggu Review',
        Disetujui: 'Disetujui',
        Ditolak: 'Ditolak',
    };
    return statusMap[status] || status || 'Menunggu Review';
};

/**
 * Format date to Indonesian format
 */
const formatDate = (dateInput) => {
    if (!dateInput) return '-';

    let date;
    if (typeof dateInput === 'number') {
        date = new Date(dateInput);
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Determine financial status based on relief history
 */
const determineFinancialStatus = (data) => {
    if (!data || data.length === 0) return '-';

    const hasActiveRelief = data.some(
        (item) => item.status_pengajuan === 'Disetujui'
    );
    const hasPendingRequest = data.some(
        (item) => item.status_pengajuan === 'Menunggu'
    );

    if (hasActiveRelief) return 'Mendapat Bantuan';
    if (hasPendingRequest) return 'Siaga';
    return 'Siaga';
};

/**
 * Mengirimkan respon (setuju/tolak) untuk pengajuan finansial.
 * Sends a response (approve/reject) for a financial request.
 * @param {number} id - ID pengajuan finansial.
 * @param {string} action - Aksi yang akan dilakukan ('approve' atau 'reject').
 */
export const sendFinancialResponse = async (id, action) => {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Make the API request
        const response = await fetch(
            getApiUrl(`/faculty/analisisFinansial/responseFinancial/${id}`),
            {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            }
        );

        // Parse response
        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || `Failed to ${action} financial request`
            );
        }

        return result;
    } catch (error) {
        console.error(`Error ${action}ing financial request:`, error);
        throw error;
    }
};
