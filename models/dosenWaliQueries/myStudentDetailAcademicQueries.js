const { pool } = require('../../config/database');

// ngambil ipk dan tak student tertentu dengan LEFT JOIN untuk handle missing data
exports.getStudentAcademicData = async (nimMhs) => {
    const SQLQuery = `   SELECT 
            mhs.nama,
            mhs.nim, 
            mhs.kelas,
            akd.hasil_klasifikasi,
            COALESCE(ipkt.ipk_lulus, 0) as ipk_lulus,
            COALESCE(ipkt.sks_lulus, 0) as sks_lulus, 
            COALESCE(takt.tak, 0) as tak,
            sem.semester,
            COALESCE(sem.sks_semester, 0) as sks_semester,
            COALESCE(sem.ip_semester, 0) as ip_semester
        FROM mahasiswa mhs 
        LEFT JOIN ipk_mahasiswa ipkt ON ipkt.nim = mhs.nim
        LEFT JOIN tak_mahasiswa takt ON takt.nim = mhs.nim
        LEFT JOIN persemester sem ON sem.nim_mahasiswa = mhs.nim
        LEFT JOIN klasifikasi_akademik akd ON akd.nim = mhs.nim
        WHERE mhs.nim = ?
        ORDER BY sem.semester ASC`; // Tambahkan ORDER BY untuk urutan semester

    try {
        // Eksekusi query dengan pool.execute
        const [rowsAcademicData] = await pool.execute(SQLQuery, [nimMhs]);

        // Jika tidak ada data mahasiswa sama sekali, return array kosong
        if (!rowsAcademicData || rowsAcademicData.length === 0) {
            // Coba ambil data dasar mahasiswa saja
            const basicStudentQuery = `
                SELECT 
                    nama,
                    nim, 
                    kelas,
                    0 as ipk_lulus,
                    0 as sks_lulus,
                    0 as tak,
                    NULL as semester,
                    0 as sks_semester,
                    0 as ip_semester
                FROM mahasiswa 
                WHERE nim = ?`;

            const [basicData] = await pool.execute(basicStudentQuery, [nimMhs]);
            return basicData.length > 0 ? basicData : [];
        }

        return rowsAcademicData;
    } catch (error) {
        console.error('Error fetching student academic data:', error);
        throw error;
    }
};
