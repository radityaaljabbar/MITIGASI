const {pool} = require('../config/database')
const response = require('../utils/response')

exports.getDoswal = async (req, res, next) => {
    const dosenNIP = req.user.id
    const sql = `SELECT  *
                    FROM keluhan_mahasiswa 
                    JOIN mahasiswa ON nim_keluhan = nim
                    JOIN kelas ON kelas = kode_kelas
                    JOIN dosen_wali ON kode_dosen = kode
                    WHERE nip = '${dosenNIP}'
                    ORDER BY tanggal_keluhan DESC;`

    try {
        const [fields] = await pool.query(sql)
        console.log(dosenNIP)
        response(200, fields, "dapat semua keluhan", res)
    } catch (err) {
        if(err) throw err;
        response(500, null, "tidak dapat mengambil data", res)
    }
}
