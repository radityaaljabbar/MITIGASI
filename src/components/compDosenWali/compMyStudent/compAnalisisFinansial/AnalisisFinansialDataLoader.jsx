import React from 'react';
import { toast } from 'react-toastify';
import { getFinancialRelief, sendFinancialResponse } from '../../../../services/dosenWali/myStudent/cekAnalisisFinansial';

// Function untuk fetch data finansial mahasiswa
export const fetchStudentFinancialData = async (nim) => {
    try {
        if (!nim) {
            throw new Error('NIM is required');
        }

        console.log('Fetching financial data for NIM:', nim);
        
        // Panggil API service
        const data = await getFinancialRelief(nim);
        
        console.log('Financial data received:', data);
        return data;
        
    } catch (error) {
        console.error('Error fetching student financial data:', error);
        
        // Tampilkan pesan error yang sesuai
        if (error.message.includes('not found') || error.message.includes('404')) {
            toast.error(`Data mahasiswa dengan NIM ${nim} tidak ditemukan`, {
                toastId: `student-not-found-${nim}`,
            });
        } else if (error.message.includes('Authentication') || error.message.includes('token')) {
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
                toastId: 'auth-error',
            });
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            toast.error('Koneksi bermasalah. Periksa koneksi internet Anda.', {
                toastId: 'network-error',
            });
        } else {
            toast.error('Gagal memuat data mahasiswa. Silakan coba lagi.', {
                toastId: 'fetch-error',
            });
        }
        
        // Return struktur data default untuk mencegah error null reference
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

// Function untuk approve request dengan API call
export const approveRequest = async (id) => {
    try {
        if (!id) {
            throw new Error('ID pengajuan diperlukan');
        }

        console.log('Approving financial request with ID:', id);
        
        // Panggil API untuk approve request
        const result = await sendFinancialResponse(id, 'approve');
        
        // Tampilkan pesan sukses
        toast.success('Pengajuan berhasil disetujui', {
            toastId: `approve-success-${id}`,
            position: "top-right",
            autoClose: 3000,
        });
        
        console.log('Approve response:', result);
        return { success: true, data: result };
        
    } catch (error) {
        console.error('Error approving request:', error);
        
        // Tampilkan pesan error yang sesuai
        if (error.message.includes('Authentication') || error.message.includes('token')) {
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
                toastId: 'auth-error',
            });
        } else if (error.message.includes('tidak ditemukan') || error.message.includes('not found')) {
            toast.error('Data pengajuan tidak ditemukan', {
                toastId: `approve-not-found-${id}`,
            });
        } else if (error.message.includes('sudah ada') || error.message.includes('already exists')) {
            toast.error('Response untuk pengajuan ini sudah pernah diberikan', {
                toastId: `approve-exists-${id}`,
            });
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            toast.error('Koneksi bermasalah. Periksa koneksi internet Anda.', {
                toastId: 'network-error',
            });
        } else {
            toast.error('Gagal menyetujui pengajuan. Silakan coba lagi.', {
                toastId: `approve-error-${id}`,
            });
        }
        
        throw error;
    }
};

// Function untuk reject request dengan API call
export const rejectRequest = async (id) => {
    try {
        if (!id) {
            throw new Error('ID pengajuan diperlukan');
        }

        console.log('Rejecting financial request with ID:', id);
        
        // Panggil API untuk reject request
        const result = await sendFinancialResponse(id, 'reject');
        
        // Tampilkan pesan sukses
        toast.success('Pengajuan berhasil ditolak', {
            toastId: `reject-success-${id}`,
            position: "top-right",
            autoClose: 3000,
        });
        
        console.log('Reject response:', result);
        return { success: true, data: result };
        
    } catch (error) {
        console.error('Error rejecting request:', error);
        
        // Tampilkan pesan error yang sesuai
        if (error.message.includes('Authentication') || error.message.includes('token')) {
            toast.error('Sesi Anda telah berakhir. Silakan login kembali.', {
                toastId: 'auth-error',
            });
        } else if (error.message.includes('tidak ditemukan') || error.message.includes('not found')) {
            toast.error('Data pengajuan tidak ditemukan', {
                toastId: `reject-not-found-${id}`,
            });
        } else if (error.message.includes('sudah ada') || error.message.includes('already exists')) {
            toast.error('Response untuk pengajuan ini sudah pernah diberikan', {
                toastId: `reject-exists-${id}`,
            });
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            toast.error('Koneksi bermasalah. Periksa koneksi internet Anda.', {
                toastId: 'network-error',
            });
        } else {
            toast.error('Gagal menolak pengajuan. Silakan coba lagi.', {
                toastId: `reject-error-${id}`,
            });
        }
        
        throw error;
    }
};

// Function untuk download attachment (placeholder)
export const downloadAttachment = async (filename) => {
    try {
        if (!filename) {
            throw new Error('Nama file diperlukan');
        }
       
        // TODO: Implementasi download attachment dari server
        // Sementara tampilkan pesan info
        toast.info(`Mengunduh ${filename}...`, {
            toastId: `download-${filename}`,
            position: "top-right",
            autoClose: 2000,
        });
        
        console.log('Downloading attachment:', filename);
        return { success: true };
        
    } catch (error) {
        console.error('Error downloading attachment:', error);
        toast.error('Gagal mengunduh lampiran', {
            toastId: 'download-error',
        });
        throw error;
    }
};

// Helper function untuk retry mechanism
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            
            // Jangan retry untuk authentication errors
            if (error.message.includes('Authentication') || error.message.includes('token')) {
                throw error;
            }
            
            // Jangan retry untuk client errors (4xx)
            if (error.message.includes('400') || error.message.includes('404') || error.message.includes('409')) {
                throw error;
            }
            
            // Hanya retry untuk server errors atau network issues
            if (i < maxRetries - 1) {
                console.log(`Operation failed, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
    
    throw lastError;
};