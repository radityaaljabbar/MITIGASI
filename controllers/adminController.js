const response = require('../utils/response');

// ADDED: Import dateHelper for MySQL datetime formatting
const { getCurrentMySQLDateTime } = require('../utils/dateHelper');
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
    findAllKelas
} = require('../models/adminQueries/kelolaPenggunaQueries')

const {
    findAllWithDosen,
    createKelas,
    updateDosenWaliforKelas,
    deleteKelasById,
} = require('../models/adminQueries/kelolaKelasQueries')

// mengambil data akun semua admin
exports.getAllAdmins = async (req, res) => {
    try {
        // Langsung panggil fungsinya
        const admins = await findAllAdmins();
        response(200, admins, 'dapat semua admin', res);
        console.log(admins)
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: "Gagal mengambil data admin." });
    }
}
;

// create Atmin ketika menggunakan hashing
// exports.createAdmin = async (req, res) => {
//     const { name, username, password } = req.body;
//     if (!name || !username || !password) {
//         return res.status(400).json({ message: 'Nama, username, dan password wajib diisi.' });
//     }

//     try {
//         // Hashing password sebelum disimpan
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newAdminId = await createAdmin({ name, username, password: hashedPassword });
//         res.status(201).json({ id: newAdminId, name, username });
//     } catch (error) {
//         console.error('Error in createAdmin:', error);
//         // Tangani error duplikasi username (jika ada unique constraint)
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({ message: 'Username sudah digunakan.' });
//         }
//         res.status(500).json({ message: 'Gagal membuat admin baru.' });
//     }
// };

// create Atmin ketika tidak menggunakan hashing
exports.createAdmin = async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ message: 'Nama, username, dan password wajib diisi.' });
    }

    try {
        // Langsung gunakan password dari request body tanpa hashing
        const newAdminId = await createAdmin({ name, username, password: password });
        
        res.status(201).json({ id: newAdminId, name, username });
    } catch (error) {
        console.error('Error in createAdmin:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username sudah digunakan.' });
        }
        res.status(500).json({ message: 'Gagal membuat admin baru.' });
    }
};

exports.updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, username, password } = req.body;
    if (!name || !username) {
        return res.status(400).json({ message: 'Nama dan username wajib diisi.' });
    }

    try {
        const adminData = { name, username, password };

        // // Jika ada password baru, hash terlebih dahulu (Jika Menggunakan hashing)
        // if (password) {
        //     const salt = await bcrypt.genSalt(10);
        //     adminData.password = await bcrypt.hash(password, salt);
        // }

        const success = await updateAdminById(id, adminData);
        if (!success) {
            return res.status(404).json({ message: `Admin dengan ID ${id} tidak ditemukan.` });
        }
        res.status(200).json({ message: `Admin (${name}) berhasil diperbarui.` });
    } catch (error) {
        console.error('Error in updateAdmin:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username sudah digunakan oleh pengguna lain.' });
        }
        res.status(500).json({ message: 'Gagal memperbarui data admin.' });
    }
};

exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await deleteAdminById(id);
        if (!success) {
            return res.status(404).json({ message: `Admin dengan ID ${id} tidak ditemukan.` });
        }
        res.status(200).json({ message: `Admin dengan ID ${id} berhasil dihapus.` });
    } catch (error) {
        console.error('Error in deleteAdmin:', error);
        res.status(500).json({ message: 'Gagal menghapus admin.' });
    }
};


// =============================================
// ==      DOSEN WALI CONTROLLER FUNCTIONS    ==
// =============================================

exports.getAllDosen = async (req, res) => {
    // Tidak ada perubahan
    try {
        const dosen = await findAllDosen();
        res.status(200).json(dosen);
    } catch (error) {
        console.error('Error in getAllDosen:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil data dosen.' });
    }
};

// // Menggunakan hashing
// exports.createDosen = async (req, res) => {
//     const { nip, nama, kode, password } = req.body;
//     if (!nip || !nama || !kode) {
//         return res.status(400).json({ message: 'NIP, nama, dan kode dosen wajib diisi.' });
//     }
//     if (kode.length > 3) {
//         return res.status(400).json({ message: 'Kode dosen maksimal 3 karakter.' });
//     }

//     try {
//         // Jika password tidak diisi, gunakan NIP sebagai default
//         const passwordToHash = password || nip;
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(passwordToHash, salt);

//         const newDosenNip = await createDosen({ nip, nama, kode, password: hashedPassword });
//         res.status(201).json({ nip: newDosenNip, nama, kode });
//     } catch (error) {
//         console.error('Error in createDosen:', error);
//         if (error.code === 'ER_DUP_ENTRY') {
//             const field = error.message.includes("'nip'") ? 'NIP' : 'Kode Dosen';
//             return res.status(409).json({ message: `${field} sudah digunakan.` });
//         }
//         res.status(500).json({ message: 'Gagal membuat dosen wali baru.' });
//     }
// };

exports.createDosen = async (req, res) => {
    const { nip, nama, kode, password } = req.body;
    if (!nip || !nama || !kode) {
        return res.status(400).json({ message: 'NIP, nama, dan kode dosen wajib diisi.' });
    }

    try {
        // Jika password tidak diisi, gunakan NIP sebagai default (tanpa hash)
        const finalPassword = password || nip;

        const newDosenNip = await createDosen({ nip, nama, kode, password: finalPassword });
        response(200, newDosenNip, 'Data dosen wali telah ditambahkan', res);
    } catch (error) {
        console.error('Error in createDosen:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.message.includes("'nip'") ? 'NIP' : 'Kode Dosen';
            return res.status(409).json({ message: `${field} sudah digunakan.` });
        }
        res.status(500).json({ message: 'Gagal membuat dosen wali baru.' });
    }
};

exports.updateDosen = async (req, res) => {
    const { nip } = req.params;
    const { nama, kode, password, status } = req.body;

    // --- Validasi Input ---
    if (!nama || !kode || !status) {
        return res.status(400).json({ message: 'Nama dan kode dosen wajib diisi.' });
    }
    if (kode.length > 3) {
        return res.status(400).json({ message: 'Kode dosen maksimal 3 karakter.' });
    }

    try {
        const dosenData = { nama, kode, status };
        // Jika password diisi, tambahkan ke data yang akan di-update
        if (password) {
            dosenData.password = password;
        }

        // --- Panggil Model Query ---
        const success = await updateDosenByNip(nip, dosenData);

        if (!success) {
            return res.status(404).json({ message: `Dosen Wali dengan NIP ${nip} tidak ditemukan.` });
        }
        
        res.status(200).json({ message: `Data Dosen Wali ${nama} berhasil diperbarui.` });
    } catch (error) {
        console.error('Error in updateDosen:', error);
        // --- Error Handling Spesifik ---
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Kode Dosen "${kode}" sudah digunakan oleh dosen lain.` });
        }
        res.status(500).json({ message: 'Gagal memperbarui data dosen wali.' });
    }
};

exports.deleteDosen = async (req, res) => {
    const { nip } = req.params;
    try {
        // --- Panggil Model Query ---
        const success = await deleteDosenByNip(nip);
        
        if (!success) {
            return res.status(404).json({ message: `Dosen Wali dengan NIP ${nip} tidak ditemukan.` });
        }
        
        res.status(200).json({ message: `Dosen Wali dengan NIP ${nip} berhasil dihapus.` });
    } catch (error) {
        console.error('Error in deleteDosen:', error);
        // --- Error Handling Spesifik (jika ada Foreign Key Constraint) ---
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(409).json({ 
                message: `Gagal menghapus. Dosen ini masih menjadi wali untuk beberapa kelas. Harap hapus relasi kelas terlebih dahulu.` 
            });
        }
        res.status(500).json({ message: 'Gagal menghapus data dosen wali.' });
    }
};


// =============================================
// ==      MAHASISWA CONTROLLER FUNCTIONS     ==
// =============================================

exports.getAllMahasiswa = async (req, res) => {
    try {
        const mahasiswa = await findAllMahasiswa();
        res.status(200).json(mahasiswa);
    } catch (error) {
        console.error('Error in getAllMahasiswa:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil data mahasiswa.' });
    }
};


exports.createMahasiswa = async (req, res) => {
    const { nim, nama, kelas, password } = req.body;

    // --- Validasi Input ---
    if (!nim || !nama || !kelas) {
        return res.status(400).json({ message: 'NIM, nama, dan kelas wajib diisi.' });
    }

    try {
        // Jika password tidak diisi, gunakan NIM sebagai default (tanpa hash)
        const finalPassword = password || nim;

        // --- Panggil Model Query ---
        const newMahasiswaNim = await createMahasiswa({ nim, nama, kelas, password: finalPassword });
        
        res.status(201).json({ nim: newMahasiswaNim, nama, kelas });
    } catch (error) {
        console.error('Error in createMahasiswa:', error);
        // --- Error Handling Spesifik ---
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `NIM "${nim}" sudah terdaftar.` });
        }
        res.status(500).json({ message: 'Gagal membuat mahasiswa baru.' });
    }
};


exports.updateMahasiswaByNim = async (req, res) => {
    const { nim } = req.params;
    const { nama, kelas, password, status } = req.body;

    // --- Validasi Input ---
    if (!nama || !kelas || !status) {
        return res.status(400).json({ message: 'Nama dan kelas wajib diisi.' });
    }

    try {
        const mhsData = { nama, kelas, status };
        // Jika password diisi, tambahkan ke data yang akan di-update
        if (password) {
            mhsData.password = password;
        }

        // --- Panggil Model Query ---
        const success = await updateMahasiswaByNim(nim, mhsData);

        if (!success) {
            return res.status(404).json({ message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.` });
        }
        
        res.status(200).json({ message: `Data mahasiswa ${nama} (NIM: ${nim}) berhasil diperbarui.` });
    } catch (error) {
        console.error('Error in updateMahasiswa:', error);
        res.status(500).json({ message: 'Gagal memperbarui data mahasiswa.' });
    }
};


exports.deleteMahasiswa = async (req, res) => {
    const { nim } = req.params;
    try {
        // --- Panggil Model Query ---
        const success = await deleteMahasiswaByNim(nim);
        
        if (!success) {
            return res.status(404).json({ message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.` });
        }
        
        res.status(200).json({ message: `Mahasiswa dengan NIM ${nim} berhasil dihapus.` });
    } catch (error) {
        console.error('Error in deleteMahasiswa:', error);
        // --- Error Handling Spesifik untuk Foreign Key ---
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(409).json({ 
                message: `Gagal menghapus. Mahasiswa ini masih memiliki data terkait (misalnya data nilai, keluhan, atau IPK). Harap hapus data terkait terlebih dahulu.` 
            });
        }
        res.status(500).json({ message: 'Gagal menghapus data mahasiswa.' });
    }
};


// mendapatkan kelas untuk list kelas di kelola data mahasiswa
exports.getAllKelas = async (req, res) => {
    try {
        const allKelas = await findAllKelas();
        response(200, allKelas, 'dapat semua list kelas', res);
    } catch (error) {
        console.error('Error in getAllKelas:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengambil data kelas.' });
    }
};


// ------------------------- KELOLA KELAS ------------------------- \

exports.getAllKelasforKelas = async (req, res) => {
    try {
        const kelas = await findAllWithDosen();
        res.status(200).json(kelas);
    } catch (error) {
        console.error('Error in getAllKelas:', error);
        res.status(500).json({ message: 'Failed to retrieve class data.' });
    }
};


exports.getDosenList = async (req, res) => {
    try {
        const dosenList = await findAllDosen();
        res.status(200).json(dosenList);
    } catch (error) {
        console.error('Error in getDosenList:', error);
        res.status(500).json({ message: 'Failed to retrieve lecturer list.' });
    }
};


exports.createKelas = async (req, res) => {
    const { tahun_angkatan, kode_kelas, kode_dosen } = req.body;

    // --- Input Validation ---
    if (!tahun_angkatan || !kode_kelas) {
        return res.status(400).json({ message: 'Tahun Angkatan and Kode Kelas are required.' });
    }

    try {
        // Prepare data for the model. Ensure kode_dosen is null if it's an empty string.
        const kelasData = {
            tahun_angkatan,
            kode_kelas,
            kode_dosen: kode_dosen || null
        };
        
        const newKelasId = await createKelas(kelasData);
        res.status(201).json({ id_kelas: newKelasId, ...kelasData });
    } catch (error) {
        console.error('Error in createKelas:', error);
        // --- Specific Error Handling ---
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `The class code "${kode_kelas}" already exists.` });
        }
        res.status(500).json({ message: 'Failed to create a new class.' });
    }
};


exports.updateKelas = async (req, res) => {
    const { id } = req.params;
    const { kode_kelas, kode_dosen } = req.body; // We only expect the lecturer code for updates

    try {
        const newKodeDosen = kode_dosen || null;
        const success = await updateDosenWaliforKelas(id, newKodeDosen);

        if (!success) {
            return res.status(404).json({ message: `Class with code ${kode_kelas} not found.` });
        }
        
        res.status(200).json({ message: `Dosewn wali untuk kelas ${kode_kelas} berhasil diupdate.` });
    } catch (error) {
        console.error('Error in updateKelas:', error);
        res.status(500).json({ message: 'Failed to update the class.' });
    }
};


exports.deleteKelas = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await deleteKelasById(id);
        
        if (!success) {
            return res.status(404).json({ message: `Class with ID ${id} not found.` });
        }
        
        res.status(200).json({ message: `Class with ID ${id} has been successfully deleted.` });
    } catch (error)
    {
        console.error('Error in deleteKelas:', error);
        // Handle foreign key constraint error if a student is still in this class
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(409).json({ 
                message: `Cannot delete. Students are still assigned to this class. Please reassign them first.` 
            });
        }
        res.status(500).json({ message: 'Failed to delete the class.' });
    }
};