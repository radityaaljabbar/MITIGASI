const { pool } = require('../../config/database');

/**
 * @desc    Find all semester records for a specific student by their NIM.
 * @param   {string} nim The NIM of the student.
 * @returns {Promise<object|null>} A formatted object with student info and an array of semesters, or null if not found.
 */
exports.findSemesterMahasiswaByNIM = async (nim) => {
    try {
        // Query yang sudah diperbaiki (mjs -> mhs)
        const sql = `
            SELECT
                ps.id,
                ps.semester,    
                ps.ip_semester,
                ps.sks_semester,
                ps.jenis_semester,
                ps.tahun_ajaran,
                mhs.nama  -- Mengganti m.nim dan m.nama dengan alias yang benar
            FROM 
                persemester AS ps
            JOIN 
                mahasiswa AS mhs ON ps.nim_mahasiswa = mhs.nim
            WHERE 
                ps.nim_mahasiswa = ?
            ORDER BY
                ps.semester ASC; -- Opsional: mengurutkan semester
        `;
        const [rows] = await pool.execute(sql, [nim]);

        // Jika tidak ada data sama sekali, kembalikan null
        if (rows.length === 0) {
            return null;
        }

        // Logika pemformatan yang sudah diperbaiki
        const formattedResult = {
            nim: nim,
            nama: rows[0].nama, // Nama diambil dari baris pertama (akan sama untuk semua)
            
            // Gunakan .map() untuk membuat array dari setiap semester
            riwayat_semester: rows.map(row => ({
                id: row.id,
                semester: row.semester,
                ip_semester: row.ip_semester,
                sks_semester: row.sks_semester,
                jenis_semester: row.jenis_semester,
                tahun_ajaran: row.tahun_ajaran,
            })),
        };

        // Model sekarang mengembalikan objek langsung, bukan array [{...}]
        return formattedResult;
    } catch (error) {
        console.error(`Error in findSemesterMahasiswaByNIM query (nim: ${nim}):`, error);
        throw error;
    }
};


/**
 * @desc    Create a new semester record for a student.
 * @param   {object} data Object containing all necessary data for a new record.
 * @returns {Promise<object>} An object containing the newly created data, including its new ID.
 */
exports.createSemesterMahasiswaByNIM = async (data) => {
    try {
        // 1. Destructuring data input dari controller
        const {nim_mahasiswa, ip_semester, semester, sks_semester, tahun_ajaran, jenis_semester, tanggal_dibuat} = data;

        // 2. Query SQL untuk INSERT data baru
        const sql = `
            INSERT INTO persemester (
                nim_mahasiswa, 
                ip_semester, 
                semester, 
                sks_semester, 
                tahun_ajaran, 
                jenis_semester,
                tanggal_dibuat
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        
        // 3. Jalankan query dengan parameter yang aman
        const [result] = await pool.execute(sql, [
            nim_mahasiswa, 
            ip_semester, 
            semester, 
            sks_semester, 
            tahun_ajaran, 
            jenis_semester,
            tanggal_dibuat
        ]);

        // 4. Buat objek konfirmasi yang akan dikembalikan, termasuk ID baru dari database
        const createdRecord = {
            id: result.insertId, // ID yang baru saja dibuat oleh database
            ...data
        };
        
        return createdRecord;

    } catch (error) {
        // 5. Jika terjadi error, catat dan lempar kembali agar ditangani oleh controller
        console.error('Error in createSemester query:', error);
        throw error;
    }
};


/**
 * @desc    Update a specific semester record by its unique ID.
 * @param   {string|number} id The primary key (id) of the semester record to update.
 * @param   {object} data Object containing the new data: { ip_semester, semester, sks_semester, tahun_ajaran, jenis_semester }
 * @returns {Promise<object>} An object containing the result of the update operation from the database.
 */
exports.updateSemesterMahasiswaById = async (id, data) => {
    try {
        // 1. Destructuring data input untuk kejelasan
        const { ip_semester, semester, sks_semester, tahun_ajaran, jenis_semester, tanggal_dibuat } = data;

        // 2. Query SQL untuk melakukan UPDATE
        const sql = `
            UPDATE persemester 
            SET 
                ip_semester = ?, 
                semester = ?, 
                sks_semester = ?, 
                tahun_ajaran = ?, 
                jenis_semester = ?,
                tanggal_dibuat = ?
            WHERE 
                id = ?;
        `;

        // 3. Jalankan query dengan parameter yang aman
        const [result] = await pool.execute(sql, [
            ip_semester, 
            semester, 
            sks_semester, 
            tahun_ajaran, 
            jenis_semester,
            tanggal_dibuat,
            id // 'id' sebagai parameter terakhir untuk klausa WHERE
        ]);
        
        // 4. Kembalikan hasil langsung dari database (berisi affectedRows, dll.)
        return result;

    } catch (error) {
        // 5. Jika terjadi error, catat dan lempar kembali agar ditangani oleh controller
        console.error(`Error in updateSemester query for ID ${id}:`, error);
        throw error;
    }
};


/**
 * @desc    Delete a specific semester record by its unique ID.
 * @param   {string|number} id The primary key (id) of the semester record to delete.
 * @returns {Promise<object>} An object containing the result of the delete operation from the database.
 */
exports.deleteSemesterMahasiswaById = async (id) => {
    try {
        // 1. SQL query untuk menghapus baris berdasarkan 'id'
        const sql = 'DELETE FROM persemester WHERE id = ?;';

        // 2. Jalankan query dengan parameter yang aman
        const [result] = await pool.execute(sql, [id]);
        
        // 3. Kembalikan hasil dari database.
        return result;

    } catch (error) {
        // 4. Jika terjadi error (misal: koneksi database gagal), catat dan lempar kembali
        console.error(`Error in deleteSemester query for ID ${id}:`, error);
        throw error;
    }
};