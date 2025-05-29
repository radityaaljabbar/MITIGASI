import React from 'react';
import { toast } from 'react-toastify';
import { getFinancialRelief } from '../../../../services/dosenWali/myStudent/cekAnalisisFinansial';

// Updated function to use real API call
export const fetchStudentFinancialData = async (nim) => {
    try {
        if (!nim) {
            throw new Error('NIM is required');
        }

        console.log('Fetching financial data for NIM:', nim);
        
        // Call the real API service
        const data = await getFinancialRelief(nim);
        
        console.log('Financial data received:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching student financial data:', error);
        
        // Show appropriate error message
        if (error.message.includes('not found') || error.message.includes('404')) {
            toast.error(`Data mahasiswa dengan NIM ${nim} tidak ditemukan`, {
                toastId: `student-not-found-${nim}`,
            });
        } else if (error.message.includes('Authentication')) {
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
                toastId: 'auth-error',
            });
        } else {
            toast.error('Gagal memuat data mahasiswa. Silakan coba lagi.', {
                toastId: 'fetch-error',
            });
        }
        
        // Return safe default object to prevent null reference errors
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
};

export const approveRequest = async (id) => {
    try {
        
        toast.success(`Pengajuan berhasil disetujui`);
        return { success: true };
        
    } catch (error) {
        console.error('Error approving request:', error);
        toast.error('Gagal menyetujui pengajuan');
        throw error;
    }
};

export const rejectRequest = async (id) => {
    try {
        
        // For now, show success message
        toast.success(`Pengajuan berhasil ditolak`);
        return { success: true };
        
    } catch (error) {
        console.error('Error rejecting request:', error);
        toast.error('Gagal menolak pengajuan');
        throw error;
    }
};

export const downloadAttachment = async (filename) => {
    try {
       
        // For now, show info message
        toast.info(`Mengunduh ${filename}...`);
        return { success: true };
        
    } catch (error) {
        console.error('Error downloading attachment:', error);
        toast.error('Gagal mengunduh lampiran');
        throw error;
    }
};