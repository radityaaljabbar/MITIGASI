const { pool } = require('../config/database');

const upload = require('../middlewares/uploadMiddleware');
// Import queries2 dari folder models
const lampiranModel = require('../models/lampiranTable');

const { uploadFile } = require('../utils/cloudStorage');

// ADDED: Import dateHelper for MySQL datetime formatting
const { getCurrentMySQLDateTime } = require('../utils/dateHelper');

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

const {
    fetchStudentTAK,
    fetchStudentSKSTotal,
    fetchStudentIPK,
    fetchStudentIPS,
    fetchStudentStatus,
} = require('../models/mahasiswaQueries/MyProgress');

const {
    fetchPsiResult,
} = require('../models/mahasiswaQueries/myWellnessQueries');

const {
    getMyFeedbackList,
} = require('../models/mahasiswaQueries/myFeedbackQueries');

const {
    submitRelief,
    fetchRelief,
} = require('../models/mahasiswaQueries/myFinanceQueries');

// @desc Ambil tak dari mahasisw yang login
// @route GET /api/student/takMahasiswa
// @access Private (khusus mahasiswa)
exports.getStudentsTAKSKSIPK = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari localStorage:
        const nim = req.user.id;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM not found, make sure you have logged in correctly',
            });
        }

        // Ambil data tak dari query:
        const rowsTAK = await fetchStudentTAK(nim);
        const rowsSKSTotal = await fetchStudentSKSTotal(nim);
        const rowsIPK = await fetchStudentIPK(nim);
        const rowsIPS = await fetchStudentIPS(nim);
        const rowsStatus = await fetchStudentStatus(nim);

        const takValue = rowsTAK.length > 0 ? rowsTAK[0].tak : 0;
        const sksTotalValue =
            rowsSKSTotal.length > 0 ? rowsSKSTotal[0].sks_lulus : 0;
        const ipkValue = rowsIPK.length > 0 ? rowsIPK[0].ipk_lulus : 0;
        const ipsValue = [];
        const statusValue = rowsStatus[0].hasil_klasifikasi;

        rowsIPS.forEach((row) => {
            if (row.semester && row.ip_semester !== null) {
                // Pastikan ada data semester
                ipsValue.push({
                    semester: row.semester,
                    ipSemester: row.ip_semester,
                });
            }
        });

        console.log('Data Mahasiswa Ditemukan (dari getStudentAcademicData):');
        console.log('tak: ', takValue);
        console.log('sks total: ', sksTotalValue);
        console.log('ips: ', ipsValue);
        console.log('klasifikasi akademik: ', statusValue);

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

// @desc Ambil daftar riwayat mata kuliah mahasiswa yang login
// @route GET /api/student/riwayatMataKuliah
// @access Private (khusus mahasiswa)
exports.getCourseHistory = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari session
        const id = req.user.id;

        // Cek dulu kalau id/nim nya ada
        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
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

// @desc Ambil daftar matakuliah yang direkomendasikan oleh dosen wali
// @route GET /api/student/rekomendasiMataKuliah
// @access Private (khusus mahasiswa)
exports.getCourseRecommendation = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari session
        const nim = req.user.id;

        // Cek dulu kalau id/nim nya ada
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
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

        // Cek data ada atau tidak:
        if (mataKuliahRekomendasi.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Belum ada rekomendasi mata kuliah dari dosen wali',
            });
        }

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

// @desc Ambil daftar nim mahasiswa yang sudah pernah mengisi
// @route GET /api/student/getPsiResult
// @access Private (khusus mahasiswa)
exports.getPsiResults = async (req, res) => {
    try {
        // get nim from localStorage
        const nim = req.user.id;
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // Querying
        const psiResult = await fetchPsiResult(nim);

        if (psiResult.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
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

// @desc Mengirim data insert ke database.
// @route POST /api/student/sendPsiResult
// @access Private (khusus mahasiswa)
exports.sendPsiResult = async (req, res) => {
    try {
        const nim = req.user.id;
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

        // Verify that nim from token matches nim in request
        if (req.user.id !== nim) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not authorized to submit test results for this student',
            });
        }

        // FIXED: Use MySQL-compatible datetime format
        const tanggalTes = getCurrentMySQLDateTime();

        //? Dicomment untuk memungkinkan mahasiswa bisa mengisi berulang kali tidak hanya sekali.
        // const [deleteResult] = await pool.execute(
        //     'DELETE FROM hasil_tes_psikologi WHERE nim = ?',
        //     [nim]
        // );

        // console.log(
        //     `Deleted ${deleteResult.affectedRows} existing records for nim: ${nim}`
        // );

        // Step 2: Insert new data
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
 * @desc controller untuk upload file lampiran MyFeedback ke gcp
 * @route POST /api/student/uploadLampiranKeluhan
 */
exports.uploadLampiranKeluhan = async (req, res) => {
    try {
        // Log request information for debugging
        console.log('Upload lampiran request received:', {
            body: req.body,
            filePresent: !!req.file,
        });

        // Extract feedback data from request body
        const { title_keluhan, detail_keluhan } = req.body;
        const nim = req.user.id;
        // Validate required fields
        if (!nim || !title_keluhan || !detail_keluhan) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        // FIXED: Use MySQL-compatible datetime format
        const tanggalKeluhan = getCurrentMySQLDateTime();

        // Use Promise-based query execution consistently
        const [result] = await pool.execute(
            `INSERT INTO keluhan_mahasiswa (nim_keluhan, title_keluhan, detail_keluhan, tanggal_keluhan) 
             VALUES (?, ?, ?, ?)`,
            [nim, title_keluhan, detail_keluhan, tanggalKeluhan]
        );

        const id_keluhan = result.insertId;
        console.log(`Keluhan inserted with ID: ${id_keluhan}`);

        // Handle file upload if there's a file
        let fileData = null;
        if (req.file) {
            try {
                console.log('Starting file upload to GCP');
                // Set a timeout for the upload operation
                const uploadPromise = uploadFile(req.file, 'keluhan-lampiran');

                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error('File upload timeout')),
                        30000
                    )
                );

                // Race the upload against the timeout
                fileData = await Promise.race([uploadPromise, timeoutPromise]);
                console.log('File uploaded successfully:', fileData.url);

                // Save file data to database using lampiranModel
                await lampiranModel.saveLampiran({
                    id_keluhan: id_keluhan,
                    file_name: fileData.filename,
                    original_name: fileData.originalName,
                    file_url: fileData.url,
                    file_type: fileData.mimetype,
                    file_size: fileData.size,
                });
                console.log('File metadata saved to database');
            } catch (uploadError) {
                console.error('Error uploading file:', uploadError);
                // Continue but note the error - we'll still return the created complaint
                // but with information about the file upload issue
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
        } else {
            console.log('No file to upload');
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
 * @desc controller untuk get list keluhan dari mahasiswa
 * @route GET /api/student/myKeluhan
 */
exports.getMyKeluhan = async (req, res) => {
    try {
        // Get nim from user object (set by auth middleware)
        const nim = req.user.id;
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        // Get the feedback list
        const feedbackList = await getMyFeedbackList(nim);

        // Transform the data for frontend if needed
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
 * @desc controller untuk get detail keluhan berdasarkan ID
 * @route GET /api/student/myKeluhan/:id
 */
exports.getKeluhanDetail = async (req, res) => {
    try {
        // Get feedback ID from the URL parameter
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID keluhan tidak ditemukan',
            });
        }

        // Import query function
        const {
            getFeedbackDetail,
        } = require('../models/mahasiswaQueries/myFeedbackQueries');

        // Get the feedback detail with attachment and response
        const feedbackDetail = await getFeedbackDetail(id);

        // If feedback not found
        if (!feedbackDetail) {
            return res.status(404).json({
                success: false,
                message: 'Keluhan tidak ditemukan',
            });
        }

        // Check if the feedback belongs to the logged-in user
        if (feedbackDetail.nim_keluhan !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk melihat keluhan ini',
            });
        }

        // Transform the data for the frontend
        const transformedDetail = {
            id_keluhan: feedbackDetail.id_keluhan,
            nim_keluhan: feedbackDetail.nim_keluhan,
            title_keluhan: feedbackDetail.title_keluhan,
            detail_keluhan: feedbackDetail.detail_keluhan,
            tanggal_keluhan: feedbackDetail.tanggal_keluhan,
            status: feedbackDetail.status_keluhan || 'Pending',
            lampiran: feedbackDetail.lampiran,
            response: feedbackDetail.response
                ? {
                      text: feedbackDetail.response.text,
                      date: feedbackDetail.response.date,
                      nip_dosen_wali: feedbackDetail.response.nip_dosen_wali,
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

exports.sendPeminatanMahasiswa = async (req, res) => {
    try {
        const id = req.user.id;
        const {peminatan} = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan kamu sudah login dengan benar',
            });
        }

        if (!peminatan) {
            return res.status(400).json({
                success: false,
                message:
                    'Tidak ada data peminatan mahasiswa',
            });
        }

        const updatePeminatan = await sendPeminatan(id, peminatan) 

        // Periksa apakah ada baris yang diupdate
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
        console.error('Error from sendPeminatanMahasiswa Controller (Update).', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan ketika mengirim data peminatan mahasiswa',
        });
    }
}


exports.getAllPeminatanList = async (req, res) => {
    try {
        const result = await getListPeminatan();
        
        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                message: `Data list kelompok keahlian tidak ditemukan.`,
            });
        }

        res.status(200).json({
            success: true,
            message: 'List kelompok keahlian berhasil diambil.',
            count: result.length,
            data: result,
        })

    } catch (error) {
        console.error('Error in getAllPeminatanList controller:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan ketika mengambil data',
        });
    }
}

//Ambil data peminatan mahasiswa yang sedang login
exports.getStudentPeminatan = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari session/token
        const nim = req.user.id;
        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM tidak ditemukan, pastikan Anda sudah login dengan benar',
            });
        }

        // Panggil query untuk mendapatkan peminatan
        const peminatanResult = await getStudentPeminatan(nim);

        // Berhasil mendapatkan data peminatan
        res.status(200).json({
            success: true,
            message: 'Data peminatan berhasil diambil.',
            data: {
                // Handle kasus jika kolom peminatan bernilai null
                peminatan: peminatanResult.peminatan || 'Belum memilih peminatan',
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


// myFinance
exports.sendRelief = async (req, res) => {
    try {
        const nim = req.user.id;

        // Extract data from request body
        const {
            penghasilanBulanan,
            penghasilanOrangTua,
            tanggunganOrangTua,
            tempatTinggal,
            pengeluaranPerbulan,

            // Detail Keringanan
            jenisKeringanan,
            alasankeringanan,
            jumlahDiajukan,
            detailAlasan,
        } = req.body;

        // Validate required fields
        if (
            !nim ||
            penghasilanBulanan === undefined ||
            penghasilanOrangTua === undefined ||
            tanggunganOrangTua === undefined ||
            tempatTinggal === undefined ||
            pengeluaranPerbulan === undefined ||
            // Detail Keringanan
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

        // Verify that nim from token matches nim in request
        if (req.user.id !== nim) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not authorized to submit relief application for this student',
            });
        }

        // FIXED: Use MySQL-compatible datetime format
        const currentDate = getCurrentMySQLDateTime();

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

        // Execute the insert query
        const insertRelief = await submitRelief(valueRelief);

        // Check if insert was successful
        if (insertRelief.affectedRows > 0) {
            return res.status(201).json({
                success: true,
                message: 'Pengajuan keringanan biaya berhasil disimpan',
                data: {
                    id: insertRelief.insertId,
                    nim,
                    tanggal_pengajuan: currentDate,
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

// Controller untuk mengambil history pengajuan keringanan biaya
exports.getStudentsRelief = async (req, res) => {
    try {
        // Ambil nim mahasiswa dari user yang login
        const nim = req.user.id;

        if (!nim) {
            return res.status(400).json({
                success: false,
                message:
                    'NIM not found, make sure you have logged in correctly',
            });
        }

        // Ambil data Relief dari query
        const rowsRelief = await fetchRelief(nim);

        // console.log('Data Mahasiswa Ditemukan (dari getStudentsRelief):');
        // console.log('Jawaban formulir keuangan: ', rowsRelief);

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
