const {pool} = require('../config/database')

exports.getKeluhan = (dosenNIP) => {
    const SQLQuery = `  SELECT  *
                        FROM keluhan_mahasiswa 
                        JOIN mahasiswa ON nim_keluhan = nim
                        JOIN kelas ON kelas = kode_kelas
                        JOIN dosen_wali ON kode_dosen = kode
                        WHERE nip = '${dosenNIP}'
                        ORDER BY tanggal_keluhan DESC;`
    
    return pool.execute(SQLQuery);
}

exports.getResponse = (dosenNIP) => {
    const SQLQuery = `  SELECT  *
                        FROM response_dosen_wali
                        WHERE nip_dosen_wali = '${dosenNIP}'`
    
    return pool.execute(SQLQuery);
}