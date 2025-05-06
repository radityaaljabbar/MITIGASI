const { pool } = require('../config/database');

// @desc    Get list of students for dosen wali
// @route   GET /api/listMahasiswa
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
