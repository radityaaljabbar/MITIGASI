const API_URL = 'http://localhost:5000/api/faculty';

/**
 * Fetch data analisis finansial berdasarkan NIM
 * @param {string} nim - Nomor Induk Mahasiswa
 */
export const getFinancialRelief = async (nim) => {
    try {
        // Get auth token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Authentication token not found');
        }

        console.log('Fetching financial data for NIM:', nim);
        console.log('API URL:', `${API_URL}/analisisFinansial/${nim}`);

        // Make the API request
        const response = await fetch(`${API_URL}/analisisFinansial/${nim}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Parse response
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get financial relief data');
        }

        // Transform backend data to match frontend expectations
        return transformFinancialData(result.data, nim);
    } catch (error) {
        console.error('Error in getFinancialRelief:', error);
        throw error;
    }
};

/**
 * Transform backend data structure to match frontend expectations
 * @param {Array} backendData - Array of financial relief data from backend
 * @param {string} nim - Student NIM
 */
const transformFinancialData = (backendData, nim) => {
    if (!backendData || backendData.length === 0) {
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

    // Get the latest entry for basic info (assuming first entry has the most recent data)
    const latestEntry = backendData[0];
    
    // Transform each relief request
    const transformedRequests = backendData.map(item => ({
        id: item.id,
        type: getReliefTypeLabel(item.jenis_keringanan),
        status: getStatusLabel(item.status_pengajuan),
        requestDate: formatDate(item.tanggal_dibuat),
        approvalDate: item.status_pengajuan !== 'Menunggu' ? formatDate(item.tanggal_response) : null,
        rejectionDate: item.status_pengajuan === 'Ditolak' ? formatDate(item.tanggal_response) : null,
        reason: item.alasan_keringan || 'Tidak ada alasan',
        requestAmount: parseFloat(item.jumlah_diajukan) || 0,
        monthlyIncome: parseFloat(item.penghasilan_mahasiswa) + parseFloat(item.penghasilan_orangtua) || 0,
        monthlyExpenses: parseFloat(item.pengeluaran_perbulan) || 0,
        familyDependents: item.tanggungan_orangtua || 0,
        residenceType: item.tempat_tinggal || '-',
        detailReason: item.detail_alasan || item.alasan_keringan || 'Tidak ada detail',
        attachments: ['Dokumen_Pendukung.pdf'], // Placeholder since backend doesn't have attachment info
        installmentPlan: item.status_pengajuan === 'Disetujui' ? 'Rencana cicilan akan dibahas lebih lanjut' : null,
        rejectionReason: item.status_pengajuan === 'Ditolak' ? 'Tidak memenuhi kriteria bantuan' : null
    }));

    // Separate pending and completed requests
    const pendingRequests = transformedRequests.filter(req => req.status === 'Menunggu Review');
    const previousRequests = transformedRequests.filter(req => req.status !== 'Menunggu Review');

    // Get the most recent update date
    const lastUpdated = backendData.length > 0 ? 
        formatDate(Math.max(...backendData.map(item => new Date(item.tanggal_dibuat).getTime()))) : 
        '-';

    return {
        name: latestEntry.nama,
        nim: nim,
        semester: '-', // Backend doesn't provide semester info
        financialStatus: determineFinancialStatus(backendData),
        lastUpdated: lastUpdated,
        pendingRequests: pendingRequests,
        previousRequests: previousRequests,
    };
};

/**
 * Convert backend relief type to readable label
 */
const getReliefTypeLabel = (jenisKeringanan) => {
    const typeMap = {
        'ukt': 'Keringanan UKT',
        'beasiswa': 'Beasiswa',
        'bantuan_hidup': 'Bantuan Hidup',
        'emergency': 'Dana Darurat'
    };
    return typeMap[jenisKeringanan] || jenisKeringanan || 'Bantuan Finansial';
};

/**
 * Convert backend status to frontend status
 */
const getStatusLabel = (status) => {
    const statusMap = {
        'Menunggu': 'Menunggu Review',
        'Disetujui': 'Disetujui',
        'Ditolak': 'Ditolak'
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
        day: 'numeric'
    });
};

/**
 * Determine financial status based on relief history
 */
const determineFinancialStatus = (data) => {
    if (!data || data.length === 0) return '-';
    
    const hasActiveRelief = data.some(item => item.status_pengajuan === 'Disetujui');
    const hasPendingRequest = data.some(item => item.status_pengajuan === 'Menunggu');
    
    if (hasActiveRelief) return 'Mendapat Bantuan';
    if (hasPendingRequest) return 'Sedang Diproses';
    return 'Siaga';
};