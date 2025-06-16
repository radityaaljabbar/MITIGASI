// STANDARDIZED Admin Controller with consistent response format
// const bcrypt = require('bcryptjs'); // kalau mau menggunakan hashing

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
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan',
            });
        }
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
            return res.status(404).json({
                success: false,
                message: `Admin dengan ID ${id} tidak ditemukan`,
            });
        }

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
            return res.status(409).json({
                success: false,
                message: 'Username sudah digunakan oleh pengguna lain',
            });
        }
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
            return res.status(404).json({
                success: false,
                message: `Admin dengan ID ${id} tidak ditemukan`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Admin dengan ID ${id} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteAdmin:', error);
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
            return res.status(409).json({
                success: false,
                message: `${field} sudah digunakan`,
            });
        }
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
            return res.status(404).json({
                success: false,
                message: `Dosen wali dengan NIP ${nip} tidak ditemukan`,
            });
        }

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
            return res.status(409).json({
                success: false,
                message: `Kode dosen "${kode}" sudah digunakan oleh dosen lain`,
            });
        }
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
            return res.status(404).json({
                success: false,
                message: `Dosen wali dengan NIP ${nip} tidak ditemukan`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Dosen wali dengan NIP ${nip} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteDosen:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Dosen ini masih menjadi wali untuk beberapa kelas. Harap hapus relasi kelas terlebih dahulu',
            });
        }
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
            return res.status(409).json({
                success: false,
                message: `NIM "${nim}" sudah terdaftar`,
            });
        }
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
            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
            });
        }

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
            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Mahasiswa dengan NIM ${nim} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteMahasiswa:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Mahasiswa ini masih memiliki data terkait. Harap hapus data terkait terlebih dahulu',
            });
        }
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
            return res.status(409).json({
                success: false,
                message: `Kode kelas "${kode_kelas}" sudah ada`,
            });
        }
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
            return res.status(404).json({
                success: false,
                message: `Kelas dengan ID ${id} tidak ditemukan`,
            });
        }

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
            return res.status(404).json({
                success: false,
                message: `Kelas dengan ID ${id} tidak ditemukan`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Kelas dengan ID ${id} berhasil dihapus`,
        });
    } catch (error) {
        console.error('Error in deleteKelas:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message:
                    'Gagal menghapus. Masih ada mahasiswa yang terdaftar di kelas ini. Harap pindahkan mereka terlebih dahulu',
            });
        }
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kelas',
        });
    }
};

// ==============================================
//?==         KELOLA KURIKULUM ROUTES          ==
// ==============================================

// ==========================================
//?==         KELOLA NILAI ROUTES          ==
// ==========================================
