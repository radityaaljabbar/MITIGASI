import React from 'react';
import { toast } from 'react-toastify';
import studentFinancialData from '../../../../assets/data/mockupjsonDosenWali/MyStudent/AnalisisFinansial/mockupFinansialMahasiswa.json';

// Updated function with better error handling
export const fetchStudentFinancialData = async (nim) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Make sure the data structure exists
                if (
                    !studentFinancialData ||
                    !studentFinancialData.studentsData ||
                    !Array.isArray(studentFinancialData.studentsData)
                ) {
                    console.error(
                        'Invalid data structure:',
                        studentFinancialData
                    );
                    reject(new Error('Invalid data structure in mockup data'));
                    return;
                }

                if (!nim) {
                    // If no NIM is provided, return the first student as default (optional)
                    toast.warning('No NIM provided, showing default student');
                    resolve(studentFinancialData.studentsData[0]);
                    return;
                }

                // Find the student with the matching NIM
                const student = studentFinancialData.studentsData.find(
                    (student) => student && student.nim === nim
                );

                if (!student) {
                    console.error(`Student with NIM ${nim} not found`);
                    toast.error(
                        `Data mahasiswa dengan NIM ${nim} tidak ditemukan`
                    );
                    // Return a safe default object to prevent null reference errors
                    resolve({
                        name: 'Data Tidak Ditemukan',
                        nim: nim,
                        semester: '-',
                        financialStatus: '-',
                        lastUpdated: '-',
                        pendingRequests: [],
                        previousRequests: [],
                    });
                    return;
                }

                // Return the found student data
                resolve(student);
            } catch (error) {
                console.error('Error fetching student data:', error);
                toast.error('Gagal memuat data mahasiswa');
                reject(error);
            }
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
