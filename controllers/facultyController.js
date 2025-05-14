const { pool } = require('../config/database');
const response = require('../utils/response');
// Import queries
const responseDosWalModel = require('../models/responseDosenWali');
const {
    getKelasWali,
    getStudentsByClassCodes,
} = require('../models/dosenWaliQueries/myStudent_ListQueries');
const {
    getKelasWaliDosen,
    getStudentInClass,
    getAvailCourses,
} = require('../models/dosenWaliQueries/myCourseAdvisor_Queries');
const {
    fetchStudentTAK,
    fetchStudentSKSTotal,
    fetchStudentIPK,
    getStudentAcademicData,
} = require('../models/dosenWaliQueries/myStudentDetailAcademicQueries');
const {
    getStudentGrades,
    getNewCourses,
    getEquivalentCourses,
    getOldCourses,
    getOldCoursesNames,
    processCourseHistory,
} = require('../models/mahasiswaQueries/myCourseQueries');

// @desc    Get list of students for dosen wali
// @route   GET /api/faculty/listMahasiswa
// @access  Private (dosen_wali only)
exports.getStudentList = async (req, res) => {
    try {
        // Get dosen code from the authenticated user
        const dosenCode = req.user.code;

        // If no dosen code, return error
        if (!dosenCode) {
            return res.status(400).json({
                success: false,
                message: 'Dosen code not found',
            });
        }

        // Get classes associated with this dosen
        const classes = await getKelasWali(dosenCode);

        if (classes.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No classes found for this dosen',
            });
        }

        // Get all class codes for this dosen
        const classCodesList = classes.map((cls) => cls.kode_kelas);

        // Get students from all classes
        const studentList = await getStudentsByClassCodes(classCodesList);

        return res.status(200).json({
            success: true,
            count: studentList.length,
            data: studentList,
        });
    } catch (error) {
        console.error('Error fetching student list:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Get list and data of students report to lecturer
// @route   GET /api/faculty/keluhanMahasiswa
// @access  Private (dosen_wali only)
exports.getKeluhanMahasiswa = async (req, res) => {
    const dosenNIP = req.user.id;

    try {
        const [data] = await responseDosWalModel.getKeluhan(dosenNIP);
        // console.log(dosenNIP);
        response(200, data, 'dapat semua keluhan', res);
    } catch (err) {
        if (err) throw err;
        response(
            500,
            null,
            'tidak dapat mengambil data keluhan mahasiswa wali',
            res
        );
    }
};

// @desc    Get list and data of dosenwali response to students report to lecturer
// @route   GET /api/faculty/responseDosenWali
// @access  Private (dosen_wali only)
exports.getResponDosWal = async (req, res) => {
    const dosenNIP = req.user.id;
    const feedbackId = req.query.feedbackId; // Add this to get the specific feedback ID

    try {
        const [data] = await responseDosWalModel.getResponse(
            dosenNIP,
            feedbackId
        );
        response(200, data, 'dapat semua response', res);
    } catch (err) {
        console.error('Error fetching response:', err);
        response(
            500,
            null,
            'tidak dapat mengambil data response dosen wali',
            res
        );
    }
};

/**
 * @desc Get all classes assigned to the logged-in dosen wali
 * @route GET /api/faculty/courseAdvisor/classesAndStudents
 * @access Private (dosen_wali only)
 */
exports.getClassesAndStudents = async (req, res) => {
    try {
        // Get dosen id (nip) dari middleware:
        const kodeDosen = req.user.code;

        // Klo kode dosen tidak ada error
        if (!kodeDosen) {
            return res.status(400).json({
                success: false,
                message: 'Dosen code not found',
            });
        }

        // Get list kelas wali dari fungsi query:
        const classes = await getKelasWaliDosen(kodeDosen);

        // Cek array classes ada atau tidak
        if (classes.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No classes found for this dosen',
            });
        }

        // Pisahin kode_kelas ke array baru
        const listKodeKelas = classes.map((cls) => cls.kode_kelas);

        // Fetch list mahasiswa berdasarkan kelas:
        const listMahasiswa = await getStudentInClass(listKodeKelas);

        return res.status(200).json({
            success: true,
            countKelas: listKodeKelas.length,
            countMahasiswa: listMahasiswa.length,
            data: {
                classesList: listKodeKelas,
                studentsList: listMahasiswa,
            },
        });
    } catch (error) {
        console.error('Error fetching classes and student list:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * @desc Get riwwayat mata kuliah according dengan nim yang dikirim dari query parameter frontend {. . .?nim}
 * @route GET /api/faculty/courseAdvisor/courseHistory
 * @access Private (dosen_wali only)
 */
exports.getHistoryMKMyCourseAdvisor = async (req, res) => {
    try {
        // Ambil id (nim) dari query parameter
        const id = req.query.nim;
        console.log(id);

        // Cek nim nya ada atau tidak:
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'NIM tidak dapat didapatkan, server error.',
            });
        }
        // 1. Ambil data nilai mahasiswa
        const nilaiRows = await getStudentGrades(id);

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

        return res.status(200).json({
            success: true,
            count: courseHistory.length,
            data: courseHistory,
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

/**
 * @desc Get riwwayat mata kuliah according dengan nim yang dikirim dari query parameter frontend {. . .?nim}
 * @route GET /api/faculty/courseAdvisor/courseHistory
 * @access Private (dosen_wali only)
 */
exports.getAvailableCourse = async (req, res) => {
    try {
        const mataKuliahTersedia = await getAvailCourses();

        if (mataKuliahTersedia.length === 0) {
            return res.status(400).json({
                success: false,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: mataKuliahTersedia.length,
            data: mataKuliahTersedia,
        });
    } catch (error) {
        console.error('Error fetching available courses:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil data mata kuliah',
            error: error.message,
        });
    }
};
exports.getStudentAcademicDetails = async (req, res) => {
    try {
        const nim = req.query.nim;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.', // Pesan lebih spesifik
            });
        }

        // Panggil getStudentAcademicData yang seharusnya mengembalikan semua data yang dibutuhkan
        const academicDataArray = await getStudentAcademicData(nim); // Pastikan di-await!

        // Periksa apakah data mahasiswa ditemukan
        if (!academicDataArray || academicDataArray.length === 0) {
            return res.status(404).json({
                // 404 Not Found lebih tepat
                success: false,
                message: `Student academic data not found for NIM: ${nim}`,
            });
        }

        // Karena kita mencari berdasarkan NIM unik, ambil objek pertama dari array
        const studentData = academicDataArray[0];

        // Ekstrak nilai-nilai yang dibutuhkan dari studentData
        // Ini lebih aman dan langsung dari sumber data yang komprehensif
        const namaMahasiswa = studentData.nama;
        const kelasMahasiswa = studentData.kelas;
        const ipk = studentData.ipk_lulus; // Sesuaikan nama field jika berbeda di DB
        const sksTotal = studentData.sks_lulus; // Sesuaikan nama field jika berbeda di DB
        const tak = studentData.tak; // Sesuaikan nama field jika berbeda di DB
        const perSemester = [];
        // NIM juga ada di studentData.nim, bisa digunakan untuk verifikasi jika perlu

        academicDataArray.forEach((row) => {
            if (row.semester && row.sks_semester !== null) {
                // Pastikan ada data semester
                perSemester.push({
                    semester: row.semester,
                    sksSemester: row.sks_semester,
                    ipSemester: row.ip_semester,
                });
            }
        });

        console.log('Data Mahasiswa Ditemukan (dari getStudentAcademicData):');
        console.log('Nama:', namaMahasiswa);
        console.log('NIM:', nim); // NIM dari input, bisa juga studentData.nim
        console.log('Kelas:', kelasMahasiswa);
        console.log('IPK Lulus:', ipk);
        console.log('SKS Lulus:', sksTotal);
        console.log('TAK:', tak);
        console.log('sks:', perSemester);

        const responseData = {
            nama: namaMahasiswa,
            nim: nim, // Menggunakan nim dari input, atau bisa juga studentData.nim
            kelas: kelasMahasiswa,
            ipk: ipk,
            sksTotal: sksTotal,
            tak: tak,
            perSemester: perSemester,
        };

        return res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        console.error('Error in getStudentAcademicDetails:', error); // Lebih spesifik nama fungsinya
        // Periksa jenis error jika perlu untuk respons yang lebih detail
        // if (error.message.includes("timeout")) { ... }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching student academic details.',
        });
    }
};
