const { pool } = require('../config/database');
const response = require('../utils/response');
const responseDosWalModel = require('../models/responseDosenWali');

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
        const [classes] = await pool.execute(
            'SELECT id_kelas, kode_kelas FROM kelas WHERE kode_dosen = ?',
            [dosenCode]
        );

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
        const studentList = [];

        for (const kelas of classCodesList) {
            const [students] = await pool.execute(
                'SELECT nim, nama, kelas FROM mahasiswa WHERE kelas = ?',
                [kelas]
            );

            // Add placeholder data for missing values (ipk, tak, status)
            const formattedStudents = students.map((student) => ({
                name: student.nama,
                nim: student.nim,
                kelas: student.kelas,
                ipk: '-', // Placeholder for now
                tak: '-', // Placeholder for now
                status: 'Aman', // Default status
                details: {
                    akademik: 'Aman',
                    psikologis: 'Aman',
                    finansial: 'Aman',
                },
            }));

            studentList.push(...formattedStudents);
        }

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
exports.getKeluhanMahasiswa = async (req, res, next) => {
    const dosenNIP = req.user.id;

    try {
        const [data] = await responseDosWalModel.getKeluhan(dosenNIP);
        console.log(dosenNIP);
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
