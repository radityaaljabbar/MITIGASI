const { pool } = require('../config/database');
const response = require('../utils/response');
const { validationResult } = require('express-validator');
// const { PythonShell } = require('python-shell');
const { spawn } = require('child_process'); // TAMBAH INI
const path = require('path');

// ADDED: Import dateHelper for MySQL datetime formatting
const { getCurrentMySQLDateTime } = require('../utils/dateHelper');

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
    getLastSemesterIP,
    getNimSKSData,
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
const myReportQueries = require('../models/dosenWaliQueries/myReport_Queries');
const {
    getWellnessResult,
} = require('../models/dosenWaliQueries/myStudent_AnalisisPsikologiQueries');

const {
    fetchStudentsRelief,
    financialResponse,
} = require('../models/dosenWaliQueries/myStudent_AnalisisFinansialQueries');

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
        // console.log(classes);

        if (classes.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No classes found for this dosen',
            });
        }

        // Get all class codes for this dosen
        const classCodesList = classes.map((cls) => cls.kode_kelas);
        // console.log(classCodesList);

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
    const dosenCode = req.user.code;

    if (!dosenCode) {
        return response(400, null, 'Kode dosen tidak ditemukan', res);
    }

    try {
        const data = await myReportQueries.getKeluhan(dosenNIP, dosenCode);
        response(200, data, 'dapat semua keluhan', res);
    } catch (err) {
        console.error('Error fetching keluhan mahasiswa:', err);
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
    const feedbackId = req.query.feedbackId;

    try {
        const data = await myReportQueries.getResponse(dosenNIP, feedbackId);
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

exports.getKeluhanDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return response(400, null, 'ID keluhan diperlukan', res);
        }

        const data = await myReportQueries.getKeluhanDetail(id);

        if (data.status === 'error') {
            return response(404, null, data.message, res);
        }

        response(200, data, 'detail keluhan berhasil diambil', res);
    } catch (err) {
        console.error('Error fetching keluhan detail:', err);
        response(
            500,
            null,
            'tidak dapat mengambil detail keluhan mahasiswa',
            res
        );
    }
};

exports.sendResponDosWal = async (req, res) => {
    try {
        const { id_keluhan, response_keluhan, status_keluhan } = req.body;
        const nip_dosen_wali = req.user.id;

        if (!id_keluhan || !response_keluhan || !status_keluhan) {
            return response(400, null, 'Data tidak lengkap', res);
        }

        const responseData = {
            nip_dosen_wali,
            id_keluhan,
            response_keluhan,
            status_keluhan,
        };

        const result = await myReportQueries.createOrUpdateResponse(
            responseData
        );

        response(
            200,
            result,
            result.payload.operation === 'insert'
                ? 'Response berhasil dibuat'
                : 'Response berhasil diperbarui',
            res
        );
    } catch (err) {
        console.error('Error sending/updating response:', err);
        response(500, null, 'tidak dapat mengirim/memperbarui response', res);
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
        // Ambil id (nim) dari query parameter atau param
        const idParam = req.params.nim;
        const idQuery = req.query.nim;

        const id = idParam || idQuery;
        // console.log(id);

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

/**
 * @desc Get detail mata kuliah untuk rekomendasi mata kuliah
 * @route POST /api/faculty/courseAdvisor/sendRekomendasiMK
 * @access Private (dosen_wali only)
 */
exports.sendCourseRecommendation = async (req, res) => {
    let connection; // Declare connection variable for proper cleanup

    try {
        // Validate request:
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }

        const { nim, courseCodes, targetSemester } = req.body;

        // get kode dosen
        const kodeDosen = req.user.code;

        if (
            !nim ||
            !courseCodes ||
            !Array.isArray(courseCodes) ||
            courseCodes.length === 0 ||
            !targetSemester
        ) {
            return res.status(400).json({
                success: false,
                message: 'Data tidak lengkap atau format tidak valid',
            });
        }

        // Validate targetSemester is a valid number between 1-14
        const semesterNum = parseInt(targetSemester);
        if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 14) {
            return res.status(400).json({
                success: false,
                message: 'Semester tujuan harus berupa angka antara 1-14',
            });
        }

        // Get a connection from the pool for transaction
        connection = await pool.getConnection();

        // Start transaction
        await connection.beginTransaction();

        // Kalkulasi total sks:
        // get value sks pada tiap rekomendasi mk:
        const courseCodePlaceholders = courseCodes.map(() => '?').join(',');
        const [coursesData] = await connection.query(
            `SELECT kode_mk, sks_mk FROM mata_kuliah_baru WHERE kode_mk IN (${courseCodePlaceholders})`,
            courseCodes
        );

        // Validate that all course codes exist
        if (coursesData.length !== courseCodes.length) {
            throw new Error('Some course codes are invalid or not found');
        }

        // Hitung total sksnya:
        const totalSKS = coursesData.reduce((total, course) => {
            return total + (parseInt(course.sks_mk) || 0);
        }, 0);

        // FIXED: Use MySQL-compatible datetime format
        const tanggalDibuat = getCurrentMySQLDateTime();

        // IMPORTANT: Hapus data yang sudah ada agar tidak ada konflik
        // This ensures old recommendations are replaced with new ones
        const [deleteResult] = await connection.execute(
            'DELETE FROM mata_kuliah_rekomendasi WHERE nim_mahasiswa = ? AND kode_dosen = ?',
            [nim, kodeDosen]
        );

        console.log(
            `Deleted ${deleteResult.affectedRows} old recommendations for NIM: ${nim}`
        );

        // Masukan (insert) data ke tabel dengan semester_mahasiswa:
        let insertedCount = 0;
        for (const courseCode of courseCodes) {
            await connection.execute(
                `INSERT INTO mata_kuliah_rekomendasi 
                (kode_mk, kode_dosen, nim_mahasiswa, tanggal_dibuat, total_sks, semester_mahasiswa) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    courseCode,
                    kodeDosen,
                    nim,
                    tanggalDibuat,
                    totalSKS,
                    semesterNum,
                ]
            );
            insertedCount++;
        }

        // Commit the transaction
        await connection.commit();

        console.log(
            `Successfully inserted ${insertedCount} new recommendations for NIM: ${nim}, Semester: ${semesterNum}`
        );

        return res.status(200).json({
            success: true,
            message: 'Rekomendasi mata kuliah berhasil disimpan',
            data: {
                totalSKS: totalSKS,
                count: courseCodes.length,
                tanggal_dibuat: tanggalDibuat,
                nim: nim,
                targetSemester: semesterNum,
                deletedOldRecommendations: deleteResult.affectedRows,
                insertedNewRecommendations: insertedCount,
            },
        });
    } catch (error) {
        // Rollback transaction if there's an error
        if (connection) {
            try {
                await connection.rollback();
                console.log('Transaction rolled back due to error');
            } catch (rollbackError) {
                console.error('Error during rollback:', rollbackError.message);
            }
        }

        console.error('Error in sendCourseRecommendation controller:', error);

        // Return appropriate error message
        let errorMessage = 'Terjadi kesalahan saat menyimpan rekomendasi';

        if (error.message.includes('course codes are invalid')) {
            errorMessage = 'Beberapa kode mata kuliah tidak valid';
        } else if (error.code === 'ER_DUP_ENTRY') {
            errorMessage = 'Data rekomendasi sudah ada';
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    } finally {
        // Always release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
};

exports.getRecommendedCourses = async (req, res) => {
    try {
        const { nim } = req.query;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM Mahasiswa tidak ditemukan',
            });
        }

        // get data dari query dengan semester_mahasiswa:
        const [mataKuliahRekomendasi] = await pool.execute(
            `SELECT mkr.kode_mk,
                    mkb.nama_mk, 
                    mkb.kode_mk AS kode_mk_baru, 
                    mkb.sks_mk, 
                    mkb.jenis_mk,
                    mkr.semester_mahasiswa,
                    mkr.tanggal_dibuat,
                    mkr.total_sks
            FROM mata_kuliah_rekomendasi mkr
            JOIN mata_kuliah_baru mkb ON mkr.kode_mk = mkb.kode_mk
            WHERE mkr.nim_mahasiswa = ?
            ORDER BY mkr.semester_mahasiswa ASC, mkb.nama_mk ASC`,
            [nim]
        );

        // Group data by semester untuk frontend
        const groupedBySemester = mataKuliahRekomendasi.reduce(
            (acc, course) => {
                const semester = course.semester_mahasiswa;
                if (!acc[semester]) {
                    acc[semester] = [];
                }
                acc[semester].push({
                    kode_mk: course.kode_mk,
                    nama_mk: course.nama_mk,
                    sks_mk: course.sks_mk,
                    jenis_mk: course.jenis_mk,
                    semester_target: course.semester_mahasiswa,
                    tanggal_dibuat: course.tanggal_dibuat,
                    total_sks: course.total_sks,
                });
                return acc;
            },
            {}
        );

        return res.status(200).json({
            success: true,
            data: mataKuliahRekomendasi,
            groupedData: groupedBySemester,
            message: 'Berhasil mendapatkan data rekomendasi mata kuliah',
            totalRecommendations: mataKuliahRekomendasi.length,
            semesterCount: Object.keys(groupedBySemester).length,
        });
    } catch (error) {
        console.error('Error mendapatkan rekomendasi mata kuliah:', error);
        return res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan dalam mengambil data rekomendasi mata kuliah',
        });
    }
};

/**
 * @desc Get IP Semester terakhir mahasiswa.
 * @route GET /api/faculty/courseAdvisor/getLastIPSemester
 * @access Private (dosen_wali only)
 */
exports.getLastIPSemester = async (req, res) => {
    try {
        const { nim } = req.query; // atau req.params tergantung mau gimana

        // Validasi input
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM mahasiswa harus diisi',
            });
        }

        // Call service untuk ambil data
        const lastSemesterData = await getLastSemesterIP(nim);

        if (!lastSemesterData) {
            return res.status(404).json({
                success: false,
                message: 'Data IP semester tidak ditemukan untuk mahasiswa ini',
            });
        }

        // Tentukan maksimal SKS berdasarkan IP
        let maxSKS = 24; // default
        const ipSemester = parseFloat(lastSemesterData.ip_semester);

        if (ipSemester > 3.0) {
            maxSKS = 24;
        } else if (ipSemester <= 3.0) {
            maxSKS = 20;
        }

        return res.status(200).json({
            success: true,
            message: 'Data IP semester berhasil diambil',
            data: {
                nim_mahasiswa: lastSemesterData.nim_mahasiswa,
                ip_semester: lastSemesterData.ip_semester,
                semester: lastSemesterData.semester,
                maxSKS: maxSKS,
                lastSemesterData: lastSemesterData,
            },
        });
    } catch (error) {
        console.error('Error in getLastIPSemester controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data IP semester',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * @desc Get IP Semester terakhir mahasiswa.
 * @route GET /api/faculty/courseAdvisor/getLastIPSemester
 * @access Private (dosen_wali only)
 */
exports.getStudentNIMSKS = async (req, res) => {
    try {
        const nim = req.query.nim;
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.',
            });
        }

        const studentData = await getNimSKSData(nim);

        if (!studentData) {
            return res.status(404).json({
                success: false,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data SKS mahasiswa berhasil didapatkan',
            data: {
                sksLulus: studentData.sks_lulus,
                nim: nim,
            },
        });
    } catch (error) {}
};

exports.getStudentAcademicDetails = async (req, res) => {
    try {
        const nim = req.query.nim;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.',
            });
        }

        // Panggil getStudentAcademicData
        const academicDataArray = await getStudentAcademicData(nim);

        // Periksa apakah data mahasiswa ditemukan
        if (!academicDataArray || academicDataArray.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Student not found for NIM: ${nim}`,
            });
        }

        // Ambil data pertama untuk info dasar mahasiswa
        const studentData = academicDataArray[0];

        // Ekstrak nilai dengan default fallbacks
        const namaMahasiswa = studentData.nama || '-';
        const kelasMahasiswa = studentData.kelas || '-';
        const ipk =
            studentData.ipk_lulus != null
                ? parseFloat(studentData.ipk_lulus)
                : 0;
        const sksTotal =
            studentData.sks_lulus != null ? parseInt(studentData.sks_lulus) : 0;
        const tak = studentData.tak != null ? parseInt(studentData.tak) : 0;
        const klas_akademik = studentData.hasil_klasifikasi;

        // Process semester data dengan handling untuk data kosong
        const perSemester = [];
        const semesterMap = new Map(); // Untuk avoid duplicate semester

        academicDataArray.forEach((row) => {
            // Hanya tambahkan jika ada data semester yang valid
            if (row.semester != null && !semesterMap.has(row.semester)) {
                perSemester.push({
                    semester: parseInt(row.semester) || 0,
                    sksSemester:
                        row.sks_semester != null
                            ? parseInt(row.sks_semester)
                            : 0,
                    ipSemester:
                        row.ip_semester != null
                            ? parseFloat(row.ip_semester)
                            : 0,
                });
                semesterMap.set(row.semester, true);
            }
        });

        // Sort semester data
        perSemester.sort((a, b) => a.semester - b.semester);

        // Log untuk debugging
        // console.log('Academic Data Processing:');
        // console.log('- Nama:', namaMahasiswa);
        // console.log('- NIM:', nim);
        // console.log('- Kelas:', kelasMahasiswa);
        // console.log('- IPK:', ipk);
        // console.log('- SKS Total:', sksTotal);
        // console.log('- TAK:', tak);
        // console.log('- hasil klasifikasi', klas_akademik);
        // console.log('- Per Semester Data:', perSemester.length, 'records');

        const responseData = {
            nama: namaMahasiswa,
            nim: nim,
            kelas: kelasMahasiswa,
            ipk: ipk,
            sksTotal: sksTotal,
            tak: tak,
            klas_akademik: klas_akademik,
            perSemester: perSemester,
        };

        return res.status(200).json({
            success: true,
            data: responseData,
            message: 'Student academic data retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getStudentAcademicDetails:', error);

        // Return structured error response
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching student academic details.',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * @desc Controller untuk get hasil psikoligi mahasiswa tertentu
 */
exports.getStudentWellness = async (req, res) => {
    try {
        const nim = req.params.nim;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is not found, make sure it passed correctly',
            });
        }

        const result = await getWellnessResult(nim);

        if (!result || result.length === 0) {
            // Check jika array kosong
            return res.status(200).json({
                success: true,
                message: 'Mahasiswa ini belum mengisi quesioner psikologis',
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data hasil quesioner psikologi berhasil didapatkan',
            data: result,
        });
    } catch (error) {
        console.error('Error mengambil data hasil quesioner psikologi:', error);
        res.status(500).json({
            success: false,
            message:
                'Server error ketika mengambil data hasil quesioner psikologi',
        });
    }
};

exports.getStudentFinancial = async (req, res) => {
    try {
        const nim = req.params.nim;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.', // Pesan lebih spesifik
            });
        }

        // Panggil fetchRelief yang seharusnya mengembalikan semua data yang dibutuhkan
        const financialDataArray = await fetchStudentsRelief(nim); // Pastikan di-await!

        // Periksa apakah data mahasiswa ditemukan
        if (!financialDataArray || financialDataArray.length === 0) {
            return res.status(200).json({
                // 404 Not Found lebih tepat
                success: true,
                message: `Student financial data not found for NIM: ${nim}`,
            });
        }

        // financialDataArray.forEach((row) => {
        //     if (row.semester  !== null) {
        //         // Pastikan ada data semester
        //         perSemester.push({
        //             semester: row.semester
        //         });
        //     }
        // });

        return res.status(200).json({
            success: true,
            data: financialDataArray,
        });
    } catch (error) {
        console.error('Error in get student financial data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching student financial details.',
        });
    }
};

// Controller function untuk menangani approve/reject financial request
exports.sendResponseFinancial = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        // Validasi ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID response finansial diperlukan',
            });
        }

        // Validasi action
        if (!action || !['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Action harus berupa "approve" atau "reject"',
            });
        }

        // Cek apakah record sudah ada (panggil dengan 1 parameter saja)
        const existingRecord = await financialResponse(id); // status = null (default)
        if (existingRecord) {
            return res.status(409).json({
                success: false,
                message: 'Response untuk pengajuan ini sudah ada',
            });
        }

        // Tentukan status dan message berdasarkan action
        const status = action === 'approve' ? 'Disetujui' : 'Ditolak';
        const message =
            action === 'approve'
                ? 'Pengajuan finansial berhasil disetujui'
                : 'Pengajuan finansial berhasil ditolak';

        // Insert response ke database (panggil dengan 2 parameter)
        const result = await financialResponse(id, status);

        return res.status(200).json({
            success: true,
            message: message,
            data: {
                id: result.id,
                id_response_finansial: result.id_response_finansial,
                status: result.status,
                tanggal_dibuat: result.tanggal_dibuat,
                tanggal_diubah: result.tanggal_diubah,
            },
        });
    } catch (error) {
        console.error('Error handling financial action:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat memproses pengajuan',
            error: error.message,
        });
    }
};

/**
 * @desc Controller buat ML
 */
exports.testMLEnvironment = async (req, res) => {
    try {
        console.log('=== Starting ML Test ===');

        let responseAlreadySent = false; // FLAG untuk prevent double response

        const python = spawn('python', [
            '-c',
            'import sys; import joblib; import numpy; import sklearn; print("Python environment OK")',
        ]);

        let output = '';
        let error = '';

        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        python.on('close', (code) => {
            if (responseAlreadySent) return; // Prevent double response
            responseAlreadySent = true;

            clearTimeout(timeoutId); // Clear timeout

            console.log('=== Python completed with code:', code, '===');

            if (code === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Python environment is ready',
                    data: output.trim().split('\n'),
                });
            } else {
                return res.status(503).json({
                    success: false,
                    message: 'Python test failed',
                    error: error,
                });
            }
        });

        // Timeout dengan clear dan flag
        const timeoutId = setTimeout(() => {
            if (responseAlreadySent) return; // Prevent double response
            responseAlreadySent = true;

            python.kill();
            return res.status(500).json({
                success: false,
                error: 'Python process timeout after 10 seconds',
            });
        }, 10000);
    } catch (error) {
        console.error('=== Test Error ===', error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

/**
 * @desc Prediksi status mahasiswa dengan ML
 * POST /api/faculty/predict
 * Body: { akademik, finansial, psikologis }
 */
/**
 * Prediksi berdasarkan NIM mahasiswa + save to database
 * POST /api/faculty/ml/predict/:nim
 * Body: { ipk, skor_psikologi, finansial }
 */
exports.predictStudentByNim = async (req, res) => {
    try {
        const { nim } = req.params;
        const { ipk, skor_psikologi, finansial } = req.body;

        // Validasi input
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required',
            });
        }

        if (
            ipk === undefined ||
            skor_psikologi === undefined ||
            finansial === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Data input tidak lengkap: IPK, Skor Psikologi, Finansial',
            });
        }

        const scriptPath = path.join(__dirname, '../ml_models/predict.py');

        console.log('=== Starting Prediction for NIM:', nim, '===');
        console.log('Input data:', { ipk, skor_psikologi, finansial });

        let responseAlreadySent = false;

        const python = spawn('python', [
            scriptPath,
            ipk,
            skor_psikologi,
            finansial,
        ]);

        let output = '';
        let error = '';

        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        python.on('close', async (code) => {
            if (responseAlreadySent) return;
            responseAlreadySent = true;

            clearTimeout(timeoutId);

            console.log('=== Python completed with code:', code, '===');

            if (code === 0 && output) {
                try {
                    const result = JSON.parse(output.trim());

                    if (result.success) {
                        // === SAVE TO DATABASE ===
                        try {
                            const predicted_status = result.predicted_status;

                            // Use REPLACE INTO to avoid duplicate (delete + insert)
                            // DELETE existing record first
                            const [deleteResult] = await pool.execute(
                                'DELETE FROM klasifikasi_umum WHERE nim = ?',
                                [nim]
                            );

                            console.log(
                                `=== Deleted existing records for NIM ${nim}: ${deleteResult.affectedRows} rows ===`
                            );

                            // INSERT new prediction result
                            const [insertResult] = await pool.execute(
                                'INSERT INTO klasifikasi_umum (nim, hasil_klasifikasi_umum) VALUES (?, ?)',
                                [nim, predicted_status]
                            );

                            console.log(
                                `=== Prediction saved to database: ${nim} -> ${predicted_status} ===`
                            );

                            // Return success response
                            return res.status(200).json({
                                success: true,
                                message: 'Prediction successful and saved',
                                predicted_status: result.predicted_status,
                                confidence: result.confidence,
                                probabilities: result.probabilities,
                                input_data: result.input_data,
                                student_nim: nim,
                                prediction_time: new Date().toISOString(),
                                database_saved: true,
                                database_info: {
                                    deleted_rows: deleteResult.affectedRows,
                                    inserted_rows: insertResult.affectedRows,
                                },
                            });
                        } catch (dbError) {
                            console.error('Database save error:', dbError);

                            // Return prediction result even if database save fails
                            return res.status(200).json({
                                success: true,
                                message:
                                    'Prediction successful but database save failed',
                                predicted_status: result.predicted_status,
                                confidence: result.confidence,
                                probabilities: result.probabilities,
                                input_data: result.input_data,
                                student_nim: nim,
                                prediction_time: new Date().toISOString(),
                                database_saved: false,
                                database_error: dbError.message,
                            });
                        }
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'Prediction failed',
                            error: result.error,
                        });
                    }
                } catch (parseError) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to parse Python output',
                        error: parseError.message,
                        output: output,
                    });
                }
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Python script failed',
                    error: error,
                    exitCode: code,
                });
            }
        });

        // Timeout
        const timeoutId = setTimeout(() => {
            if (responseAlreadySent) return;
            responseAlreadySent = true;

            python.kill();
            return res.status(500).json({
                success: false,
                error: 'Python process timeout after 30 seconds',
            });
        }, 30000);
    } catch (error) {
        console.error('ML Prediction error:', error);
        return res.status(500).json({
            success: false,
            message: 'Prediction error',
            error: error.message,
        });
    }
};
