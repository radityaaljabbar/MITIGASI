// Faculty Controller - Pengontrol untuk fitur dosen wali dalam sistem akademik
// Faculty Controller for lecturer supervisor features in academic system
const { pool } = require('../config/database');
const response = require('../utils/response');
const { validationResult } = require('express-validator');
// const { PythonShell } = require('python-shell'); // Optional: untuk integrasi Python jika diperlukan
const { spawn } = require('child_process'); // Untuk menjalankan proses eksternal / For running external processes
const path = require('path');

// Import helper untuk formatting tanggal MySQL
// Import helper for MySQL date formatting
const { getCurrentMySQLDateTime } = require('../utils/dateHelper');

// Import model queries untuk berbagai fitur dosen wali
// Import model queries for various lecturer supervisor features
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
const lampiranMyReportQueries = require('../models/dosenWaliQueries/lampiranMyReport_Queries');
const {
    getWellnessResult,
} = require('../models/dosenWaliQueries/myStudent_AnalisisPsikologiQueries');

const {
    fetchStudentsRelief,
    financialResponse,
} = require('../models/dosenWaliQueries/myStudent_AnalisisFinansialQueries');

// Import utility untuk upload file ke cloud storage
// Import utility for cloud storage file upload
const { uploadFile } = require('../utils/cloudStorage');

/**
 * Mengambil daftar mahasiswa yang menjadi wali kelas dosen
 * Get list of students under lecturer's supervision
 * @desc    Get list of students for dosen wali
 * @route   GET /api/faculty/listMahasiswa
 * @access  Private (dosen_wali only)
 */
exports.getStudentList = async (req, res) => {
    try {
        // Ambil kode dosen dari user yang sudah terautentikasi
        // Get lecturer code from authenticated user
        const dosenCode = req.user.code;

        // Validasi keberadaan kode dosen
        // Validate lecturer code existence
        if (!dosenCode) {
            return res.status(400).json({
                success: false,
                message: 'Dosen code not found',
            });
        }

        // Ambil kelas-kelas yang diampu oleh dosen wali ini
        // Get classes supervised by this lecturer
        const classes = await getKelasWali(dosenCode);

        // Handle jika tidak ada kelas yang diampu
        // Handle if no classes are supervised
        if (classes.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No classes found for this dosen',
            });
        }

        // Ekstrak semua kode kelas untuk query mahasiswa
        // Extract all class codes for student query
        const classCodesList = classes.map((cls) => cls.kode_kelas);

        // Ambil semua mahasiswa dari kelas-kelas tersebut
        // Get all students from those classes
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

/**
 * Mengambil daftar keluhan mahasiswa yang ditujukan ke dosen wali
 * Get list of student complaints directed to lecturer supervisor
 * @desc    Get list and data of students report to lecturer
 * @route   GET /api/faculty/keluhanMahasiswa
 * @access  Private (dosen_wali only)
 */
exports.getKeluhanMahasiswa = async (req, res) => {
    const dosenNIP = req.user.id;
    const dosenCode = req.user.code;

    // Validasi kode dosen untuk akses data
    // Validate lecturer code for data access
    if (!dosenCode) {
        return response(400, null, 'Kode dosen tidak ditemukan', res);
    }

    try {
        // Ambil semua keluhan mahasiswa untuk dosen wali ini
        // Get all student complaints for this lecturer supervisor
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

/**
 * Mengambil respons dosen wali terhadap keluhan mahasiswa
 * Get lecturer supervisor responses to student complaints
 * @desc    Get list and data of dosenwali response to students report to lecturer
 * @route   GET /api/faculty/responseDosenWali
 * @access  Private (dosen_wali only)
 */
exports.getResponDosWal = async (req, res) => {
    const dosenNIP = req.user.id;
    const feedbackId = req.query.feedbackId;

    try {
        // Ambil respons dosen wali berdasarkan NIP dan feedback ID
        // Get lecturer supervisor response based on NIP and feedback ID
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

/**
 * Mengambil detail keluhan mahasiswa berdasarkan ID
 * Get student complaint details by ID
 * @desc    GET - mengambil detail keluhan mahasiswa
 * @route   GET /api/faculty/keluhan/:id
 * @access  Private (dosen_wali only)
 */
exports.getKeluhanDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Validasi parameter ID keluhan
        // Validate complaint ID parameter
        if (!id) {
            return response(400, null, 'ID keluhan diperlukan', res);
        }

        // Ambil detail keluhan dari database
        // Get complaint details from database
        const data = await myReportQueries.getKeluhanDetail(id);

        // Handle jika keluhan tidak ditemukan
        // Handle if complaint not found
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

/**
 * Mengirim atau memperbarui respons dosen wali terhadap keluhan mahasiswa
 * Send or update lecturer supervisor response to student complaints
 * @desc    POST - mengirim respons dosen wali dengan lampiran file
 * @route   POST /api/faculty/responseDosenWali
 * @access  Private (dosen_wali only)
 */
exports.sendResponDosWal = async (req, res) => {
    try {
        const { id_keluhan, response_keluhan, status_keluhan } = req.body;
        const nip_dosen_wali = req.user.id;

        // Validasi input yang diperlukan
        // Validate required inputs
        if (!id_keluhan || !response_keluhan || !status_keluhan) {
            return response(400, null, 'Data tidak lengkap', res);
        }

        // Siapkan data respons untuk disimpan
        // Prepare response data for saving
        const responseData = {
            nip_dosen_wali,
            id_keluhan,
            response_keluhan,
            status_keluhan,
        };

        // Buat atau update respons terlebih dahulu
        // Create or update response first
        const result = await myReportQueries.createOrUpdateResponse(
            responseData
        );
        const id_response = result.payload.id;

        // Handle upload file lampiran jika ada
        // Handle attachment file upload if present
        let fileData = null;
        if (req.file) {
            try {
                // Set timeout untuk operasi upload (30 detik)
                // Set timeout for upload operation (30 seconds)
                const uploadPromise = uploadFile(req.file, 'report-lampiran');
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error('File upload timeout')),
                        30000
                    )
                );

                // Race antara upload dan timeout
                // Race between upload and timeout
                fileData = await Promise.race([uploadPromise, timeoutPromise]);

                // Simpan metadata file ke database
                // Save file metadata to database
                await lampiranMyReportQueries.saveLampiranMyReport({
                    id_response: id_response,
                    file_name: fileData.filename,
                    original_name: fileData.originalName,
                    file_url: fileData.url,
                    file_type: fileData.mimetype,
                    file_size: fileData.size,
                });
            } catch (uploadError) {
                console.error('Error uploading file:', uploadError);

                // Lanjutkan proses tapi beri tahu ada error upload file
                // Continue process but notify about file upload error
                return response(
                    201,
                    {
                        ...result,
                        fileUploadError: uploadError.message,
                        lampiran: null,
                    },
                    'Response berhasil dibuat/diperbarui tapi file upload gagal',
                    res
                );
            }
        }

        // Return respons sukses dengan informasi file jika ada
        // Return success response with file information if present
        response(
            200,
            {
                ...result,
                lampiran: fileData
                    ? {
                          url: fileData.url,
                          originalName: fileData.originalName,
                      }
                    : null,
            },
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
 * Mengambil semua kelas dan mahasiswa yang diampu oleh dosen wali
 * Get all classes and students supervised by lecturer supervisor
 * @desc Get all classes assigned to the logged-in dosen wali
 * @route GET /api/faculty/courseAdvisor/classesAndStudents
 * @access Private (dosen_wali only)
 */
exports.getClassesAndStudents = async (req, res) => {
    try {
        // Ambil kode dosen dari middleware autentikasi
        // Get lecturer code from authentication middleware
        const kodeDosen = req.user.code;

        // Validasi keberadaan kode dosen
        // Validate lecturer code existence
        if (!kodeDosen) {
            return res.status(400).json({
                success: false,
                message: 'Dosen code not found',
            });
        }

        // Ambil daftar kelas wali dari database
        // Get list of supervised classes from database
        const classes = await getKelasWaliDosen(kodeDosen);

        // Handle jika tidak ada kelas yang diampu
        // Handle if no classes are supervised
        if (classes.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No classes found for this dosen',
            });
        }

        // Ekstrak kode kelas ke array terpisah
        // Extract class codes to separate array
        const listKodeKelas = classes.map((cls) => cls.kode_kelas);

        // Ambil daftar mahasiswa berdasarkan kelas yang diampu
        // Get student list based on supervised classes
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
 * Mengambil riwayat mata kuliah mahasiswa untuk keperluan bimbingan akademik
 * Get student course history for academic guidance purposes
 * @desc Get riwayat mata kuliah according dengan nim yang dikirim dari query parameter frontend
 * @route GET /api/faculty/courseAdvisor/courseHistory/:nim
 * @access Private (dosen_wali only)
 */
exports.getHistoryMKMyCourseAdvisor = async (req, res) => {
    try {
        // Ambil NIM dari parameter URL atau query parameter
        // Get NIM from URL parameter or query parameter
        const idParam = req.params.nim;
        const idQuery = req.query.nim;
        const id = idParam || idQuery;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'NIM tidak dapat didapatkan, server error.',
            });
        }

        // 1. Ambil data nilai mahasiswa dari database
        // 1. Get student grades data from database
        const nilaiRows = await getStudentGrades(id);

        // Handle jika tidak ada data nilai
        // Handle if no grade data found
        if (nilaiRows.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        // 2. Buat array unik kode mata kuliah dari nilai mahasiswa
        // 2. Create unique array of course codes from student grades
        const kodeMkSet = new Set(nilaiRows.map((row) => row.kode_mk));
        const arrayKodeMk = [...kodeMkSet];

        // Validasi tambahan untuk array kode mata kuliah
        // Additional validation for course code array
        if (arrayKodeMk.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        // 3. Cari detail mata kuliah di tabel mata_kuliah_baru
        // 3. Find course details in mata_kuliah_baru table
        const newCoursesRows = await getNewCourses(arrayKodeMk);

        // 4. Buat map untuk pencarian cepat mata kuliah baru
        // 4. Create map for quick lookup of new courses
        const newCoursesMap = {};
        newCoursesRows.forEach((course) => {
            newCoursesMap[course.kode_mk] = course;
        });

        // 5. Cari kode mata kuliah yang tidak ditemukan di tabel mata kuliah baru
        // 5. Find course codes not found in new courses table
        const notFoundKodeMk = arrayKodeMk.filter(
            (kode) => !newCoursesMap[kode]
        );

        // 6. Proses mata kuliah yang tidak ditemukan (cari ekuivalensi dan mata kuliah lama)
        // 6. Process courses not found (search for equivalents and old courses)
        if (notFoundKodeMk.length > 0) {
            // Cek apakah ada mata kuliah lama yang punya ekuivalensi di mata kuliah baru
            // Check if there are old courses that have equivalents in new courses
            const equivalentRows = await getEquivalentCourses(notFoundKodeMk);

            // Buat map untuk pencarian ekuivalensi dengan cepat
            // Create map for quick equivalence lookup
            const equivalentMap = {};
            equivalentRows.forEach((course) => {
                equivalentMap[course.ekivalensi] = course;
            });

            // Update daftar yang belum ditemukan (yang benar-benar tidak ada ekuivalensinya)
            // Update list of not found courses (those without equivalents)
            const stillNotFound = notFoundKodeMk.filter(
                (kode) => !equivalentMap[kode]
            );

            // Tambahkan mata kuliah ekuivalensi ke map utama
            // Add equivalent courses to main map
            equivalentRows.forEach((course) => {
                // Map kode lama ke detail mata kuliah baru
                // Map old code to new course details
                newCoursesMap[course.ekivalensi] = {
                    nama_mk: course.nama_mk,
                    sks_mk: course.sks_mk,
                    jenis_mk: course.jenis_mk,
                    kode_mk_baru: course.kode_mk, // Simpan kode baru untuk ditampilkan
                    is_equivalent: true,
                };
            });

            // Kalau masih ada yang belum ditemukan, cari di tabel mata_kuliah_lama
            // If there are still not found courses, search in mata_kuliah_lama table
            if (stillNotFound.length > 0) {
                const oldCoursesRows = await getOldCourses(stillNotFound);

                // Tambahkan mata kuliah lama ke map utama
                // Add old courses to main map
                oldCoursesRows.forEach((course) => {
                    newCoursesMap[course.kode_mk_lama] = {
                        nama_mk_lama: course.nama_mk_lama,
                        sks_mk_lama: course.sks_mk_lama,
                        // Mata kuliah lama tidak punya jenis_mk
                        // Old courses don't have jenis_mk
                    };
                });
            }
        }

        // 7. Kumpulkan semua kode ekuivalensi yang perlu dicari namanya
        // 7. Collect all equivalence codes that need their names searched
        const ekivalensiCodes = [];

        // Tambahkan dari mata kuliah yang punya nilai ekuivalensi
        // Add from courses that have equivalence values
        newCoursesRows.forEach((course) => {
            if (course.ekivalensi) {
                ekivalensiCodes.push(course.ekivalensi);
            }
        });

        // Tambahkan dari mata kuliah yang sudah ekivalen (kode lama dari nilai)
        // Add from courses that are already equivalent (old codes from grades)
        arrayKodeMk.forEach((kode) => {
            if (newCoursesMap[kode] && newCoursesMap[kode].is_equivalent) {
                ekivalensiCodes.push(kode);
            }
        });

        // Map untuk menyimpan nama mata kuliah lama berdasarkan kode
        // Map to store old course names based on code
        const oldCoursesNamesMap = {};

        // 8. Cari nama mata kuliah lama jika ada kode ekuivalensi
        // 8. Search for old course names if there are equivalence codes
        if (ekivalensiCodes.length > 0) {
            const oldCoursesNamesRows = await getOldCoursesNames(
                ekivalensiCodes
            );

            // Buat map untuk nama mata kuliah lama
            // Create map for old course names
            oldCoursesNamesRows.forEach((course) => {
                oldCoursesNamesMap[course.kode_mk_lama] = course.nama_mk_lama;
            });
        }

        // 9. Proses dan gabungkan data untuk respons
        // 9. Process and combine data for response
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
 * Mengambil daftar mata kuliah yang tersedia untuk registrasi
 * Get list of available courses for registration
 * @desc Get mata kuliah yang tersedia untuk pendaftaran
 * @route GET /api/faculty/courseAdvisor/availableCourses
 * @access Private (dosen_wali only)
 */
exports.getAvailableCourse = async (req, res) => {
    try {
        // Ambil semua mata kuliah yang tersedia dari database
        // Get all available courses from database
        const mataKuliahTersedia = await getAvailCourses();

        // Handle jika tidak ada mata kuliah tersedia
        // Handle if no courses available
        if (mataKuliahTersedia.length === 0) {
            return res.status(404).json({
                success: false,
                count: 0,
                message: 'Tidak ada Matakuliah Tersedia',
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
 * Mengirim rekomendasi mata kuliah untuk mahasiswa bimbingan
 * Send course recommendations for supervised students
 * @desc Get detail mata kuliah untuk rekomendasi mata kuliah
 * @route POST /api/faculty/courseAdvisor/sendRekomendasiMK
 * @access Private (dosen_wali only)
 */
exports.sendCourseRecommendation = async (req, res) => {
    let connection; // Deklarasi variabel connection untuk cleanup yang proper

    try {
        // Validasi request menggunakan express-validator
        // Validate request using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }

        const { nim, courseCodes, targetSemester } = req.body;

        // Ambil kode dosen dari user yang terautentikasi
        // Get lecturer code from authenticated user
        const kodeDosen = req.user.code;

        // Validasi input yang diperlukan
        // Validate required inputs
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

        // Validasi targetSemester adalah angka valid antara 1-14
        // Validate targetSemester is a valid number between 1-14
        const semesterNum = parseInt(targetSemester);
        if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 14) {
            return res.status(400).json({
                success: false,
                message: 'Semester tujuan harus berupa angka antara 1-14',
            });
        }

        // Ambil connection dari pool untuk transaksi database
        // Get connection from pool for database transaction
        connection = await pool.getConnection();

        // Mulai transaksi untuk memastikan data consistency
        // Start transaction to ensure data consistency
        await connection.beginTransaction();

        // Kalkulasi total SKS dari mata kuliah yang direkomendasikan
        // Calculate total SKS from recommended courses
        const courseCodePlaceholders = courseCodes.map(() => '?').join(',');
        const [coursesData] = await connection.query(
            `SELECT kode_mk, sks_mk FROM mata_kuliah_baru WHERE kode_mk IN (${courseCodePlaceholders})`,
            courseCodes
        );

        // Validasi bahwa semua kode mata kuliah valid dan ditemukan
        // Validate that all course codes are valid and found
        if (coursesData.length !== courseCodes.length) {
            throw new Error('Some course codes are invalid or not found');
        }

        // Hitung total SKS dari semua mata kuliah yang direkomendasikan
        // Calculate total SKS from all recommended courses
        const totalSKS = coursesData.reduce((total, course) => {
            return total + (parseInt(course.sks_mk) || 0);
        }, 0);

        // Gunakan format datetime yang kompatibel dengan MySQL
        // Use MySQL-compatible datetime format
        const tanggalDibuat = getCurrentMySQLDateTime();

        // Hapus rekomendasi lama untuk menghindari konflik data
        // Delete old recommendations to avoid data conflicts
        const [deleteResult] = await connection.execute(
            'DELETE FROM mata_kuliah_rekomendasi WHERE nim_mahasiswa = ? AND kode_dosen = ?',
            [nim, kodeDosen]
        );

        // Insert data rekomendasi baru ke database
        // Insert new recommendation data to database
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

        // Commit transaksi jika semua operasi berhasil
        // Commit transaction if all operations successful
        await connection.commit();

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
        // Rollback transaksi jika terjadi error
        // Rollback transaction if error occurs
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Error during rollback:', rollbackError.message);
            }
        }

        console.error('Error in sendCourseRecommendation controller:', error);

        // Return pesan error yang sesuai berdasarkan jenis error
        // Return appropriate error message based on error type
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
        // Selalu release connection kembali ke pool
        // Always release connection back to pool
        if (connection) {
            connection.release();
        }
    }
};

/**
 * Mengambil daftar mata kuliah yang direkomendasikan untuk mahasiswa
 * Get list of recommended courses for students
 * @desc GET - mengambil rekomendasi mata kuliah mahasiswa
 * @route GET /api/faculty/courseAdvisor/recommendedCourses?nim=123456
 * @access Private (dosen_wali only)
 */
exports.getRecommendedCourses = async (req, res) => {
    try {
        const { nim } = req.query;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM Mahasiswa tidak ditemukan',
            });
        }

        // Ambil data rekomendasi mata kuliah dengan join ke tabel mata_kuliah_baru
        // Get course recommendation data with join to mata_kuliah_baru table
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

        // Kelompokkan data berdasarkan semester untuk frontend
        // Group data by semester for frontend
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
 * Mengambil IP Semester terakhir mahasiswa untuk menentukan maksimal SKS
 * Get student's last semester IP to determine maximum SKS allowed
 * @desc Get IP Semester terakhir mahasiswa.
 * @route GET /api/faculty/courseAdvisor/getLastIPSemester?nim=123456
 * @access Private (dosen_wali only)
 */
exports.getLastIPSemester = async (req, res) => {
    try {
        const { nim } = req.query;

        // Validasi input NIM
        // Validate NIM input
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM mahasiswa harus diisi',
            });
        }

        // Panggil service untuk mengambil data IP semester terakhir
        // Call service to get last semester IP data
        const lastSemesterData = await getLastSemesterIP(nim);

        // Handle jika data tidak ditemukan
        // Handle if data not found
        if (!lastSemesterData) {
            return res.status(404).json({
                success: false,
                message: 'Data IP semester tidak ditemukan untuk mahasiswa ini',
            });
        }

        // Tentukan maksimal SKS berdasarkan IP semester terakhir
        // Determine maximum SKS based on last semester IP
        let maxSKS = 24; // default maximum SKS
        const ipSemester = parseFloat(lastSemesterData.ip_semester);

        if (ipSemester > 3.0) {
            maxSKS = 24; // IP tinggi dapat mengambil 24 SKS
        } else if (ipSemester <= 3.0) {
            maxSKS = 20; // IP rendah dibatasi 20 SKS
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
 * Mengambil data SKS mahasiswa berdasarkan NIM
 * Get student SKS data by NIM
 * @desc Get total SKS yang sudah lulus mahasiswa
 * @route GET /api/faculty/courseAdvisor/getStudentSKS?nim=123456
 * @access Private (dosen_wali only)
 */
exports.getStudentNIMSKS = async (req, res) => {
    try {
        const nim = req.query.nim;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.',
            });
        }

        // Ambil data SKS mahasiswa dari database
        // Get student SKS data from database
        const studentData = await getNimSKSData(nim);

        // Handle jika mahasiswa tidak ditemukan
        // Handle if student not found
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
    } catch (error) {
        console.error('Error in getStudentNIMSKS:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data SKS mahasiswa',
            error: error.message,
        });
    }
};

/**
 * Mengambil detail akademik lengkap mahasiswa untuk keperluan bimbingan
 * Get complete student academic details for guidance purposes
 * @desc GET - mengambil detail akademik mahasiswa lengkap
 * @route GET /api/faculty/courseAdvisor/studentAcademicDetails?nim=123456
 * @access Private (dosen_wali only)
 */
exports.getStudentAcademicDetails = async (req, res) => {
    try {
        const nim = req.query.nim;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.',
            });
        }

        // Panggil fungsi untuk mengambil data akademik mahasiswa
        // Call function to get student academic data
        const academicDataArray = await getStudentAcademicData(nim);

        // Periksa apakah data mahasiswa ditemukan
        // Check if student data is found
        if (!academicDataArray || academicDataArray.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Student not found for NIM: ${nim}`,
            });
        }

        // Ambil data pertama untuk informasi dasar mahasiswa
        // Get first data for basic student information
        const studentData = academicDataArray[0];

        // Ekstrak nilai dengan default fallbacks untuk handling null values
        // Extract values with default fallbacks for null value handling
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

        // Proses data semester dengan handling untuk data kosong
        // Process semester data with handling for empty data
        const perSemester = [];
        const semesterMap = new Map(); // Untuk menghindari duplikat semester

        academicDataArray.forEach((row) => {
            // Hanya tambahkan jika ada data semester yang valid
            // Only add if there's valid semester data
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

        // Urutkan data semester secara ascending
        // Sort semester data in ascending order
        perSemester.sort((a, b) => a.semester - b.semester);

        // Siapkan data respons yang terstruktur
        // Prepare structured response data
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
        // Return respons error yang terstruktur
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
 * Mengambil hasil analisis psikologis mahasiswa berdasarkan NIM
 * Get student psychological analysis results by NIM
 * @desc Controller untuk get hasil psikologi mahasiswa tertentu
 * @route GET /api/faculty/student/:nim/wellness
 * @access Private (dosen_wali only)
 */
exports.getStudentWellness = async (req, res) => {
    try {
        const nim = req.params.nim;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is not found, make sure it passed correctly',
            });
        }

        // Ambil hasil analisis psikologis dari database
        // Get psychological analysis results from database
        const result = await getWellnessResult(nim);

        // Handle jika mahasiswa belum mengisi kuesioner
        // Handle if student hasn't filled the questionnaire
        if (!result || result.length === 0) {
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

/**
 * Mengambil data finansial mahasiswa untuk analisis bantuan keuangan
 * Get student financial data for financial aid analysis
 * @desc GET - mengambil data finansial mahasiswa
 * @route GET /api/faculty/student/:nim/financial
 * @access Private (dosen_wali only)
 */
exports.getStudentFinancial = async (req, res) => {
    try {
        const nim = req.params.nim;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required as a query parameter.',
            });
        }

        // Panggil fungsi untuk mengambil data finansial mahasiswa
        // Call function to get student financial data
        const financialDataArray = await fetchStudentsRelief(nim);

        // Handle jika data finansial tidak ditemukan
        // Handle if financial data not found
        if (!financialDataArray || financialDataArray.length === 0) {
            return res.status(200).json({
                success: true,
                message: `Student financial data not found for NIM: ${nim}`,
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            data: financialDataArray,
            message: 'Data finansial mahasiswa berhasil didapatkan',
        });
    } catch (error) {
        console.error('Error in get student financial data:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching student financial details.',
        });
    }
};

/**
 * Mengirim respons terhadap pengajuan bantuan finansial mahasiswa
 * Send response to student financial aid application
 * @desc POST - approve/reject financial request
 * @route POST /api/faculty/financial/:id/response
 * @access Private (dosen_wali only)
 */
exports.sendResponseFinancial = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        // Validasi ID pengajuan finansial
        // Validate financial application ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID response finansial diperlukan',
            });
        }

        // Validasi action yang diizinkan
        // Validate allowed actions
        if (!action || !['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Action harus berupa "approve" atau "reject"',
            });
        }

        // Cek apakah respons sudah pernah diberikan sebelumnya
        // Check if response has been given before
        const existingRecord = await financialResponse(id); // status = null (default)
        if (existingRecord) {
            return res.status(409).json({
                success: false,
                message: 'Response untuk pengajuan ini sudah ada',
            });
        }

        // Tentukan status dan message berdasarkan action
        // Determine status and message based on action
        const status = action === 'approve' ? 'Disetujui' : 'Ditolak';
        const message =
            action === 'approve'
                ? 'Pengajuan finansial berhasil disetujui'
                : 'Pengajuan finansial berhasil ditolak';

        // Insert respons ke database
        // Insert response to database
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
 * Testing environment Machine Learning untuk memastikan dependency tersedia
 * Test Machine Learning environment to ensure dependencies are available
 * @desc Controller untuk test ML environment
 * @route GET /api/faculty/ml/test
 * @access Private (dosen_wali only)
 */
exports.testMLEnvironment = async (req, res) => {
    try {
        let responseAlreadySent = false; // Flag untuk mencegah double response

        // Spawn proses Python untuk test environment ML
        // Spawn Python process to test ML environment
        const python = spawn('python', [
            '-c',
            'import sys; import joblib; import numpy; import sklearn; print("Python environment OK")',
        ]);

        let output = '';
        let error = '';

        // Collect output dari stdout
        // Collect output from stdout
        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Collect error dari stderr
        // Collect error from stderr
        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        // Handle ketika proses Python selesai
        // Handle when Python process completes
        python.on('close', (code) => {
            if (responseAlreadySent) return; // Prevent double response
            responseAlreadySent = true;

            clearTimeout(timeoutId); // Clear timeout

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

        // Set timeout untuk mencegah hanging process
        // Set timeout to prevent hanging process
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
 * Prediksi status mahasiswa menggunakan Machine Learning berdasarkan data akademik, psikologis, dan finansial
 * Predict student status using Machine Learning based on academic, psychological, and financial data
 * @desc Prediksi berdasarkan NIM mahasiswa + save to database
 * @route POST /api/faculty/ml/predict/:nim
 * @body { ipk, skor_psikologi, finansial }
 * @access Private (dosen_wali only)
 */
exports.predictStudentByNim = async (req, res) => {
    try {
        const { nim } = req.params;
        const { ipk, skor_psikologi, finansial } = req.body;

        // Validasi parameter NIM
        // Validate NIM parameter
        if (!nim) {
            return res.status(400).json({
                success: false,
                message: 'NIM is required',
            });
        }

        // Validasi input data untuk prediksi ML
        // Validate input data for ML prediction
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

        // Path ke script Python untuk prediksi ML
        // Path to Python script for ML prediction
        const scriptPath = path.join(__dirname, '../ml_models/predict.py');

        let responseAlreadySent = false;

        // Spawn proses Python untuk menjalankan prediksi ML
        // Spawn Python process to run ML prediction
        const python = spawn('python', [
            scriptPath,
            ipk,
            skor_psikologi,
            finansial,
        ]);

        let output = '';
        let error = '';

        // Collect output dan error dari proses Python
        // Collect output and error from Python process
        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            error += data.toString();
        });

        // Handle ketika proses Python selesai
        // Handle when Python process completes
        python.on('close', async (code) => {
            if (responseAlreadySent) return;
            responseAlreadySent = true;

            clearTimeout(timeoutId);

            if (code === 0 && output) {
                try {
                    // Parse hasil prediksi dari Python script
                    // Parse prediction result from Python script
                    const result = JSON.parse(output.trim());

                    if (result.success) {
                        // Simpan hasil prediksi ke database
                        // Save prediction result to database
                        try {
                            const predicted_status = result.predicted_status;

                            // Hapus record yang sudah ada untuk menghindari duplikat
                            // Delete existing record to avoid duplicates
                            const [deleteResult] = await pool.execute(
                                'DELETE FROM klasifikasi_umum WHERE nim = ?',
                                [nim]
                            );

                            // Insert hasil prediksi baru ke database
                            // Insert new prediction result to database
                            const [insertResult] = await pool.execute(
                                'INSERT INTO klasifikasi_umum (nim, hasil_klasifikasi_umum) VALUES (?, ?)',
                                [nim, predicted_status]
                            );

                            // Return respons sukses dengan informasi lengkap
                            // Return success response with complete information
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

                            // Return hasil prediksi meskipun gagal simpan ke database
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

        // Set timeout untuk mencegah hanging process (30 detik)
        // Set timeout to prevent hanging process (30 seconds)
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
