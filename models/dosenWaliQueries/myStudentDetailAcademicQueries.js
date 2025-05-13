const { pool } = require('../../config/database');

// ngambil ipk dan tak student tertentu
exports.getStudentAcademicData = async (nimMhs) => {
    const SQLQuery = 
    `   SELECT 
            mhs.nama,
            mhs.nim, 
            mhs.kelas,
            ipkt.ipk_lulus,
            ipkt.sks_lulus, 
            takt.tak,
            sem.semester,
            sem.sks_semester,
            sem.ip_semester
        FROM mahasiswa mhs 
        JOIN ipk_mahasiswa ipkt ON ipkt.nim = mhs.nim
        JOIN tak_mahasiswa takt ON takt.nim = mhs.nim
        JOIN persemester sem ON sem.nim_mahasiswa = mhs.nim
        WHERE mhs.nim = ?`; // Gunakan placeholder '?' untuk keamanan (mencegah SQL Injection)
                          // dan lebih baik spesifikasikan tabel mhs.nim jika nim ada di tabel lain juga

    try {
        // Eksekusi query dengan pool.execute
        // Destructuring [rows] akan mengambil array hasil query
        const [rowsAcademicData] = await pool.execute(SQLQuery, [nimMhs]);
        
        // rowsAcademicData akan menjadi array. Jika Anda mengharapkan satu mahasiswa,
        // bisa jadi array ini berisi satu objek atau kosong.
        // Mirip dengan rowsTAK, rowsAcademicData adalah array dari baris hasil.
        return rowsAcademicData; 
    } catch (error) {
        console.error("Error fetching student academic data:", error);
        // Anda mungkin ingin melempar error lagi atau mengembalikan array kosong/null
        // tergantung pada bagaimana Anda ingin menangani error di pemanggil fungsi ini.
        throw error; // atau return [];
    }
};
