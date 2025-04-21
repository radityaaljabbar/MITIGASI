import React from 'react';
import { toast } from 'react-toastify';
import studentFinancialData from '../../../../assets/data/mockupjsonDosenWali/MyStudent/AnalisisFinansial/mockupFinansialMahasiswa.json';

// Nanti disesuaikan dengan API dari backend.
export const fetchStudentFinancialData = async (nim) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            //NIM nanti diambil dari session login user, udah gitu bisa difilter buat ambil data sesuai nimnya:
            //Krna API belum ada skrg make mockup datanya aja dlu
            const data = { ...studentFinancialData.studentData };
            if (nim) {
                data.nim = nim;
            }
            resolve(data);
        }, 1000);
    });
};

export const approveRequest = async (id) => {
    // disini jga bakal call API
    toast.info(`Approving Request ${id}`);
    return { success: true };
};

export const rejectRequest = async (id) => {
    // disini jga bakal call API
    toast.info(`Rejecting Request ${id}`);
    return { success: true };
};

export const downloadAttachment = async (filename) => {
    // disini jga bakal call API
    toast.info(`Downloading ${filename}. . .`);
    return { success: true };
};
