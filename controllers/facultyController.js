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
} = require('../models/dosenWaliQueries/myCourseAdvisor_Queries');

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
 * @route GET /api/faculty/courseAdvisor/classes
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
