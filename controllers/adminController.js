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

const {
    getAllMahasiswa,
    findGradesMahasiswaByNIM,
    getAllCourse,
    createNilaiMahasiswa,
    updateNilaiMahasiswa,
    removeNilaiMahasiswa
} = require('../models/adminQueries/kelolaAkademikNilaiQueries')

const {
    getDataPrestasi,
    createDataPrestasi,
    updateDataPrestasi,
    deleteDataPrestasi
} = require('../models/adminQueries/kelolaAkademikPrestasiQueries')

const {
    findSemesterMahasiswaByNIM,
    createSemesterMahasiswaByNIM,
    updateSemesterMahasiswaById,
    deleteSemesterMahasiswaById
} = require('../models/adminQueries/kelolaAkademikSemesterQueries')

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
exports.getGradesByNIM = async (req, res) => {
    try {
        // 1. Ambil NIM dari parameter URL
        const { nim } = req.params;

        // 2. Panggil fungsi model untuk mencari data nilai berdasarkan NIM
        const result = await findGradesMahasiswaByNIM(nim);

        // 3. Handle kasus di mana model mengembalikan 'null' (data tidak ditemukan)
        //    Ini adalah error handling yang sangat penting dan spesifik.
        if (result === null) {
            return res.status(404).json({
                success: false,
                message: `Data nilai tidak ditemukan untuk mahasiswa dengan NIM: ${nim}`,
                data: null,
            });
        }

        // 4. Handle kasus sukses (model mengembalikan data)
        //    Kita destructure [data] karena model mengembalikan array: [{ status: 'success', ... }]
        const [data] = result;
        if (data.status === 'success') {
            res.status(200).json({
                success: true,
                message: 'Data nilai berhasil diambil',
                data: data.payload, // payload berisi objek { nim, name, kelas, grades: [...] }
            });
        }
        
    } catch (error) {
        // 5. Handle error tak terduga dari server atau database
        console.error('Error in getGradesByNIM controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat mengambil data nilai',
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
            message: 'Terjadi kesalahan pada server saat mengambil data mata kuliah',
            error: error.message,
        });
    }
};

// memmbuat data nilai baru
exports.createNilai = async (req, res) => {
    try {
        // 1. Validasi input dasar (memastikan field yang wajib ada tidak kosong)
        const { nimMahasiswa, kodeMK, indeksNilai, semester, tahunAjaran } = req.body;
        if (!nimMahasiswa || !kodeMK || !indeksNilai || !semester || !tahunAjaran) {
            return res.status(400).json({
                success: false,
                message: 'Permintaan tidak valid. Semua field wajib diisi: nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran.',
            });
        }

        // Buat objek baru dengan nama properti yang sesuai dengan kolom database
        const dataForModel = {
            nim_mahasiswa: nimMahasiswa,
            kode_mk: kodeMK,
            indeks_nilai: indeksNilai,
            semester: semester,
            tahun_ajaran: tahunAjaran // Menambahkan data default
        };

        // 2. Panggil fungsi model dengan data dari body request.
        //    Gunakan destructuring [result] karena model mengembalikan array.
        const [result] = await createNilaiMahasiswa(dataForModel);

        // 3. Jika model berhasil, kirim respons HTTP 201 (Created).
        if (result.status === 'success') {
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
            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan nilai. Pastikan NIM '${req.body.nim_mahasiswa}' dan Kode MK '${req.body.kode_mk}' sudah terdaftar di sistem.`,
            });
        }

        // Ini adalah kesalahan dari sisi server.
        console.error('Error in createNilai controller:', error);
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
                message: 'Permintaan tidak valid. Pastikan semua field (kode_mk, indeks_nilai, semester, tahun_ajaran) telah diisi.',
            });
        }

        // 3. Panggil model untuk melakukan update
        const dataForModel = {
            kode_mk: kodeMK,
            indeks_nilai: indeksNilai,
            semester: semester,
            tahun_ajaran: tahunAjaran // Menambahkan data default
        };
        const [updateResult] = await updateNilaiMahasiswa(id, dataForModel);

        // 4. Periksa apakah ada baris yang diupdate
        if (updateResult.payload.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Data nilai dengan ID ${id} tidak ditemukan.`,
            });
        }

        // 5. Jika berhasil, siapkan data konfirmasi untuk dikirim kembali
        const confirmedData = {
            id_nilai: parseInt(id, 10), // Pastikan ID adalah angka
            ...dataToUpdate
        };

        res.status(200).json({
            success: true,
            message: 'Data nilai berhasil diupdate',
            data: confirmedData, // Kirim kembali data yang diupdate sebagai konfirmasi
        });
        
    } catch (error) {
        // 6. Tangani error yang mungkin terjadi

        // Jika error karena foreign key (misal, kode_mk tidak ada)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: `Gagal mengupdate nilai. Kode MK '${req.body.kode_mk}' tidak terdaftar atau tidak valid.`,
            });
        }

        // Untuk semua error server lainnya
        console.error('Error in updateNilai controller:', error);
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
            return res.status(404).json({
                success: false,
                message: `Data nilai dengan ID ${id} tidak ditemukan. Tidak ada data yang dihapus.`,
            });
        }
        
        // 4. Jika berhasil, kirim respons yang menandakan sukses.
        res.status(200).json({
            success: true,
            message: `Data nilai berhasil dihapus`,
        });

    } catch (error) {
        // 5. Tangani semua error tak terduga dari server
        console.error('Error in deleteNilai controller:', error);
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
            // ---> BEST PRACTICE RESPONSE #1: NOT FOUND (404)
            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        // 4. Handle kasus sukses (model mengembalikan data)
        const [data] = result;
        if (data.status === 'success') {
            // ---> BEST PRACTICE RESPONSE #2: SUCCESS (200)
            res.status(200).json({
                success: true,
                message: 'Data prestasi berhasil diambil',
                data: data.payload,
            });
        }
    } catch (error) {
        // 5. Handle error tak terduga dari server
        console.error('Error in getPrestasiByNIM controller:', error);
        // ---> BEST PRACTICE RESPONSE #3: INTERNAL SERVER ERROR (500)
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};


// membuat Data Prestasi Baru
exports.createPrestasi = async (req, res) => {
    try {
        // 1. Validasi input dari klien (tanpa 'tanggal_dibuat')
        const { nim, tak, sks_lulus, ipk_lulus } = req.body;
        if (!nim || tak === undefined || sks_lulus === undefined || ipk_lulus === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'Permintaan tidak valid. Field nim, tak, sks_lulus, dan ipk_lulus wajib diisi.' 
            });
        }

        // 2. Buat objek data untuk dikirim ke model
        //    Gunakan spread operator (...) untuk menggabungkan data dari body
        //    dengan timestamp yang dibuat di sini.
        const dataForModel = {
            ...req.body,
            tanggal_dibuat: new Date() // Membuat timestamp saat ini
        };

        // 3. Panggil model dengan objek data yang sudah lengkap
        const [result] = await createDataPrestasi(dataForModel);

        // 4. Kirim respons sukses
        if (result.status === 'success') {
            res.status(201).json({
                success: true,
                message: 'Data prestasi (TAK dan IPK) berhasil ditambahkan.',
                data: result.payload,
            });
        }
    } catch (error) {
        // Handle error foreign key
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan prestasi. NIM '${req.body.nim}' tidak terdaftar.`,
            });
        }
        
        // Handle error umum
        console.error('Error from Prestasi Controller:', error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.' });
    }
};


// mengedit data prestasi yang sudah ada
exports.updatePrestasi = async (req, res) => {
    try {
        // Ambil NIM dari URL dan data dari body
        const { nim } = req.params;
        const data = req.body;

        // Validasi input
        if (data.tak === undefined || data.sks_lulus === undefined || data.ipk_lulus === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'Permintaan tidak valid. Field tak, sks_lulus, dan ipk_lulus wajib diisi.' 
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
            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        // Jika berhasil
        res.status(200).json({
            success: true,
            message: `Data prestasi untuk NIM ${nim} berhasil diupdate.`,
            // Opsional: kirim kembali data yang diupdate sebagai konfirmasi
            data: {
                nim: nim,
                ...data
            }
        });

    } catch (error) {
        // Handle error umum dari server
        console.error('Error from Prestasi Controller (Update):', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
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
            return res.status(404).json({
                success: false,
                message: `Data prestasi untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Data TAK SKS dan IPK berhasil dihapus`,
        });

    } catch (error) {
        // Handle error umum dari server
        console.error('Error from Prestasi Controller (Delete):', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
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
            return res.status(404).json({
                success: false,
                message: `Riwayat semester untuk mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        // 4. Handle kasus "Success" (model mengembalikan objek data)
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
        const { ip_semester, semester, sks_semester, tahun_ajaran, jenis_semester } = req.body;

        // 2. Validasi input dari body (lebih ringkas)
        if (ip_semester === undefined || semester === undefined || sks_semester === undefined || !tahun_ajaran || !jenis_semester) {
            return res.status(400).json({ 
                success: false, // Menggunakan 'status' agar konsisten
                message: 'Permintaan tidak valid. Semua field dalam body wajib diisi.' 
            });
        }

        // 3. Siapkan data untuk model (INI YANG PALING PENTING DIPERBAIKI)
        const dataForModel = {
            nim_mahasiswa: nim, // <-- Tambahkan NIM dari params
            ...req.body,   
            tanggal_dibuat: new Date()
        };

        // 4. Panggil model dengan SATU objek data yang lengkap
        const newSemester = await createSemesterMahasiswaByNIM(dataForModel);

        // 5. Kirim respons sukses yang konsisten
        res.status(201).json({
            success: true,
            message: 'Data semester berhasil ditambahkan.',
            data: newSemester,
        });

    } catch (error) {
        // 6. Handle error yang konsisten

        // Handle error jika NIM tidak ditemukan (foreign key)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                success: false,
                message: `Gagal menambahkan data. Mahasiswa dengan NIM '${nim_mahasiswa}' tidak ditemukan.`,
            });
        }
        
        console.error('Error in createSemester controller:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan pada server.' 
        });
    }
};


// mengedit data persemester
exports.updateSemester = async (req, res) => {
    try {
        const { id } = req.params;
        const dataToUpdate = req.body;

        // Validasi input
        if (dataToUpdate.ip_semester === undefined || dataToUpdate.semester === undefined || dataToUpdate.sks_semester === undefined || !dataToUpdate.tahun_ajaran || !dataToUpdate.jenis_semester) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
        }

        const dataForModel = {
            ...req.body,   
            tanggal_dibuat: new Date()               // <-- Ambil sisa data dari body
        };

        const result = await updateSemesterMahasiswaById(id, dataForModel);

        // Periksa apakah ada baris yang diupdate
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Data semester dengan ID ${id} tidak ditemukan.`,
            });
        }

        // Jika berhasil, kirim respons sukses
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
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
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
            return res.status(404).json({
                success: false,
                message: `Data semester dengan ID ${id} tidak ditemukan.`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Data IP dan SKS semester berhasil dihapus`,
        });

    } catch (error) {
        console.error('Error in deleteSemester controller:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
    }
};