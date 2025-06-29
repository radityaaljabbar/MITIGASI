// const bcrypt = require('bcryptjs'); // kalau mau menggunakan hashing
const Papa = require('papaparse');

const {
    findAllAdmins,
    createAdmin,
    updateAdminById,
    deleteAdminById,
    findAllDosen,
    createDosen,
    updateDosenByNip,
    deleteDosenByNip,
    findAllMahasiswa,
    createMahasiswa,
    updateMahasiswaByNim,
    deleteMahasiswaByNim,
    findAllKelas,
} = require('../models/adminQueries/kelolaPenggunaQueries');

const {
    findAllWithDosen,
    createKelas,
    updateDosenWaliforKelas,
    deleteKelasById,
} = require('../models/adminQueries/kelolaKelasQueries');

const {
    getAllMahasiswa,
    // findGradesMahasiswaByNIM,
    getAllCourse,
    createNilaiMahasiswa,
    updateNilaiMahasiswa,
    removeNilaiMahasiswa,
    getStudentGrades,
    getNewCourses,
    getEquivalentCourses,
    getOldCoursesNames,
    getOldCourses,
    processCourseHistory,
} = require('../models/adminQueries/kelolaAkademikNilaiQueries');

const {
    getDataPrestasi,
    createDataPrestasi,
    updateDataPrestasi,
    deleteDataPrestasi,
    upsertKlasifikasi,
} = require('../models/adminQueries/kelolaAkademikPrestasiQueries');

const {
    findSemesterMahasiswaByNIM,
    createSemesterMahasiswaByNIM,
    updateSemesterMahasiswaById,
    deleteSemesterMahasiswaById,
} = require('../models/adminQueries/kelolaAkademikSemesterQueries');

const {
    findMataKuliahByKurikulum,
    getAllKurikulum,
    findMataKuliahById,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
    getEkuivalensiOptions,
    getAllKelompokKeahlian,
} = require('../models/adminQueries/kelolaKurikulumQueries');

const { logActivity } = require('../service/logService');

// =============================================
// ==           ADMIN CONTROLLER FUNCTIONS    ==
// =============================================

// GET - mengambil data akun semua admin
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await findAllAdmins();
        res.status(200).json({
            success: true,
            message: 'Data admin berhasil didapatkan',
            data: admins,
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data admin',
        });
    }
};

// POST - create admin baru
exports.createAdmin = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Nama, username, dan password wajib diisi',
        });
    }

    try {
        const newAdminId = await createAdmin({
            name,
            username,
            password: password,
        });

        // LOG SUKSES
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Admin baru: ${name}`,
            target_entity: `Username: ${username}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Admin berhasil ditambahkan',
            data: {
                id: newAdminId,
                name,
                username,
            },
        });
    } catch (error) {
        console.error('Error in createAdmin:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            // LOG GAGAL
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Admin (username duplikat): ${name}`,
                target_entity: `Username: ${username}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan',
            });
        }

        // LOG GAGAL
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Admin: ${name}`,
            target_entity: `Username: ${username}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat admin baru',
        });
    }
};

// PUT - update admin
exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, username, password } = req.body;

    if (!name || !username) {
        return res.status(400).json({
            success: false,
            message: 'Nama dan username wajib diisi',
        });
    }

    try {
        const adminData = { name, username };
        if (password) {
            adminData.password = password;
        }

        const success = await updateAdminById(id, adminData);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Admin (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });
            return res.status(404).json({
                success: false,
                message: `Admin dengan ID ${id} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Admin: ${name}`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });
        res.status(200).json({
            success: true,
            message: `Admin ${name} berhasil diperbarui`,
            data: {
                id: parseInt(id),
                name,
                username,
            },
        });
    } catch (error) {
        console.error('Error in updateAdmin:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Admin (username duplikat)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan oleh pengguna lain',
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Admin`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data admin',
        });
    }
};

// DELETE - hapus admin
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await deleteAdminById(id);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Admin (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Admin dengan ID ${id} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Admin`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });
        res.status(200).json({
            success: true,
            message: `Admin dengan ID ${id} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteAdmin:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Admin`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus admin',
        });
    }
};

// =============================================
// ==      DOSEN WALI CONTROLLER FUNCTIONS    ==
// =============================================

// GET - ambil semua dosen wali
exports.getAllDosen = async (req, res) => {
    try {
        const dosen = await findAllDosen();
        res.status(200).json({
            success: true,
            message: 'Data dosen wali berhasil didapatkan',
            data: dosen,
        });
    } catch (error) {
        console.error('Error in getAllDosen:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data dosen wali',
        });
    }
};

// POST - create dosen wali baru
exports.createDosen = async (req, res) => {
    const { nip, nama, kode, password } = req.body;

    if (!nip || !nama || !kode) {
        return res.status(400).json({
            success: false,
            message: 'NIP, nama, dan kode dosen wajib diisi',
        });
    }

    if (kode.length > 3) {
        return res.status(400).json({
            success: false,
            message: 'Kode dosen maksimal 3 karakter',
        });
    }

    try {
        const finalPassword = password || nip;
        const newDosenNip = await createDosen({
            nip,
            nama,
            kode,
            password: finalPassword,
        });

        // <<< LOGGING SUKSES >>>
        await logActivity({
            req,
            admin: req.user, // didapat dari middleware 'protect'
            action: `Membuat Dosen Wali baru: ${nama}`,
            target_entity: `NIP: ${nip}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Dosen wali berhasil ditambahkan',
            data: {
                nip: newDosenNip,
                nama,
                kode,
            },
        });
    } catch (error) {
        console.error('Error in createDosen:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.message.includes("'nip'")
                ? 'NIP'
                : 'Kode Dosen';

            // <<< LOGGING GAGAL >>>
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Dosen Wali (duplikat): ${nama}`,
                target_entity: `NIP: ${nip} / Kode: ${kode}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `${field} sudah digunakan`,
            });
        }

        // <<< LOGGING GAGAL (UMUM) >>>
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Dosen Wali: ${nama}`,
            target_entity: `NIP: ${nip}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat dosen wali baru',
        });
    }
};

// PUT - update dosen wali
exports.updateDosen = async (req, res) => {
    const { nip } = req.params;
    const { nama, kode, password, status } = req.body;

    if (!nama || !kode || !status) {
        return res.status(400).json({
            success: false,
            message: 'Nama, kode dosen, dan status wajib diisi',
        });
    }

    if (kode.length > 3) {
        return res.status(400).json({
            success: false,
            message: 'Kode dosen maksimal 3 karakter',
        });
    }

    try {
        const dosenData = { nama, kode, status };
        if (password) {
            dosenData.password = password;
        }

        const success = await updateDosenByNip(nip, dosenData);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Dosen Wali (NIP tidak ditemukan)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });
            return res.status(404).json({
                success: false,
                message: `Dosen wali dengan NIP ${nip} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Dosen Wali: ${nama}`,
            target_entity: `NIP: ${nip}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data dosen wali ${nama} berhasil diperbarui`,
            data: {
                nip,
                nama,
                kode,
                status,
            },
        });
    } catch (error) {
        console.error('Error in updateDosen:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Dosen Wali (kode duplikat)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `Kode dosen "${kode}" sudah digunakan oleh dosen lain`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Dosen Wali`,
            target_entity: `NIP: ${nip}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data dosen wali',
        });
    }
};

// DELETE - hapus dosen wali
exports.deleteDosen = async (req, res) => {
    const { nip } = req.params;

    try {
        const success = await deleteDosenByNip(nip);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Dosen Wali (NIP tidak ditemukan)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });
            return res.status(404).json({
                success: false,
                message: `Dosen wali dengan NIP ${nip} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Dosen Wali`,
            target_entity: `NIP: ${nip}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Dosen wali dengan NIP ${nip} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteDosen:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Dosen Wali (masih menjadi wali kelas)`,
                target_entity: `NIP: ${nip}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Dosen ini masih menjadi wali untuk beberapa kelas. Harap hapus relasi kelas terlebih dahulu',
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Dosen Wali`,
            target_entity: `NIP: ${nip}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data dosen wali',
        });
    }
};

// =============================================
// ==      MAHASISWA CONTROLLER FUNCTIONS     ==
// =============================================

// GET - ambil semua mahasiswa
exports.getAllMahasiswa = async (req, res) => {
    try {
        const mahasiswa = await findAllMahasiswa();
        res.status(200).json({
            success: true,
            message: 'Data mahasiswa berhasil didapatkan',
            data: mahasiswa,
        });
    } catch (error) {
        console.error('Error in getAllMahasiswa:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data mahasiswa',
        });
    }
};

// POST - create mahasiswa baru
exports.createMahasiswa = async (req, res) => {
    const { nim, nama, kelas, password } = req.body;

    if (!nim || !nama || !kelas) {
        return res.status(400).json({
            success: false,
            message: 'NIM, nama, dan kelas wajib diisi',
        });
    }

    try {
        const finalPassword = password || nim;
        const newMahasiswaNim = await createMahasiswa({
            nim,
            nama,
            kelas,
            password: finalPassword,
        });

        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Mahasiswa baru: ${nama}`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });
        res.status(201).json({
            success: true,
            message: 'Mahasiswa berhasil ditambahkan',
            data: {
                nim,
                nama,
                kelas,
            },
        });
    } catch (error) {
        console.error('Error in createMahasiswa:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Mahasiswa (NIM duplikat): ${nama}`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `NIM "${nim}" sudah terdaftar`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Mahasiswa: ${nama}`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat mahasiswa baru',
        });
    }
};

// PUT - update mahasiswa
exports.updateMahasiswaByNim = async (req, res) => {
    const { nim } = req.params;
    const { nama, kelas, password, status } = req.body;

    if (!nama || !kelas || !status) {
        return res.status(400).json({
            success: false,
            message: 'Nama, kelas, dan status wajib diisi',
        });
    }

    try {
        const mhsData = { nama, kelas, status };
        if (password) {
            mhsData.password = password;
        }

        const success = await updateMahasiswaByNim(nim, mhsData);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Mahasiswa (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Mahasiswa: ${nama}`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data mahasiswa ${nama} berhasil diperbarui`,
            data: {
                nim,
                nama,
                kelas,
                status,
            },
        });
    } catch (error) {
        console.error('Error in updateMahasiswa:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Mahasiswa`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data mahasiswa',
        });
    }
};

// DELETE - hapus mahasiswa
exports.deleteMahasiswa = async (req, res) => {
    const { nim } = req.params;

    try {
        const success = await deleteMahasiswaByNim(nim);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Mahasiswa (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Mahasiswa`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Mahasiswa dengan NIM ${nim} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteMahasiswa:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Mahasiswa (data terkait masih ada)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Mahasiswa ini masih memiliki data terkait. Harap hapus data terkait terlebih dahulu',
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Mahasiswa`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data mahasiswa',
        });
    }
};

// GET - mendapatkan daftar kelas untuk dropdown
exports.getAllKelas = async (req, res) => {
    try {
        const allKelas = await findAllKelas();
        res.status(200).json({
            success: true,
            message: 'Daftar kelas berhasil didapatkan',
            data: allKelas,
        });
    } catch (error) {
        console.error('Error in getAllKelas:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kelas',
        });
    }
};

// =============================================
// ==         BULK IMPORT FUNCTIONS           ==
// =============================================

// Bulk create mahasiswa from CSV
exports.bulkCreateMahasiswa = async (req, res) => {
    try {
        // Cek keberadaan file.
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File CSV wajib diupload',
            });
        }

        // Parse CSV file
        const csvData = req.file.buffer.toString('utf8');
        const parsed = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase(),
        });

        if (parsed.errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Format CSV tidak valid',
                errors: parsed.errors,
            });
        }

        const records = parsed.data;
        const results = {
            total: records.length,
            created: 0,
            failed: 0,
            errors: [],
        };

        // Process each record
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const rowNumber = i + 2; // +2 because row 1 is header, array starts at 0

            try {
                // Validate required fields
                if (!record.nim || !record.nama || !record.kelas) {
                    throw new Error('NIM, nama, dan kelas wajib diisi');
                }

                // Set default password if empty
                const finalPassword = record.password || record.nim;

                // Use existing createMahasiswa logic
                await createMahasiswa({
                    nim: record.nim.trim(),
                    nama: record.nama.trim(),
                    kelas: record.kelas.trim(),
                    password: finalPassword,
                });

                results.created++;
            } catch (error) {
                results.failed++;
                let errorMessage = 'Unknown error';

                if (error.code === 'ER_DUP_ENTRY') {
                    errorMessage = `NIM "${record.nim}" sudah terdaftar`;
                } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                    errorMessage = `Kelas "${record.kelas}" tidak ditemukan`;
                } else {
                    errorMessage = error.message;
                }

                results.errors.push({
                    row: rowNumber,
                    nim: record.nim || 'N/A',
                    nama: record.nama || 'N/A',
                    error: errorMessage,
                });
            }
        }

        // Log activity
        await logActivity({
            req,
            admin: req.user,
            action: `Bulk import Mahasiswa: ${results.created} berhasil, ${results.failed} gagal`,
            target_entity: `Total: ${results.total} records`,
            status: results.failed === 0 ? 'success' : 'fail',
        });

        res.status(200).json({
            success: true,
            message: `Bulk import selesai: ${results.created} berhasil, ${results.failed} gagal`,
            data: results,
        });
    } catch (error) {
        console.error('Error in bulkCreateMahasiswa:', error);

        await logActivity({
            req,
            admin: req.user,
            action: `Bulk import Mahasiswa: ${results.created} berhasil, ${results.failed} gagal`,
            target_entity: `Total: ${results.total} records`,
            status: results.failed === 0 ? 'success' : 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal memproses bulk import',
            error: error.message,
        });
    }
};

// Bulk create dosen wali from CSV
// exports.bulkCreateDosenWali = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'File CSV wajib diupload',
//             });
//         }

//         // Parse CSV file
//         const csvData = req.file.buffer.toString('utf8');
//         const parsed = Papa.parse(csvData, {
//             header: true,
//             skipEmptyLines: true,
//             transformHeader: (header) => header.trim().toLowerCase(),
//         });

//         if (parsed.errors.length > 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Format CSV tidak valid',
//                 errors: parsed.errors,
//             });
//         }

//         const records = parsed.data;
//         const results = {
//             total: records.length,
//             created: 0,
//             failed: 0,
//             errors: [],
//         };

//         // Process each record
//         for (let i = 0; i < records.length; i++) {
//             const record = records[i];
//             const rowNumber = i + 2; // +2 because row 1 is header, array starts at 0

//             try {
//                 // Validate required fields
//                 if (!record.nip || !record.nama || !record.kode) {
//                     throw new Error('NIP, nama, dan kode dosen wajib diisi');
//                 }

//                 // Validate kode length
//                 if (record.kode.length > 3) {
//                     throw new Error('Kode dosen maksimal 3 karakter');
//                 }

//                 // Set default password if empty
//                 const finalPassword = record.password || record.nip;

//                 // Use existing createDosen logic
//                 await createDosen({
//                     nip: record.nip.trim(),
//                     nama: record.nama.trim(),
//                     kode: record.kode.trim(),
//                     password: finalPassword,
//                 });

//                 results.created++;
//             } catch (error) {
//                 results.failed++;
//                 let errorMessage = 'Unknown error';

//                 if (error.code === 'ER_DUP_ENTRY') {
//                     if (error.message.includes("'nip'")) {
//                         errorMessage = `NIP "${record.nip}" sudah digunakan`;
//                     } else {
//                         errorMessage = `Kode dosen "${record.kode}" sudah digunakan`;
//                     }
//                 } else {
//                     errorMessage = error.message;
//                 }

//                 results.errors.push({
//                     row: rowNumber,
//                     nip: record.nip || 'N/A',
//                     nama: record.nama || 'N/A',
//                     kode: record.kode || 'N/A',
//                     error: errorMessage,
//                 });
//             }
//         }

//         // Log activity
//         await logActivity({
//             req,
//             admin: req.user,
//             action: `Bulk import Dosen Wali: ${results.created} berhasil, ${results.failed} gagal`,
//             target_entity: `Total: ${results.total} records`,
//             status: results.failed === 0 ? 'success' : 'fail',
//         });

//         res.status(200).json({
//             success: true,
//             message: `Bulk import selesai: ${results.created} berhasil, ${results.failed} gagal`,
//             data: results,
//         });
//     } catch (error) {
//         console.error('Error in bulkCreateDosenWali:', error);

//         await logActivity({
//             req,
//             admin: req.user,
//             action: 'Error bulk import Dosen Wali',
//             target_entity: 'Bulk import failed',
//             status: 'fail',
//         });

//         res.status(500).json({
//             success: false,
//             message: 'Gagal memproses bulk import',
//             error: error.message,
//         });
//     }
// };

// =============================================
// ==         KELOLA KELAS FUNCTIONS          ==
// =============================================

exports.getAllKelasforKelas = async (req, res) => {
    try {
        const kelas = await findAllWithDosen();
        res.status(200).json({
            success: true,
            message: 'Data kelas berhasil didapatkan',
            data: kelas,
        });
    } catch (error) {
        console.error('Error in getAllKelas:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data kelas',
        });
    }
};

exports.getDosenList = async (req, res) => {
    try {
        const dosenList = await findAllDosen();
        res.status(200).json({
            success: true,
            message: 'Daftar dosen berhasil didapatkan',
            data: dosenList,
        });
    } catch (error) {
        console.error('Error in getDosenList:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil daftar dosen',
        });
    }
};

exports.createKelas = async (req, res) => {
    const { tahun_angkatan, kode_kelas, kode_dosen } = req.body;

    if (!tahun_angkatan || !kode_kelas) {
        return res.status(400).json({
            success: false,
            message: 'Tahun angkatan dan kode kelas wajib diisi',
        });
    }

    try {
        const kelasData = {
            tahun_angkatan,
            kode_kelas,
            kode_dosen: kode_dosen || null,
        };

        const newKelasId = await createKelas(kelasData);

        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Kelas baru: ${kode_kelas}`,
            target_entity: `ID: ${newKelasId}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Kelas berhasil ditambahkan',
            data: {
                id_kelas: newKelasId,
                ...kelasData,
            },
        });
    } catch (error) {
        console.error('Error in createKelas:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Kelas (kode duplikat): ${kode_kelas}`,
                target_entity: `Kode: ${kode_kelas}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: `Kode kelas "${kode_kelas}" sudah ada`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Kelas: ${kode_kelas}`,
            target_entity: `Kode: ${kode_kelas}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal membuat kelas baru',
        });
    }
};

exports.updateKelas = async (req, res) => {
    const { id } = req.params;
    const { kode_kelas, kode_dosen } = req.body;

    try {
        const newKodeDosen = kode_dosen || null;
        const success = await updateDosenWaliforKelas(id, newKodeDosen);

        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Kelas (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Kelas dengan ID ${id} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate Dosen Wali untuk Kelas ${kode_kelas}`,
            target_entity: `ID Kelas: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Dosen wali untuk kelas ${kode_kelas} berhasil diupdate`,
            data: {
                id_kelas: parseInt(id),
                kode_kelas,
                kode_dosen: newKodeDosen,
            },
        });
    } catch (error) {
        console.error('Error in updateKelas:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Kelas`,
            target_entity: `ID Kelas: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate kelas',
        });
    }
};

exports.deleteKelas = async (req, res) => {
    const { id } = req.params;

    try {
        const success = await deleteKelasById(id);
        if (!success) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Kelas (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Kelas dengan ID ${id} tidak ditemukan`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Kelas`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Kelas dengan ID ${id} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteKelas:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Kelas (masih ada mahasiswa terdaftar)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Masih ada mahasiswa yang terdaftar di kelas ini. Harap pindahkan mereka terlebih dahulu',
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Kelas`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kelas',
        });
    }
};

// =============================================
// ==            KELOLA AKADEMIK              ==
// =============================================

// ============= KELOLA DATA NILAI =============
// ngambil semua data mahasiswa
exports.getAllMahasiswaForKelolaAkademik = async (req, res) => {
    try {
        // Panggil fungsi model untuk mendapatkan data
        // Destructuring [result] karena model mengembalikan array: [{ status: '...', payload: ... }]
        const [result] = await getAllMahasiswa();

        // Cek apakah operasi di model berhasil
        if (result.status === 'success') {
            // Kirim respons 200 OK dengan data mahasiswa
            res.status(200).json({
                success: true,
                message: 'Data semua mahasiswa berhasil diambil',
                data: result.payload, // payload berisi array mahasiswa yang sudah diformat
            });
        } else {
            // Kasus ini seharusnya tidak terjadi jika model selalu throw error,
            // tapi baik untuk penanganan jika ada status 'fail' di masa depan.
            res.status(400).json({
                success: false,
                message: 'Gagal mengambil data mahasiswa',
                data: null,
            });
        }
    } catch (error) {
        // Tangkap error yang di-throw dari model
        console.error('Error in getAllMahasiswa controller:', error);

        // Kirim respons 500 Internal Server Error
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server',
            error: error.message,
        });
    }
};

// ngambil data nilai mahasiswa berdasarkan nim
// exports.getGradesByNIM = async (req, res) => {
//     try {
//         // 1. Ambil NIM dari parameter URL
//         const { nim } = req.params;

//         // 2. Panggil fungsi model untuk mencari data nilai berdasarkan NIM
//         const result = await findGradesMahasiswaByNIM(nim);

//         // 3. Handle kasus di mana model mengembalikan 'null' (data tidak ditemukan)
//         if (result === null) {
//             return res.status(200).json({
//                 success: true,
//                 message: `Belum ada data nilai untuk mahasiswa dengan NIM: ${nim}`,
//                 data: {
//                     nim: nim,
//                     name: null,
//                     kelas: null,
//                     grades: [], // Return array kosong untuk grades
//                 },
//             });
//         }

//         // 4. Handle kasus sukses (model mengembalikan data)
//         const [data] = result;
//         if (data.status === 'success') {
//             const gradeData = data.payload;

//             // 🔧 PERBAIKAN: Cek apakah array grades kosong
//             if (gradeData.grades && Array.isArray(gradeData.grades)) {
//                 if (gradeData.grades.length === 0) {
//                     return res.status(200).json({
//                         success: true,
//                         message: `Belum ada data nilai untuk mahasiswa dengan NIM: ${nim}`,
//                         data: {
//                             nim: nim,
//                             name: gradeData.name,
//                             kelas: gradeData.kelas,
//                             grades: [],
//                         },
//                     });
//                 }
//             }

//             res.status(200).json({
//                 success: true,
//                 message: 'Data nilai berhasil diambil',
//                 data: gradeData, // payload berisi objek { nim, name, kelas, grades: [...] }
//             });
//         }
//     } catch (error) {
//         // 5. Handle error tak terduga dari server atau database
//         console.error('Error in getGradesByNIM controller:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Terjadi kesalahan pada server saat mengambil data nilai',
//             error: error.message,
//         });
//     }
// };

exports.getCourseHistory = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari session
        const { nim } = req.params;

        // Cek dulu kalau id/nim nya ada
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // 1. Ambil data nilai mahasiswa
        const nilaiRows = await getStudentGrades(nim);
        console.log(nilaiRows);
        const dataMahasiswa = {
            nim: nim,
            name: nilaiRows[0].nama,
            kelas: nilaiRows[0].kelas,
        };
        console.log(dataMahasiswa);

        if (nilaiRows.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        // 2. Bikin array kode_mk dari nilai mahasiswa
        const kodeMkSet = new Set(nilaiRows.map((row) => row.kode_mk));
        const arrayKodeMk = [...kodeMkSet];

        // Cek lagi untuk jaga-jaga kalau arraynya kosong
        if (arrayKodeMk.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        // 3. Cari detail matkul di tabel mata_kuliah_baru
        const newCoursesRows = await getNewCourses(arrayKodeMk);

        // 4. Bikin map untuk pencarian cepat matkul baru
        const newCoursesMap = {};
        newCoursesRows.forEach((course) => {
            newCoursesMap[course.kode_mk] = course;
        });

        // 5. Cari kode matkul yang nggak ketemu di tabel matkul baru
        const notFoundKodeMk = arrayKodeMk.filter(
            (kode) => !newCoursesMap[kode]
        );

        // 6. Cari ekivalensi dan matkul lama jika ada yang belum ketemu
        if (notFoundKodeMk.length > 0) {
            // Cek apakah ada matkul lama yang punya ekivalensi di matkul baru
            const equivalentRows = await getEquivalentCourses(notFoundKodeMk);

            // Bikin map buat nyari ekivalensi dengan cepat
            const equivalentMap = {};
            equivalentRows.forEach((course) => {
                equivalentMap[course.ekivalensi] = course;
            });

            // Update daftar yang belum ketemu (yang bener-bener nggak ada ekivalensinya)
            const stillNotFound = notFoundKodeMk.filter(
                (kode) => !equivalentMap[kode]
            );

            // Tambahkan matkul ekivalensi ke map utama
            equivalentRows.forEach((course) => {
                // Map kode lama ke detail matkul baru
                newCoursesMap[course.ekivalensi] = {
                    nama_mk: course.nama_mk,
                    sks_mk: course.sks_mk,
                    jenis_mk: course.jenis_mk,
                    kode_mk_baru: course.kode_mk, // Simpan kode baru untuk ditampilkan
                    is_equivalent: true,
                };
            });

            // Kalau masih ada yang belum ketemu, cari di tabel mata_kuliah_lama
            if (stillNotFound.length > 0) {
                const oldCoursesRows = await getOldCourses(stillNotFound);

                // Tambahkan matkul lama ke map utama
                oldCoursesRows.forEach((course) => {
                    newCoursesMap[course.kode_mk_lama] = {
                        nama_mk_lama: course.nama_mk_lama,
                        sks_mk_lama: course.sks_mk_lama,
                        // Matkul lama nggak punya jenis_mk
                    };
                });
            }
        }

        // Kumpulkan semua kode ekivalensi yang perlu dicari namanya
        const ekivalensiCodes = [];

        // Tambahkan dari matkul yang punya nilai ekivalensi
        newCoursesRows.forEach((course) => {
            if (course.ekivalensi) {
                ekivalensiCodes.push(course.ekivalensi);
            }
        });

        // Tambahkan dari matkul yang sudah ekivalen (kode lama dari nilai)
        arrayKodeMk.forEach((kode) => {
            if (newCoursesMap[kode] && newCoursesMap[kode].is_equivalent) {
                ekivalensiCodes.push(kode);
            }
        });

        // Map untuk menyimpan nama matkul lama berdasarkan kode
        const oldCoursesNamesMap = {};

        // Cari nama matkul lama jika ada kode ekivalensi
        if (ekivalensiCodes.length > 0) {
            const oldCoursesNamesRows = await getOldCoursesNames(
                ekivalensiCodes
            );

            // Buat map untuk nama matkul lama
            oldCoursesNamesRows.forEach((course) => {
                oldCoursesNamesMap[course.kode_mk_lama] = course.nama_mk_lama;
            });
        }

        // 7. Proses dan gabungkan data untuk respons
        const courseHistory = processCourseHistory(
            nilaiRows,
            newCoursesMap,
            oldCoursesNamesMap
        );

        const responseData = {
            nim: nim,
            name: nilaiRows[0].nama,
            kelas: nilaiRows[0].kelas,
            grades: courseHistory,
        };

        return res.status(200).json({
            success: true,
            count: courseHistory.length,
            data: responseData,
        });
    } catch (error) {
        console.error('Error fetching course history:', error);
        return res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan server saat mengambil riwayat mata kuliah',
            error: error.message,
        });
    }
};

// ngambil daftar semua mata kuliah
exports.getAllCourses = async (req, res) => {
    try {
        // 1. Panggil fungsi dari model untuk mengambil data dari database.
        //    Gunakan destructuring [result] karena model mengembalikan array: [{ status: '...', payload: ... }]
        const [result] = await getAllCourse();

        // 2. Periksa status yang dikembalikan oleh model.
        if (result.status === 'success') {
            // 3. Jika berhasil, kirim respons HTTP 200 (OK) dengan data.
            res.status(200).json({
                success: true,
                message: 'Data semua mata kuliah berhasil diambil',
                count: result.payload.length, // Opsional: menambahkan jumlah data yang ditemukan
                data: result.payload,
            });
        }
    } catch (error) {
        // 4. Jika terjadi error (misalnya, database down) yang dilempar oleh model,
        //    tangkap di sini.
        console.error('Error in getAllCourses controller:', error);

        // Kirim respons HTTP 500 (Internal Server Error).
        res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan pada server saat mengambil data mata kuliah',
            error: error.message,
        });
    }
};

// memmbuat data nilai baru
exports.createNilai = async (req, res) => {
    try {
        // 1. Validasi input dasar (memastikan field yang wajib ada tidak kosong)
        const { nimMahasiswa, kodeMK, indeksNilai, semester, tahunAjaran } =
            req.body;
        if (
            !nimMahasiswa ||
            !kodeMK ||
            !indeksNilai ||
            !semester ||
            !tahunAjaran
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Semua field wajib diisi: nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran.',
            });
        }

        // Buat objek baru dengan nama properti yang sesuai dengan kolom database
        const dataForModel = {
            nim_mahasiswa: nimMahasiswa,
            kode_mk: kodeMK,
            indeks_nilai: indeksNilai,
            semester: semester,
            tahun_ajaran: tahunAjaran, // Menambahkan data default
        };

        // 2. Panggil fungsi model dengan data dari body request.
        //    Gunakan destructuring [result] karena model mengembalikan array.
        const [result] = await createNilaiMahasiswa(dataForModel);

        // 3. Jika model berhasil, kirim respons HTTP 201 (Created).
        if (result.status === 'success') {
            await logActivity({
                req,
                admin: req.user,
                action: `Membuat data Nilai baru`,
                target_entity: `NIM: ${nimMahasiswa}, MK: ${kodeMK}`,
                status: 'success',
            });

            res.status(201).json({
                success: true,
                message: 'Data nilai berhasil ditambahkan',
                data: result.payload, // payload berisi data yang baru dibuat, termasuk id_nilai
            });
        }
    } catch (error) {
        // 4. Penanganan Error yang Spesifik dan Umum

        // Kasus: Foreign Key Constraint Fails. Artinya, NIM atau Kode MK yang diberikan
        // tidak ada di tabel referensinya (mahasiswa atau mata_kuliah).
        // Ini adalah kesalahan dari sisi klien (Bad Request).
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Nilai (NIM/MK tidak ada)`,
                target_entity: `NIM: ${nimMahasiswa}, MK: ${kodeMK}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan nilai. Pastikan NIM '${req.body.nim_mahasiswa}' dan Kode MK '${req.body.kode_mk}' sudah terdaftar di sistem.`,
            });
        }

        console.error('Error in createNilai controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Nilai`,
            target_entity: `NIM: ${nimMahasiswa}, MK: ${kodeMK}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat membuat data nilai',
            error: error.message,
        });
    }
};

// edit data nilai
exports.updateNilai = async (req, res) => {
    try {
        // 1. Ambil input dari request
        const { id } = req.params;
        const dataToUpdate = req.body;

        // 2. Lakukan validasi input
        const { kodeMK, indeksNilai, semester, tahunAjaran } = dataToUpdate;
        if (!kodeMK || !indeksNilai || !semester || !tahunAjaran) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Pastikan semua field (kode_mk, indeks_nilai, semester, tahun_ajaran) telah diisi.',
            });
        }

        // 3. Panggil model untuk melakukan update
        const dataForModel = {
            kode_mk: kodeMK,
            indeks_nilai: indeksNilai,
            semester: semester,
            tahun_ajaran: tahunAjaran, // Menambahkan data default
        };
        const [updateResult] = await updateNilaiMahasiswa(id, dataForModel);

        // 4. Periksa apakah ada baris yang diupdate
        if (updateResult.payload.affectedRows === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Nilai (ID tidak ditemukan)`,
                target_entity: `ID Nilai: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data nilai dengan ID ${id} tidak ditemukan.`,
            });
        }

        // 5. Jika berhasil, siapkan data konfirmasi untuk dikirim kembali
        const confirmedData = {
            id_nilai: parseInt(id, 10), // Pastikan ID adalah angka
            ...dataToUpdate,
        };

        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Nilai`,
            target_entity: `ID Nilai: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Data nilai berhasil diupdate',
            data: confirmedData, // Kirim kembali data yang diupdate sebagai konfirmasi
        });
    } catch (error) {
        // 6. Tangani error yang mungkin terjadi

        // Jika error karena foreign key (misal, kode_mk tidak ada)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Nilai (Kode MK tidak ada)`,
                target_entity: `ID Nilai: ${id}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal mengupdate nilai. Kode MK '${req.body.kode_mk}' tidak terdaftar atau tidak valid.`,
            });
        }

        // Untuk semua error server lainnya
        console.error('Error in updateNilai controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Nilai`,
            target_entity: `ID Nilai: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// delete data nilai
exports.deleteNilai = async (req, res) => {
    try {
        // 1. Ambil ID dari parameter URL
        const { id } = req.params;

        // 2. Panggil model untuk menjalankan query DELETE
        const [result] = await removeNilaiMahasiswa(id);

        // 3. Periksa apakah ada baris yang benar-benar dihapus.
        if (result.payload.affectedRows === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Nilai (ID tidak ditemukan)`,
                target_entity: `ID Nilai: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data nilai dengan ID ${id} tidak ditemukan. Tidak ada data yang dihapus.`,
            });
        }

        // 4. Jika berhasil, kirim respons yang menandakan sukses.
        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus data Nilai`,
            target_entity: `ID Nilai: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data nilai berhasil dihapus`,
        });
    } catch (error) {
        // 5. Tangani semua error tak terduga dari server
        console.error('Error in deleteNilai controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Nilai`,
            target_entity: `ID Nilai: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat menghapus data.',
        });
    }
};

// ============= KELOLA DATA PRESTASI =============
// ambil data sks, ipk dan tak
exports.getPrestasiByNIM = async (req, res) => {
    try {
        // 1. Ambil NIM dari parameter URL
        const { nim } = req.params;

        // 2. Panggil model untuk mengambil data
        const result = await getDataPrestasi(nim);

        // 3. Handle kasus "Not Found" (model mengembalikan null)
        if (result === null) {
            return res.status(200).json({
                success: true,
                message: `Belum ada data prestasi untuk mahasiswa dengan NIM ${nim}.`,
                data: null, // Return null murni, bukan object dengan field null
            });
        }

        // 4. Handle kasus sukses (model mengembalikan data)
        const [data] = result;
        if (data.status === 'success') {
            const prestasiData = data.payload;

            // 🔧 PERBAIKAN: Cek apakah semua field penting null
            const isEmptyData =
                (prestasiData.tak === null || prestasiData.tak === undefined) &&
                (prestasiData.ipk === null || prestasiData.ipk === undefined) &&
                (prestasiData.totalSks === null ||
                    prestasiData.totalSks === undefined);

            if (isEmptyData) {
                // Jika semua field null, return null murni
                return res.status(200).json({
                    success: true,
                    message: `Belum ada data prestasi untuk mahasiswa dengan NIM ${nim}.`,
                    data: null,
                });
            }

            // Jika ada data valid, return data normal
            res.status(200).json({
                success: true,
                message: 'Data prestasi berhasil diambil',
                data: prestasiData,
            });
        }
    } catch (error) {
        // 5. Handle error tak terduga dari server
        console.error('Error in getPrestasiByNIM controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// Helper function untuk menentukan klasifikasi berdasarkan IPK
const tentukanKlasifikasi = (ipk) => {
    const nilaiIpk = parseFloat(ipk);
    if (nilaiIpk > 3.0) {
        return 'aman';
    } else if (nilaiIpk >= 2.5 && nilaiIpk <= 3.0) {
        return 'siaga';
    } else {
        return 'bermasalah';
    }
};

// membuat Data Prestasi Baru
exports.createPrestasi = async (req, res) => {
    try {
        // 1. Validasi input dari klien (tanpa 'tanggal_dibuat')
        const { nim, tak, sks_lulus, ipk_lulus } = req.body;
        if (
            !nim ||
            tak === undefined ||
            sks_lulus === undefined ||
            ipk_lulus === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Field nim, tak, sks_lulus, dan ipk_lulus wajib diisi.',
            });
        }

        // 2. Buat objek data untuk dikirim ke model
        //    Gunakan spread operator (...) untuk menggabungkan data dari body
        //    dengan timestamp yang dibuat di sini.
        const dataForModel = {
            ...req.body,
            tanggal_dibuat: new Date(), // Membuat timestamp saat ini
        };

        // 3. Panggil model dengan objek data yang sudah lengkap
        const [result] = await createDataPrestasi(dataForModel);

        // 4. Kirim respons sukses
        if (result.status === 'success') {
            try {
                const hasilKlasifikasi = tentukanKlasifikasi(ipk_lulus);
                await upsertKlasifikasi(nim, hasilKlasifikasi);
                console.log(
                    `Klasifikasi untuk NIM ${nim} berhasil dibuat/diupdate menjadi: ${hasilKlasifikasi}`
                );
            } catch (classificationError) {
                // Jika klasifikasi gagal, cukup log error tanpa menghentikan proses utama.
                // Respons sukses sudah akan dikirim ke user.
                console.error(
                    `Gagal melakukan klasifikasi untuk NIM ${nim}:`,
                    classificationError
                );
            }

            await logActivity({
                req,
                admin: req.user,
                action: `Membuat data Prestasi`,
                target_entity: `NIM: ${nim}`,
                status: 'success',
            });

            res.status(201).json({
                success: true,
                message: 'Data prestasi (TAK dan IPK) berhasil ditambahkan.',
                data: result.payload,
            });
        }
    } catch (error) {
        // Handle error foreign key
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Prestasi (NIM tidak ada)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan prestasi. NIM '${req.body.nim}' tidak terdaftar.`,
            });
        }

        // Handle error umum
        console.error('Error from Prestasi Controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            status: 'error',
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// mengedit data prestasi yang sudah ada
exports.updatePrestasi = async (req, res) => {
    try {
        // Ambil NIM dari URL dan data dari body
        const { nim } = req.params;
        const data = req.body;

        // Validasi input
        if (
            data.tak === undefined ||
            data.sks_lulus === undefined ||
            data.ipk_lulus === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Permintaan tidak valid. Field tak, sks_lulus, dan ipk_lulus wajib diisi.',
            });
        }

        const dataForModel = {
            tak: data.tak,
            sks_lulus: data.sks_lulus,
            ipk_lulus: data.ipk_lulus,
        };
        const [result] = await updateDataPrestasi(nim, dataForModel);

        // Periksa apakah ada baris yang terpengaruh.
        // Jika tidak ada sama sekali, berarti NIM tidak ditemukan.
        const takAffected = result.payload.takResult.affectedRows;
        const ipkAffected = result.payload.ipkResult.affectedRows;

        if (takAffected === 0 && ipkAffected === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Prestasi (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        try {
            const hasilKlasifikasi = tentukanKlasifikasi(data.ipk_lulus);
            await upsertKlasifikasi(nim, hasilKlasifikasi);
            console.log(
                `Klasifikasi untuk NIM ${nim} berhasil diupdate menjadi: ${hasilKlasifikasi}`
            );
        } catch (classificationError) {
            console.error(
                `Gagal melakukan klasifikasi untuk NIM ${nim} saat update:`,
                classificationError
            );
        }

        // Jika berhasil
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data prestasi untuk NIM ${nim} berhasil diupdate.`,
            data: {
                nim: nim,
                ...data,
            },
        });
    } catch (error) {
        // Handle error umum dari server
        console.error('Error from Prestasi Controller (Update):', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// menghapus data IPK TAK SKS mahasiswa
exports.deletePrestasi = async (req, res) => {
    try {
        // Ambil NIM dari parameter URL
        const { nim } = req.params;

        const [result] = await deleteDataPrestasi(nim);

        // Periksa apakah ada baris yang terpengaruh.
        // Jika tidak ada sama sekali di kedua tabel, berarti NIM tidak ditemukan.
        const takAffected = result.payload.takResult.affectedRows;
        const ipkAffected = result.payload.ipkResult.affectedRows;

        if (takAffected === 0 && ipkAffected === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Prestasi (NIM tidak ditemukan)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus data Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data TAK SKS dan IPK berhasil dihapus`,
        });
    } catch (error) {
        // Handle error umum dari server
        console.error('Error from Prestasi Controller (Delete):', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Prestasi`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// ============= KELOLA DATA PERSEMESTER =============
// mengambil data ip dan sks persemester
exports.getSemesterByNIM = async (req, res) => {
    try {
        // 1. Ambil NIM dari parameter URL
        const { nim } = req.params;

        // 2. Panggil model untuk mencari data
        const result = await findSemesterMahasiswaByNIM(nim);

        // 3. Handle kasus "Not Found" (model mengembalikan null)
        if (result === null) {
            return res.status(200).json({
                success: true,
                message: `Belum ada riwayat semester untuk mahasiswa dengan NIM ${nim}.`,
                data: {
                    nim: nim,
                    riwayat_semester: [], // Return array kosong untuk semester
                },
            });
        }

        // 4. Handle kasus "Success" (model mengembalikan objek data)
        // 🔧 PERBAIKAN: Cek apakah array semester kosong
        if (result.riwayat_semester && Array.isArray(result.riwayat_semester)) {
            if (result.riwayat_semester.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: `Belum ada riwayat semester untuk mahasiswa dengan NIM ${nim}.`,
                    data: {
                        nim: nim,
                        riwayat_semester: [],
                    },
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Riwayat semester berhasil diambil.',
            data: result, // 'result' adalah objek yang sudah diformat
        });
    } catch (error) {
        // 5. Handle error tak terduga dari server
        console.error('Error in getSemesterByNIM controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

exports.createSemester = async (req, res) => {
    try {
        // 1. Ambil input dari params dan body
        const { nim } = req.params;
        const {
            ip_semester,
            semester,
            sks_semester,
            tahun_ajaran,
            jenis_semester,
        } = req.body;

        // 2. Validasi input dari body (lebih ringkas)
        if (
            ip_semester === undefined ||
            semester === undefined ||
            sks_semester === undefined ||
            !tahun_ajaran ||
            !jenis_semester
        ) {
            return res.status(400).json({
                success: false, // Menggunakan 'status' agar konsisten
                message:
                    'Permintaan tidak valid. Semua field dalam body wajib diisi.',
            });
        }

        // 3. Siapkan data untuk model (INI YANG PALING PENTING DIPERBAIKI)
        const dataForModel = {
            nim_mahasiswa: nim, // <-- Tambahkan NIM dari params
            ...req.body,
            tanggal_dibuat: new Date(),
        };

        // 4. Panggil model dengan SATU objek data yang lengkap
        const newSemester = await createSemesterMahasiswaByNIM(dataForModel);

        // 5. Kirim respons sukses yang konsisten
        await logActivity({
            req,
            admin: req.user,
            action: `Membuat data Semester`,
            target_entity: `NIM: ${nim}, Semester: ${semester}`,
            status: 'success',
        });

        res.status(201).json({
            success: true,
            message: 'Data semester berhasil ditambahkan.',
            data: newSemester,
        });
    } catch (error) {
        // 6. Handle error yang konsisten

        // Handle error jika NIM tidak ditemukan (foreign key)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat Semester (NIM tidak ada)`,
                target_entity: `NIM: ${nim}`,
                status: 'fail',
            });

            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan data. Mahasiswa dengan NIM '${nim_mahasiswa}' tidak ditemukan.`,
            });
        }

        console.error('Error in createSemester controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat Semester`,
            target_entity: `NIM: ${nim}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// mengedit data persemester
exports.updateSemester = async (req, res) => {
    try {
        const { id } = req.params;
        const dataToUpdate = req.body;

        // Validasi input
        if (
            dataToUpdate.ip_semester === undefined ||
            dataToUpdate.semester === undefined ||
            dataToUpdate.sks_semester === undefined ||
            !dataToUpdate.tahun_ajaran ||
            !dataToUpdate.jenis_semester
        ) {
            return res
                .status(400)
                .json({ success: false, message: 'Semua field wajib diisi.' });
        }

        const dataForModel = {
            ...req.body,
            tanggal_dibuat: new Date(), // <-- Ambil sisa data dari body
        };

        const result = await updateSemesterMahasiswaById(id, dataForModel);

        // Periksa apakah ada baris yang diupdate
        if (result.affectedRows === 0) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update Semester (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data semester dengan ID ${id} tidak ditemukan.`,
            });
        }

        // Jika berhasil, kirim respons sukses
        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate data Semester`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Data semester berhasil diupdate.',
            data: {
                id: parseInt(id, 10),
                dataForModel,
            },
        });
    } catch (error) {
        console.error('Error in updateSemester controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update Semester`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// menghapus data persemester
exports.deleteSemester = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteSemesterMahasiswaById(id);

        // Periksa apakah ada baris yang terhapus
        if (result.affectedRows === 0) {
            // Jika tidak ada, artinya data tidak ditemukan
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus Semester (ID tidak ditemukan)`,
                target_entity: `ID: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: `Data semester dengan ID ${id} tidak ditemukan.`,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus data Semester`,
            target_entity: `ID: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: `Data IP dan SKS semester berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteSemester controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus Semester`,
            target_entity: `ID: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

// =============================================
// ==           KELOLA KURIKULUM              ==
// =============================================

/**
 * Mengambil semua mata kuliah berdasarkan kurikulum
 */
exports.getMataKuliahByKurikulum = async (req, res) => {
    try {
        const { kurikulum } = req.query;
        if (!kurikulum) {
            return res.status(400).json({
                success: false,
                message: 'kurikulum is required as a query parameter.',
            });
        }

        const mataKuliah = await findMataKuliahByKurikulum(kurikulum);

        if (mataKuliah.length === 0) {
            return res.status(200).json({
                success: false,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: mataKuliah.length,
            message: `Data mata kuliah kurikulum ${kurikulum} berhasil diambil`,
            data: mataKuliah,
        });
    } catch (error) {
        console.error('Error in getMataKuliahByKurikulum controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Mengambil semua kurikulum yang tersedia
 */
exports.getAllKurikulum = async (req, res) => {
    try {
        const kurikulumList = await getAllKurikulum();

        if (kurikulumList.length === 0) {
            return res.status(200).json({
                success: false,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data kurikulum berhasil diambil',
            data: kurikulumList,
        });
    } catch (error) {
        console.error('Error in getAllKurikulum controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data kurikulum',
            error: error.message,
        });
    }
};

/**
 * Mengambil list semua kelompok keahlian
 */
exports.getKelompokKeahlianList = async (req, res) => {
    try {
        const kelompokKeahlianList = await getAllKelompokKeahlian();

        if (kelompokKeahlianList.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data kelompok keahlian berhasil diambil',
            data: kelompokKeahlianList,
        });
    } catch (error) {
        console.error('Error in getKelompokKeahlianList controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data kelompok keahlian',
            error: error.message,
        });
    }
};

/**
 * Mengambil mata kuliah berdasarkan ID
 */
exports.getMataKuliahById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID mata kuliah tidak valid',
            });
        }

        const mataKuliah = await findMataKuliahById(parseInt(id));

        if (!mataKuliah) {
            return res.status(200).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
                count: 0,
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data mata kuliah berhasil diambil',
            data: mataKuliah,
        });
    } catch (error) {
        console.error('Error in getMataKuliahById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil data mata kuliah',
            error: error.message,
        });
    }
};

//Menambah mata kuliah baru
exports.createMataKuliah = async (req, res) => {
    try {
        const {
            kode_mk,
            nama_mk,
            sks_mk,
            jenis_mk,
            tingkat,
            jenis_semester,
            semester,
            ekivalensi,
            kurikulum,
            kelompok_keahlian,
        } = req.body;

        // Validasi input required
        if (!kode_mk || !nama_mk || !sks_mk || !jenis_mk || !kurikulum) {
            return res.status(400).json({
                success: false,
                message:
                    'Field kode_mk, nama_mk, sks_mk, jenis_mk, dan kurikulum wajib diisi',
                data: null,
            });
        }

        // Validasi tipe data
        if (isNaN(sks_mk) || isNaN(semester) || isNaN(kurikulum)) {
            return res.status(400).json({
                success: false,
                message: 'SKS, semester, dan kurikulum harus berupa angka',
            });
        }

        // Validasi SKS
        if (sks_mk < 1 || sks_mk > 10) {
            return res.status(400).json({
                success: false,
                message: 'SKS harus antara 1-6',
                data: null,
            });
        }

        // Validasi jenis mata kuliah
        const jenisValid = ['WAJIB PRODI', 'PILIHAN'];
        if (!jenisValid.includes(jenis_mk)) {
            return res.status(400).json({
                success: false,
                message: `Jenis mata kuliah harus salah satu dari: ${jenisValid.join(
                    ', '
                )}`,
                data: null,
            });
        }

        // Validasi jenis semester
        const jenisSemesterValid = ['GANJIL', 'GENAP', 'ANTARA'];
        if (jenis_semester && !jenisSemesterValid.includes(jenis_semester)) {
            return res.status(400).json({
                success: false,
                message: `Jenis semester harus salah satu dari: ${jenisSemesterValid.join(
                    ', '
                )}`,
                data: null,
            });
        }

        // Validasi semester
        if (semester && (semester < 1 || semester > 8)) {
            return res.status(400).json({
                success: false,
                message: 'Semester harus antara 1-8',
                data: null,
            });
        }

        // Validasi tingkat
        if (tingkat && (tingkat < 1 || tingkat > 4)) {
            return res.status(400).json({
                success: false,
                message: 'Tingkat harus antara 1-4',
                data: null,
            });
        }

        // Prepare data
        const mataKuliahData = {
            kode_mk: kode_mk.toUpperCase(),
            nama_mk: nama_mk.trim(),
            sks_mk: parseInt(sks_mk),
            jenis_mk,
            tingkat: tingkat,
            jenis_semester: jenis_semester,
            semester: semester,
            ekivalensi: ekivalensi ? ekivalensi.toUpperCase() : null,
            kurikulum: parseInt(kurikulum),
            kelompok_keahlian: kelompok_keahlian || null,
        };

        // Panggil model untuk create mata kuliah
        const result = await createMataKuliah(mataKuliahData);

        await logActivity({
            req,
            admin: req.user,
            action: `Membuat Mata Kuliah baru: ${nama_mk}`,
            target_entity: `Kode: ${kode_mk}`,
            status: 'success',
        });

        return res.status(201).json({
            success: true,
            message: 'Mata kuliah berhasil ditambahkan',
            data: result,
        });
    } catch (error) {
        console.error('Error in createMataKuliah controller:', error);

        // Handle specific error messages
        if (error.message.includes('sudah ada dalam kurikulum')) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal membuat MK (duplikat): ${nama_mk}`,
                target_entity: `Kode: ${kode_mk}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: error.message,
                data: null,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat membuat MK: ${nama_mk}`,
            target_entity: `Kode: ${kode_mk}`,
            status: 'fail',
        });

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
            data: null,
        });
    }
};

/**
 * Mengupdate mata kuliah berdasarkan ID
 */
exports.updateMataKuliah = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            kode_mk,
            nama_mk,
            sks_mk,
            jenis_mk,
            tingkat,
            jenis_semester,
            semester,
            ekivalensi,
            kurikulum,
            kelompok_keahlian,
        } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID mata kuliah tidak valid',
            });
        }

        // Validasi input wajib
        if (
            !kode_mk ||
            !nama_mk ||
            !sks_mk ||
            !jenis_mk ||
            !semester ||
            !kurikulum
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Data wajib tidak lengkap. Pastikan kode_mk, nama_mk, sks_mk, jenis_mk, semester, dan kurikulum diisi',
            });
        }

        // Validasi tipe data
        if (isNaN(sks_mk) || isNaN(semester) || isNaN(kurikulum)) {
            return res.status(400).json({
                success: false,
                message: 'SKS, semester, dan kurikulum harus berupa angka',
            });
        }

        // Validasi rentang nilai
        if (parseInt(sks_mk) < 1 || parseInt(sks_mk) > 10) {
            return res.status(400).json({
                success: false,
                message: 'SKS harus dalam rentang 1-10',
            });
        }

        if (parseInt(semester) < 1 || parseInt(semester) > 8) {
            return res.status(400).json({
                success: false,
                message: 'Semester harus dalam rentang 1-8',
            });
        }

        const mataKuliahData = {
            kode_mk: kode_mk.trim().toUpperCase(),
            nama_mk: nama_mk.trim(),
            sks_mk: parseInt(sks_mk),
            jenis_mk,
            tingkat: tingkat ? parseInt(tingkat) : 1,
            jenis_semester: jenis_semester || 'Ganjil',
            semester: parseInt(semester),
            ekivalensi:
                ekivalensi && ekivalensi.trim() !== ''
                    ? ekivalensi.trim()
                    : null,
            kurikulum: parseInt(kurikulum),
            kelompok_keahlian: kelompok_keahlian || null,
        };

        const updatedMataKuliah = await updateMataKuliah(
            parseInt(id),
            mataKuliahData
        );

        if (!updatedMataKuliah) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update MK (ID tidak ditemukan)`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Mengupdate Mata Kuliah: ${nama_mk}`,
            target_entity: `ID MK: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Mata kuliah berhasil diupdate',
            data: updatedMataKuliah,
        });
    } catch (error) {
        console.error('Error in updateMataKuliah controller:', error);

        // Handle duplicate error
        if (error.message.includes('sudah ada dalam kurikulum')) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal update MK (duplikat): ${nama_mk}`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat update MK`,
            target_entity: `ID MK: ${id}`,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengupdate mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Menghapus mata kuliah berdasarkan ID
 */
exports.deleteMataKuliah = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID mata kuliah tidak valid',
            });
        }

        // Cek apakah mata kuliah ada
        const existingMataKuliah = await findMataKuliahById(parseInt(id));
        if (!existingMataKuliah) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus MK (ID tidak ditemukan)`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(404).json({
                success: false,
                message: 'Mata kuliah tidak ditemukan',
            });
        }

        const isDeleted = await deleteMataKuliah(parseInt(id));

        if (!isDeleted) {
            await logActivity({
                req,
                admin: req.user,
                action: `Gagal hapus MK setelah ditemukan`,
                target_entity: `ID MK: ${id}`,
                status: 'fail',
            });

            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus mata kuliah',
            });
        }

        await logActivity({
            req,
            admin: req.user,
            action: `Menghapus Mata Kuliah: ${existingMataKuliah.nama_mk}`,
            target_entity: `ID MK: ${id}`,
            status: 'success',
        });

        res.status(200).json({
            success: true,
            message: 'Mata kuliah berhasil dihapus',
            data: {
                id: parseInt(id),
                kode_mk: existingMataKuliah.kode_mk,
                nama_mk: existingMataKuliah.nama_mk,
            },
        });
    } catch (error) {
        console.error('Error in deleteMataKuliah controller:', error);
        await logActivity({
            req,
            admin: req.user,
            action: `Error server saat hapus MK`,
            target_entity: target,
            status: 'fail',
        });

        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam menghapus mata kuliah',
            error: error.message,
        });
    }
};

/**
 * Mengambil opsi mata kuliah untuk ekuivalensi
 * GET http://localhost:5000/api/admin/kelolaKurikulum/getEkuivalensiOptions?kurikulum=2024
 */
exports.getEkuivalensiOptions = async (req, res) => {
    try {
        const { kurikulum } = req.params;
        const currentKurikulum = kurikulum ? parseInt(kurikulum) : null;

        const options = await getEkuivalensiOptions(currentKurikulum);

        if (!options) {
            return res.status(200).json({
                success: false,
                message: 'Opsi ekuivalensi tidak ditemukan',
                count: 0,
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data opsi ekuivalensi berhasil diambil',
            data: options,
        });
    } catch (error) {
        console.error('Error in getEkuivalensiOptions controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan dalam mengambil opsi ekuivalensi',
            error: error.message,
        });
    }
};
