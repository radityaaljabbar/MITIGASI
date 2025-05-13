const { pool } = require('../config/database');
const response = require('../utils/response');
// Import queries
const responseDosWalModel = require('../models/responseDosenWali');
const {
    getKelasWali,
    getStudentsByClassCodes,
} = require('../models/dosenWaliQueries/myStudent_ListQueries');

const {
    fetchStudentTAK,
    fetchStudentSKSTotal,
    fetchStudentIPK,
    getStudentAcademicData
} = require('../models/dosenWaliQueries/myStudentDetailAcademicQueries');

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

// @desc

// @desc    Get list and data of students report to lecturer
// @route   GET /api/faculty/keluhanMahasiswa
// @access  Private (dosen_wali only)
exports.getKeluhanMahasiswa = async (req, res, next) => {
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
exports.getResponDosWal = async (req, res, next) => {
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
            return res.status(404).json({ // 404 Not Found lebih tepat
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
        const ipk = studentData.ipk_lulus;      // Sesuaikan nama field jika berbeda di DB
        const sksTotal = studentData.sks_lulus; // Sesuaikan nama field jika berbeda di DB
        const tak = studentData.tak;            // Sesuaikan nama field jika berbeda di DB
        // NIM juga ada di studentData.nim, bisa digunakan untuk verifikasi jika perlu

        console.log("Data Mahasiswa Ditemukan (dari getStudentAcademicData):");
        console.log("Nama:", namaMahasiswa);
        console.log("NIM:", nim); // NIM dari input, bisa juga studentData.nim
        console.log("Kelas:", kelasMahasiswa);
        console.log("IPK Lulus:", ipk);
        console.log("SKS Lulus:", sksTotal);
        console.log("TAK:", tak);

        const responseData = {
            nama: namaMahasiswa,
            nim: nim, // Menggunakan nim dari input, atau bisa juga studentData.nim
            kelas: kelasMahasiswa,
            ipk: ipk,
            sksTotal: sksTotal,
            tak: tak,
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