const { pool } = require('../../config/database');

/**
 * @desc    Get all grades with student information
 * @returns {Promise<Array>} An array containing a status object with the payload of all grades
 */
exports.getAllMahasiswa = async () => {
    try {
        const sql = `
            SELECT 
                mhs.nim,
                mhs.nama,
                mhs.kelas,
                kls.kode_dosen,
                kls.tahun_angkatan,
                mhs.status
            FROM 
                mahasiswa AS mhs
            JOIN 
                kelas AS kls ON mhs.kelas = kls.kode_kelas
            ORDER BY 
                mhs.nim ASC;
        `;
        const [mahasiswaFromDB] = await pool.execute(sql);

        const formattedMahasiswa = mahasiswaFromDB.map((mhs) => ({
            nim: mhs.nim,
            name: mhs.nama, // Konsisten menggunakan 'name'
            status: mhs.status, // Beri nilai default jika status null
            detail_kelas: { 
                angkatan: mhs.tahun_angkatan,
                kelas: mhs.kelas,
                dosen_wali: mhs.kode_dosen,
            },
        }));

        return [{ status: 'success', payload: formattedMahasiswa }];
    } catch (error) {
        console.error('Error in get All Mahasiswa Datas query:', error);
        throw error; // Re-throw the error to be caught by the controller
    }
};


/**
 * @desc    Find a single grade by its ID, including student information
 * @param   {string|number} nim The ID of the grade to find
 * @returns {Promise<Array>} An array containing a status object with the grade payload
 */
exports.findGradesMahasiswaByNIM = async (nim) => {
    try {
        const sql = `
            SELECT 
                n.id_nilai,
                n.nim_mahasiswa,
                m.nama,
                m.kelas,
                n.kode_mk,
                n.indeks_nilai,
                n.semester,
                n.tahun_ajaran
            FROM 
                nilai AS n
            JOIN 
                mahasiswa AS m ON n.nim_mahasiswa = m.nim
            WHERE 
                n.nim_mahasiswa = ?;
        `;
        const [rows] = await pool.execute(sql, [nim]);

        // Jika query tidak mengembalikan baris sama sekali, artinya tidak ada nilai.
        if (rows.length === 0) {
            return null; // Sinyal yang jelas ke controller bahwa data tidak ditemukan.
        }

        // Jika data ada, kita format agar lebih rapi.
        // Informasi mahasiswa (nama, kelas) sama untuk semua baris, jadi kita ambil dari baris pertama.
        const formattedResult = {
            nim: nim,
            name: rows[0].nama,
            kelas: rows[0].kelas,
            grades: rows.map(grade => ({ // 'grades' adalah array nilai
                id_nilai: grade.id_nilai,
                kode_mk: grade.kode_mk,
                indeks: grade.indeks_nilai,
                semester: grade.semester,
                tahun_ajaran: grade.tahun_ajaran,
            })),
        };

        // rows will be an array with one item or an empty array
        return [{ status: 'success', payload: formattedResult}];
    } catch (error) {
        console.error(`Error in findByNIM grade query (nim: ${nim}):`, error);
        throw error;
    }
};


exports.getAllCourse = async () => {
    try {
        const [availableCourses] = await pool.execute(
            'SELECT kode_mk, nama_mk FROM mata_kuliah_baru'
        );
        
        return [{ status: 'success', payload: availableCourses }];
    } catch (error) {
        console.error('Error in fetching availableCourses', error);
        throw error; // Melempar error agar bisa ditangkap oleh controller
    }

};


/**
 * @desc    Create a new grade entry in the database
 * @param   {object} data Object containing the grade information (nim_mahasiswa, kode_mk, dll.)
 * @returns {Promise<Array>} An array containing a status object with the newly created grade payload
 */
exports.createNilaiMahasiswa = async (data) => {
    try {
        // Mengambil nilai-nilai yang relevan dari objek 'data' (yang berasal dari req.body)
        const { nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran } = data;

        const sql = `
            INSERT INTO nilai (nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran) 
            VALUES (?, ?, ?, ?, ?);
        `;
        
        const [result] = await pool.execute(sql, [nim_mahasiswa, kode_mk, indeks_nilai, semester, tahun_ajaran]);
        
        // Mengembalikan data yang baru saja dibuat, lengkap dengan ID barunya
        const newGrade = { id_nilai: result.insertId, ...data };
        return [{ status: 'success', payload: newGrade }];
    } catch (error) {
        console.error('Error in create grade query:', error);
        throw error; // Melempar error agar bisa ditangkap oleh controller
    }
};


/**
 * @desc    Update an existing grade entry by its ID
 * @param   {string|number} id The ID of the grade to update
 * @param   {object} data Object with the new grade information
 * @returns {Promise<Array>} An array containing a status object with the update result information
 */
exports.updateNilaiMahasiswa = async (id, data) => {
    try {
        const { kode_mk, indeks_nilai, semester, tahun_ajaran } = data;
        const sql = `
            UPDATE nilai 
            SET kode_mk = ?, indeks_nilai = ?, semester = ?, tahun_ajaran = ? 
            WHERE id_nilai = ?;
        `;
        const [result] = await pool.execute(sql, [ kode_mk, indeks_nilai, semester, tahun_ajaran, id]);
        return [{ status: 'success', payload: result }];
    } catch (error) {
        console.error(`Error in update grade query (id: ${id}):`, error);
        throw error;
    }
};


/**
 * @desc    Delete a grade entry by its ID
 * @param   {string|number} id The ID of the grade to delete
 * @returns {Promise<Array>} An array containing a status object with the deletion result information
 */
exports.removeNilaiMahasiswa = async (id) => {
    try {
        const sql = 'DELETE FROM nilai WHERE id_nilai = ?;';
        const [result] = await pool.execute(sql, [id]);
        return [{ status: 'success', payload: result }];
    } catch (error) {
        console.error(`Error in delete grade query (id: ${id}):`, error);
        throw error;
    }
};

