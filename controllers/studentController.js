// Student Controller - Pengontrol untuk fitur mahasiswa dalam sistem akademik
// Student Controller for student features in academic system
const { pool } = require('../config/database');

// Import middleware untuk upload file
// Import middleware for file upload
const upload = require('../middlewares/uploadMiddleware');

// Import model untuk lampiran
// Import model for attachments
const lampiranModel = require('../models/lampiranTable');

// Import utility untuk cloud storage
// Import utility for cloud storage
const { uploadFile } = require('../utils/cloudStorage');

// Import helper untuk formatting tanggal MySQL
// Import helper for MySQL date formatting
const { getCurrentMySQLDateTime } = require('../utils/dateHelper');

// Import queries untuk fitur mata kuliah mahasiswa
// Import queries for student course features
const {
    getStudentGrades,
    getNewCourses,
    getEquivalentCourses,
    getOldCourses,
    getOldCoursesNames,
    processCourseHistory,
    sendPeminatan,
    getListPeminatan,
    getStudentPeminatan,
} = require('../models/mahasiswaQueries/myCourseQueries');

// Import queries untuk progress akademik mahasiswa
// Import queries for student academic progress
const {
    fetchStudentTAK,
    fetchStudentSKSTotal,
    fetchStudentIPK,
    fetchStudentIPS,
    fetchStudentStatus,
} = require('../models/mahasiswaQueries/MyProgress');

// Import queries untuk hasil psikologi mahasiswa
// Import queries for student psychology results
const {
    fetchPsiResult,
} = require('../models/mahasiswaQueries/myWellnessQueries');

// Import queries untuk feedback mahasiswa
// Import queries for student feedback
const {
    getMyFeedbackList,
} = require('../models/mahasiswaQueries/myFeedbackQueries');

// Import queries untuk keuangan mahasiswa
// Import queries for student finance
const {
    submitRelief,
    fetchRelief,
    saveLampiranFinance,
} = require('../models/mahasiswaQueries/myFinanceQueries');

/**
 * Mengambil data akademik lengkap mahasiswa (TAK, SKS, IPK, IPS, Status)
 * Get complete student academic data (TAK, SKS, IPK, IPS, Status)
 * @desc Ambil tak dari mahasiswa yang login
 * @route GET /api/student/takMahasiswa
 * @access Private (khusus mahasiswa)
 */
exports.getStudentsTAKSKSIPK = async (req, res) => {
    try {
        // Ambil NIM mahasiswa dari token autentikasi
        // Get student NIM from authentication token
        const nim = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM not found, make sure you have logged in correctly',
            });
        }

        // Ambil berbagai data akademik mahasiswa secara paralel
        // Get various student academic data in parallel
        const rowsTAK = await fetchStudentTAK(nim);
        const rowsSKSTotal = await fetchStudentSKSTotal(nim);
        const rowsIPK = await fetchStudentIPK(nim);
        const rowsIPS = await fetchStudentIPS(nim);
        const rowsStatus = await fetchStudentStatus(nim);

        // Ekstrak nilai dengan fallback default jika data tidak ada
        // Extract values with default fallback if data doesn't exist
        const takValue = rowsTAK.length > 0 ? rowsTAK[0].tak : 0;
        const sksTotalValue =
            rowsSKSTotal.length > 0 ? rowsSKSTotal[0].sks_lulus : 0;
        const ipkValue = rowsIPK.length > 0 ? rowsIPK[0].ipk_lulus : 0;
        const ipsValue = [];
        const statusValue = rowsStatus[0].hasil_klasifikasi;

        // Proses data IPS per semester
        // Process IPS data per semester
        rowsIPS.forEach((row) => {
            if (row.semester && row.ip_semester !== null) {
                // Pastikan ada data semester yang valid
                // Ensure valid semester data exists
                ipsValue.push({
                    semester: row.semester,
                    ipSemester: row.ip_semester,
                });
            }
        });

        // Gabungkan semua data akademik dalam satu objek
        // Combine all academic data in one object
        const ipkSksTakIps = {
            ipk: ipkValue,
            sksTotal: sksTotalValue,
            tak: takValue,
            ips: ipsValue,
            klasifikasi: statusValue,
        };

        return res.status(200).json({
            success: true,
            data: ipkSksTakIps,
        });
    } catch (error) {
        console.error('Error fetching students TAK:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

/**
 * Mengambil riwayat mata kuliah mahasiswa dengan sistem ekuivalensi
 * Get student course history with equivalency system
 * @desc Ambil daftar riwayat mata kuliah mahasiswa yang login
 * @route GET /api/student/riwayatMataKuliah
 * @access Private (khusus mahasiswa)
 */
exports.getCourseHistory = async (req, res) => {
    try {
        // Ambil NIM mahasiswa dari session/token
        // Get student NIM from session/token
        const id = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
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
 * Mengambil rekomendasi mata kuliah dari dosen wali
 * Get course recommendations from academic supervisor
 * @desc Ambil daftar matakuliah yang direkomendasikan oleh dosen wali
 * @route GET /api/student/rekomendasiMataKuliah
 * @access Private (khusus mahasiswa)
 */
exports.getCourseRecommendation = async (req, res) => {
    try {
        // Ambil NIM mahasiswa dari session/token
        // Get student NIM from session/token
        const nim = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
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

        // Handle jika belum ada rekomendasi
        // Handle if no recommendations yet
        if (mataKuliahRekomendasi.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Belum ada rekomendasi mata kuliah dari dosen wali',
                data: [],
            });
        }

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
 * Mengambil hasil tes psikologi mahasiswa
 * Get student psychology test results
 * @desc Ambil daftar nim mahasiswa yang sudah pernah mengisi
 * @route GET /api/student/getPsiResult
 * @access Private (khusus mahasiswa)
 */
exports.getPsiResults = async (req, res) => {
    try {
        // Ambil NIM dari token autentikasi
        // Get NIM from authentication token
        const nim = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // Query hasil tes psikologi dari database
        // Query psychology test results from database
        const psiResult = await fetchPsiResult(nim);

        // Handle jika belum ada hasil tes
        // Handle if no test results yet
        if (psiResult.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
                message: 'Belum ada hasil tes psikologi',
            });
        }

        return res.status(200).json({
            success: true,
            count: psiResult.length,
            data: psiResult,
        });
    } catch (error) {
        console.error('Error mendapatkan hasil tes psikologi:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching psychology result.',
        });
    }
};

/**
 * Menyimpan hasil tes psikologi mahasiswa ke database
 * Save student psychology test results to database
 * @desc Mengirim data insert ke database.
 * @route POST /api/student/sendPsiResult
 * @access Private (khusus mahasiswa)
 */
exports.sendPsiResult = async (req, res) => {
    try {
        const nim = req.user.id;

        // Ekstrak data dari request body
        // Extract data from request body
        const {
            skor_depression,
            skor_anxiety,
            skor_stress,
            total_skor,
            kesimpulan,
            saran,
            klasifikasi,
        } = req.body;

        // Validasi field yang diperlukan
        // Validate required fields
        if (
            !nim ||
            skor_depression === undefined ||
            skor_anxiety === undefined ||
            skor_stress === undefined ||
            !kesimpulan ||
            !saran ||
            !klasifikasi
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Missing required fields for psychological test results',
            });
        }

        // Verifikasi bahwa NIM dari token sesuai dengan NIM di request
        // Verify that NIM from token matches NIM in request
        if (req.user.id !== nim) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not authorized to submit test results for this student',
            });
        }

        // Gunakan format datetime yang kompatibel dengan MySQL
        // Use MySQL-compatible datetime format
        const tanggalTes = getCurrentMySQLDateTime();

        // Insert data hasil tes psikologi ke database
        // Insert psychology test results data to database
        const [insertResult] = await pool.execute(
            `
            INSERT INTO hasil_tes_psikologi 
            (nim, skor_depression, skor_anxiety, skor_stress, total_skor, kesimpulan, saran, klasifikasi, tanggalTes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                nim,
                skor_depression,
                skor_anxiety,
                skor_stress,
                total_skor,
                kesimpulan,
                saran,
                klasifikasi,
                tanggalTes,
            ]
        );

        // Cek apakah insert berhasil
        // Check if insert was successful
        if (insertResult.affectedRows > 0) {
            return res.status(201).json({
                success: true,
                message: 'Hasil tes psikologi berhasil disimpan',
                data: {
                    id: insertResult.insertId,
                    nim,
                    total_skor,
                    tanggalTes,
                    klasifikasi,
                },
            });
        } else {
            throw new Error('Failed to insert data');
        }
    } catch (error) {
        console.error('Error in sendPsiResult controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan hasil tes psikologi',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : 'Internal server error',
        });
    }
};

/**
 * Upload lampiran keluhan mahasiswa ke cloud storage
 * Upload student complaint attachment to cloud storage
 * @desc controller untuk upload file lampiran MyFeedback ke gcp
 * @route POST /api/student/uploadLampiranKeluhan
 * @access Private (khusus mahasiswa)
 */
exports.uploadLampiranKeluhan = async (req, res) => {
    try {
        // Ekstrak data keluhan dari request body
        // Extract complaint data from request body
        const { title_keluhan, detail_keluhan } = req.body;
        const nim = req.user.id;

        // Validasi field yang diperlukan
        // Validate required fields
        if (!nim || !title_keluhan || !detail_keluhan) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        // Gunakan format datetime yang kompatibel dengan MySQL
        // Use MySQL-compatible datetime format
        const tanggalKeluhan = getCurrentMySQLDateTime();

        // Insert keluhan ke database menggunakan Promise-based query
        // Insert complaint to database using Promise-based query
        const [result] = await pool.execute(
            `INSERT INTO keluhan_mahasiswa (nim_keluhan, title_keluhan, detail_keluhan, tanggal_keluhan) 
             VALUES (?, ?, ?, ?)`,
            [nim, title_keluhan, detail_keluhan, tanggalKeluhan]
        );

        const id_keluhan = result.insertId;

        // Handle upload file jika ada lampiran
        // Handle file upload if there's an attachment
        let fileData = null;
        if (req.file) {
            try {
                // Set timeout untuk operasi upload (30 detik)
                // Set timeout for upload operation (30 seconds)
                const uploadPromise = uploadFile(req.file, 'keluhan-lampiran');

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error('File upload timeout')),
                        30000
                    )
                );

                // Race antara upload dan timeout
                // Race between upload and timeout
                fileData = await Promise.race([uploadPromise, timeoutPromise]);

                // Simpan metadata file ke database menggunakan lampiranModel
                // Save file metadata to database using lampiranModel
                await lampiranModel.saveLampiran({
                    id_keluhan: id_keluhan,
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
                return res.status(201).json({
                    success: true,
                    message: 'Feedback submitted but file upload failed',
                    error: uploadError.message,
                    data: {
                        id_keluhan: id_keluhan,
                        nim,
                        title_keluhan,
                        detail_keluhan,
                        lampiran: null,
                    },
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: {
                id_keluhan: id_keluhan,
                nim,
                title_keluhan,
                detail_keluhan,
                tanggal_keluhan: tanggalKeluhan,
                lampiran: fileData
                    ? {
                          url: fileData.url,
                          originalName: fileData.originalName,
                      }
                    : null,
            },
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit feedback',
        });
    }
};

/**
 * Mengambil daftar keluhan/feedback yang dibuat oleh mahasiswa
 * Get list of complaints/feedback created by student
 * @desc controller untuk get list keluhan dari mahasiswa
 * @route GET /api/student/myKeluhan
 * @access Private (khusus mahasiswa)
 */
exports.getMyKeluhan = async (req, res) => {
    try {
        // Ambil NIM dari objek user (diset oleh auth middleware)
        // Get NIM from user object (set by auth middleware)
        const nim = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // Ambil daftar feedback dari database
        // Get feedback list from database
        const feedbackList = await getMyFeedbackList(nim);

        // Transformasi data untuk frontend dengan informasi tambahan
        // Transform data for frontend with additional information
        const transformedList = feedbackList.map((feedback) => ({
            id_keluhan: feedback.id_keluhan,
            nim_keluhan: feedback.nim_keluhan,
            title_keluhan: feedback.title_keluhan,
            detail_keluhan: feedback.detail_keluhan,
            tanggal_keluhan: feedback.tanggal_keluhan,
            status: feedback.status || 'Pending',
            has_response: feedback.has_response || false,
        }));

        return res.status(200).json({
            success: true,
            count: transformedList.length,
            data: transformedList,
        });
    } catch (error) {
        console.error('Error getting feedback list:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil daftar feedback',
            error: error.message,
        });
    }
};

/**
 * Mengambil detail keluhan berdasarkan ID dengan respons dari dosen wali
 * Get complaint details by ID with response from academic supervisor
 * @desc controller untuk get detail keluhan berdasarkan ID
 * @route GET /api/student/myKeluhan/:id
 * @access Private (khusus mahasiswa)
 */
exports.getKeluhanDetail = async (req, res) => {
    try {
        // Ambil ID keluhan dari parameter URL
        // Get complaint ID from URL parameter
        const { id } = req.params;

        // Validasi ID keluhan
        // Validate complaint ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID keluhan tidak ditemukan',
            });
        }

        // Import fungsi query untuk detail feedback
        // Import query function for feedback detail
        const {
            getFeedbackDetail,
        } = require('../models/mahasiswaQueries/myFeedbackQueries');

        // Ambil detail feedback dengan lampiran dan respons
        // Get feedback detail with attachment and response
        const feedbackDetail = await getFeedbackDetail(id);

        // Handle jika feedback tidak ditemukan
        // Handle if feedback not found
        if (!feedbackDetail) {
            return res.status(404).json({
                success: false,
                message: 'Keluhan tidak ditemukan',
            });
        }

        // Cek apakah feedback milik user yang sedang login
        // Check if feedback belongs to the logged-in user
        if (feedbackDetail.nim_keluhan !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk melihat keluhan ini',
            });
        }

        // Transformasi data untuk frontend dengan informasi lengkap
        // Transform data for frontend with complete information
        const transformedDetail = {
            id_keluhan: feedbackDetail.id_keluhan,
            nim_keluhan: feedbackDetail.nim_keluhan,
            title_keluhan: feedbackDetail.title_keluhan,
            detail_keluhan: feedbackDetail.detail_keluhan,
            tanggal_keluhan: feedbackDetail.tanggal_keluhan,
            status: feedbackDetail.status_keluhan || 'Pending',
            lampiran: feedbackDetail.lampiran, // Lampiran dari mahasiswa
            response: feedbackDetail.response
                ? {
                      text: feedbackDetail.response.text,
                      date: feedbackDetail.response.date,
                      nip_dosen_wali: feedbackDetail.response.nip_dosen_wali,
                      // Include lampiran respons dari dosen wali
                      // Include response attachment from academic supervisor
                      lampiran: feedbackDetail.response.lampiran,
                  }
                : null,
        };

        return res.status(200).json({
            success: true,
            data: transformedDetail,
        });
    } catch (error) {
        console.error('Error getting feedback detail:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil detail feedback',
            error: error.message,
        });
    }
};

/**
 * Mengirim data peminatan mahasiswa ke database
 * Send student specialization data to database
 * @desc POST - kirim peminatan mahasiswa
 * @route POST /api/student/peminatan
 * @access Private (khusus mahasiswa)
 */
exports.sendPeminatanMahasiswa = async (req, res) => {
    try {
        const id = req.user.id;
        const { peminatan } = req.body;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // Validasi data peminatan
        // Validate specialization data
        if (!peminatan) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data peminatan mahasiswa',
            });
        }

        // Update data peminatan di database
        // Update specialization data in database
        const updatePeminatan = await sendPeminatan(id, peminatan);

        // Periksa apakah ada baris yang diupdate
        // Check if any rows were updated
        if (updatePeminatan.payload === 0) {
            return res.status(404).json({
                success: false,
                message: `Data peminatan dengan NIM ${id} tidak ditemukan.`,
            });
        }

        res.status(200).json({
            success: true,
            message: `Data peminatan mahasiswa dengan NIM ${id} berhasil diupdate`,
            data: {
                id: id,
                peminatan: peminatan,
            },
        });
    } catch (error) {
        console.error(
            'Error from sendPeminatanMahasiswa Controller (Update).',
            error
        );
        res.status(500).json({
            success: false,
            message:
                'Terjadi kesalahan ketika mengirim data peminatan mahasiswa',
        });
    }
};

/**
 * Mengambil daftar semua peminatan/kelompok keahlian yang tersedia
 * Get list of all available specializations/expertise groups
 * @desc GET - ambil daftar peminatan
 * @route GET /api/student/peminatan/list
 * @access Private (khusus mahasiswa)
 */
exports.getAllPeminatanList = async (req, res) => {
    try {
        // Ambil daftar peminatan dari database
        // Get specialization list from database
        const result = await getListPeminatan();

        // Handle jika tidak ada data peminatan
        // Handle if no specialization data found
        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: `Data list kelompok keahlian tidak ditemukan.`,
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: 'List kelompok keahlian berhasil diambil.',
            count: result.length,
            data: result,
        });
    } catch (error) {
        console.error('Error in getAllPeminatanList controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan ketika mengambil data',
        });
    }
};

/**
 * Mengambil data peminatan mahasiswa yang sedang login
 * Get specialization data of the logged-in student
 * @desc GET - ambil peminatan mahasiswa
 * @route GET /api/student/peminatan
 * @access Private (khusus mahasiswa)
 */
exports.getStudentPeminatan = async (req, res) => {
    try {
        // Ambil NIM mahasiswa dari session/token
        // Get student NIM from session/token
        const nim = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan Anda sudah login dengan benar',
            });
        }

        // Panggil query untuk mendapatkan peminatan mahasiswa
        // Call query to get student specialization
        const peminatanResult = await getStudentPeminatan(nim);

        // Berhasil mendapatkan data peminatan dengan handling null value
        // Successfully get specialization data with null value handling
        res.status(200).json({
            success: true,
            message: 'Data peminatan berhasil diambil.',
            data: {
                // Handle kasus jika kolom peminatan bernilai null
                // Handle case if specialization column is null
                peminatan:
                    peminatanResult.peminatan || 'Belum memilih peminatan',
            },
        });
    } catch (error) {
        console.error('Error in getStudentPeminatan controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data peminatan.',
        });
    }
};

/**
 * Mengirim pengajuan keringanan biaya kuliah dengan lampiran file
 * Submit tuition fee relief application with file attachment
 * @desc POST - kirim pengajuan keringanan biaya
 * @route POST /api/student/finance/relief
 * @access Private (khusus mahasiswa)
 */
exports.sendRelief = async (req, res) => {
    try {
        const nim = req.user.id;

        // Ekstrak data dari request body
        // Extract data from request body
        const {
            penghasilanBulanan,
            penghasilanOrangTua,
            tanggunganOrangTua,
            tempatTinggal,
            pengeluaranPerbulan,

            // Detail Keringanan / Relief Details
            jenisKeringanan,
            alasankeringanan,
            jumlahDiajukan,
            detailAlasan,
        } = req.body;

        // Validasi field yang diperlukan
        // Validate required fields
        if (
            !nim ||
            penghasilanBulanan === undefined ||
            penghasilanOrangTua === undefined ||
            tanggunganOrangTua === undefined ||
            tempatTinggal === undefined ||
            pengeluaranPerbulan === undefined ||
            // Detail Keringanan validation
            jenisKeringanan === undefined ||
            alasankeringanan === undefined ||
            jumlahDiajukan === undefined ||
            detailAlasan === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields for relief application',
            });
        }

        // Verifikasi bahwa NIM dari token sesuai dengan NIM di request
        // Verify that NIM from token matches NIM in request
        if (req.user.id !== nim) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not authorized to submit relief application for this student',
            });
        }

        // Gunakan format datetime yang kompatibel dengan MySQL
        // Use MySQL-compatible datetime format
        const currentDate = getCurrentMySQLDateTime();

        // Siapkan array nilai untuk insert ke database
        // Prepare value array for database insert
        const valueRelief = [
            nim,
            parseInt(penghasilanBulanan),
            parseInt(penghasilanOrangTua),
            parseInt(tanggunganOrangTua),
            tempatTinggal,
            parseInt(pengeluaranPerbulan),
            jenisKeringanan,
            alasankeringanan,
            parseInt(jumlahDiajukan),
            detailAlasan,
            currentDate,
        ];

        // Eksekusi query insert pengajuan keringanan
        // Execute relief application insert query
        const insertRelief = await submitRelief(valueRelief);

        // Handle upload file jika ada lampiran
        // Handle file upload if there's an attachment
        let fileData = null;
        if (req.file) {
            try {
                // Upload file ke Google Cloud Storage dalam folder finance-lampiran
                // Upload file to Google Cloud Storage in finance-lampiran folder
                fileData = await uploadFile(req.file, 'finance-lampiran');

                // Simpan metadata file ke tabel lampiranfinance
                // Save file metadata to lampiranfinance table
                await saveLampiranFinance({
                    id_keluhan: insertRelief.insertId,
                    file_name: fileData.filename,
                    original_name: fileData.originalName,
                    file_url: fileData.url,
                    file_type: fileData.mimetype,
                    file_size: fileData.size,
                });
            } catch (uploadError) {
                console.error('Error uploading file:', uploadError);
                // Lanjutkan proses meskipun upload file gagal
                // Continue process even if file upload fails
            }
        }

        // Cek apakah insert berhasil
        // Check if insert was successful
        if (insertRelief.affectedRows > 0) {
            return res.status(201).json({
                success: true,
                message: 'Pengajuan keringanan biaya berhasil disimpan',
                data: {
                    id: insertRelief.insertId,
                    nim,
                    tanggal_pengajuan: currentDate,
                    lampiran: fileData
                        ? {
                              url: fileData.url,
                              originalName: fileData.originalName,
                          }
                        : null,
                },
            });
        } else {
            throw new Error('Failed to insert relief data');
        }
    } catch (error) {
        console.error('Error in sendRelief controller:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menyimpan pengajuan keringanan',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : 'Internal server error',
        });
    }
};

/**
 * Mengambil riwayat pengajuan keringanan biaya mahasiswa
 * Get student's tuition fee relief application history
 * @desc GET - ambil riwayat pengajuan keringanan
 * @route GET /api/student/finance/relief
 * @access Private (khusus mahasiswa)
 */
exports.getStudentsRelief = async (req, res) => {
    try {
        // Ambil NIM mahasiswa dari user yang login
        // Get student NIM from logged-in user
        const nim = req.user.id;

        // Validasi keberadaan NIM
        // Validate NIM existence
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM not found, make sure you have logged in correctly',
            });
        }

        // Ambil data riwayat pengajuan keringanan dari database
        // Get relief application history data from database
        const rowsRelief = await fetchRelief(nim);

        return res.status(200).json({
            success: true,
            data: rowsRelief,
            message: 'Relief history retrieved successfully',
        });
    } catch (error) {
        console.error('Error fetching students relief history:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching relief history',
        });
    }
};
