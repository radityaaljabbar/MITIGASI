const { pool } = require('../../config/database');

/**
 * @desc Get all keluhan/feedback assigned to a specific dosen wali's classes
 * @param {string} dosenNIP - NIP of the dosen wali
 * @param {string} dosenCode - Code of the dosen wali
 * @returns {Promise<Array>} - Array of feedback with student information
 */
const getKeluhan = async (dosenNIP, dosenCode) => {
    try {
        const [rows] = await pool.execute(
            `SELECT 
                km.id_keluhan, 
                km.nim_keluhan AS nim, 
                m.nama,
                m.kelas,
                km.title_keluhan, 
                km.detail_keluhan, 
                km.tanggal_keluhan,
                CASE 
                    WHEN rdw.id_response IS NOT NULL THEN 1
                    ELSE 0
                END AS has_response,
                CASE 
                    WHEN rdw.status_keluhan = 1 THEN 'Sudah Direspon'
                    WHEN rdw.id_response IS NOT NULL THEN 'Sudah Direspon'
                    ELSE 'Menunggu Respon'
                END AS status,
                rdw.status_keluhan
            FROM 
                keluhan_mahasiswa km
            JOIN 
                mahasiswa m ON km.nim_keluhan = m.nim
            JOIN 
                kelas k ON m.kelas = k.kode_kelas
            LEFT JOIN 
                response_dosen_wali rdw ON km.id_keluhan = rdw.id_keluhan AND rdw.nip_dosen_wali = ?
            WHERE 
                k.kode_dosen = ?
            ORDER BY 
                km.tanggal_keluhan DESC`,
            [dosenNIP, dosenCode]
        );

        return [{ status: 'success', payload: rows }];
    } catch (error) {
        console.error('Error in getKeluhan query:', error);
        throw error;
    }
};

/**
 * @desc Get a specific feedback detail along with its attachment
 * @param {string} keluhanId - ID of the feedback/keluhan
 * @returns {Promise<Object>} - Feedback details with student information and attachment
 */
const getKeluhanDetail = async (keluhanId) => {
    try {
        // Get the feedback details with student info and response status
        const [feedbackDetails] = await pool.execute(
            `SELECT 
                km.id_keluhan, 
                km.nim_keluhan AS nim, 
                m.nama,
                m.kelas,
                km.title_keluhan, 
                km.detail_keluhan, 
                km.tanggal_keluhan,
                CASE 
                    WHEN rdw.status_keluhan = 1 THEN 'Sudah Direspon'
                    WHEN rdw.id_response IS NOT NULL THEN 'Sudah Direspon'
                    ELSE 'Menunggu Respon'
                END AS status,
                rdw.status_keluhan
            FROM 
                keluhan_mahasiswa km
            LEFT JOIN 
                mahasiswa m ON km.nim_keluhan = m.nim
            LEFT JOIN 
                response_dosen_wali rdw ON km.id_keluhan = rdw.id_keluhan
            WHERE 
                km.id_keluhan = ?`,
            [keluhanId]
        );

        if (feedbackDetails.length === 0) {
            return { status: 'error', message: 'Feedback not found' };
        }

        // Get attachment if any
        const [attachments] = await pool.execute(
            `SELECT 
                lf.id_lampiran,
                lf.file_name,
                lf.original_name,
                lf.file_url,
                lf.file_type,
                lf.file_size
            FROM 
                lampiranfeedback lf
            WHERE 
                lf.id_keluhan = ?`,
            [keluhanId]
        );

        // Merge the results
        const result = feedbackDetails[0];
        result.lampiran = attachments.length > 0 ? attachments[0] : null;

        return { status: 'success', payload: result };
    } catch (error) {
        console.error('Error in getKeluhanDetail query:', error);
        throw error;
    }
};

/**
 * @desc Get response made by dosen wali for a specific feedback with attachment
 * @param {string} dosenNIP - NIP of the dosen wali
 * @param {string} feedbackId - ID of the feedback/keluhan
 * @returns {Promise<Array>} - Response details with attachment
 */
const getResponse = async (dosenNIP, feedbackId) => {
    try {
        let query = `
            SELECT 
                rdw.id_response,
                rdw.nip_dosen_wali,
                rdw.id_keluhan,
                rdw.response_keluhan,
                rdw.tanggal_response,
                rdw.status_keluhan,
                CASE 
                    WHEN rdw.status_keluhan = 1 THEN 'Sudah Direspon'
                    WHEN rdw.id_response IS NOT NULL THEN 'Sudah Direspon'
                    ELSE 'Menunggu Respon'
                END AS status
            FROM 
                response_dosen_wali rdw
            WHERE 
                rdw.nip_dosen_wali = ?`;

        const params = [dosenNIP];

        // If feedbackId is provided, filter by it
        if (feedbackId) {
            query += ` AND rdw.id_keluhan = ?`;
            params.push(feedbackId);
        }

        query += ` ORDER BY rdw.tanggal_response DESC`;

        const [rows] = await pool.execute(query, params);

        // Get attachments for each response
        for (let i = 0; i < rows.length; i++) {
            // console.log(
            //     `🔍 Fetching attachment for id_response: ${rows[i].id_response}`
            // );
            const [attachments] = await pool.execute(
                `SELECT 
                    lmr.id_lampiran,
                    lmr.file_name,
                    lmr.original_name,
                    lmr.file_url,
                    lmr.file_type,
                    lmr.file_size
                FROM 
                    lampiranmyreport lmr
                WHERE 
                    lmr.id_response = ?`,
                [rows[i].id_response]
            );
            // console.log(
            //     `📎 Found ${attachments.length} attachments:`,
            //     attachments
            // );
            rows[i].lampiran = attachments.length > 0 ? attachments[0] : null;
        }

        return [{ status: 'success', payload: rows }];
    } catch (error) {
        console.error('Error in getResponse query:', error);
        throw error;
    }
};

/**
 * @desc Create or update a response from dosen wali
 * @param {Object} responseData - Response data
 * @returns {Promise<Object>} - Result of the operation
 */
const createOrUpdateResponse = async (responseData) => {
    const { nip_dosen_wali, id_keluhan, response_keluhan, status_keluhan } =
        responseData;

    try {
        // Check if response already exists
        const [existingResponse] = await pool.execute(
            `SELECT id_response FROM response_dosen_wali 
            WHERE nip_dosen_wali = ? AND id_keluhan = ?`,
            [nip_dosen_wali, id_keluhan]
        );

        let result;

        if (existingResponse.length > 0) {
            // Update existing response
            const [updateResult] = await pool.execute(
                `UPDATE response_dosen_wali 
                SET response_keluhan = ?, tanggal_response = NOW(), status_keluhan = ?
                WHERE nip_dosen_wali = ? AND id_keluhan = ?`,
                [response_keluhan, status_keluhan, nip_dosen_wali, id_keluhan]
            );

            result = {
                operation: 'update',
                id: existingResponse[0].id_response,
                affectedRows: updateResult.affectedRows,
            };
        } else {
            // Create new response
            const [insertResult] = await pool.execute(
                `INSERT INTO response_dosen_wali 
                (nip_dosen_wali, id_keluhan, response_keluhan, tanggal_response, status_keluhan)
                VALUES (?, ?, ?, NOW(), ?)`,
                [nip_dosen_wali, id_keluhan, response_keluhan, status_keluhan]
            );

            result = {
                operation: 'insert',
                id: insertResult.insertId,
                affectedRows: insertResult.affectedRows,
            };
        }

        return { status: 'success', payload: result };
    } catch (error) {
        console.error('Error in createOrUpdateResponse:', error);
        throw error;
    }
};

module.exports = {
    getKeluhan,
    getKeluhanDetail,
    getResponse,
    createOrUpdateResponse,
};
