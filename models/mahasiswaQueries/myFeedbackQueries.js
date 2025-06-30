const { pool } = require('../../config/database');

/**
 * @desc Ambil list feedback mahasiswa berdasarkan NIM
 * @param {string} nim
 * @return {Promise<Array>}
 */
const getMyFeedbackList = async (nim) => {
    const [feedbackList] = await pool.execute(
        `SELECT 
            km.id_keluhan, 
            km.nim_keluhan, 
            km.title_keluhan, 
            km.detail_keluhan, 
            km.tanggal_keluhan,
            CASE
                WHEN rdw.id_response IS NOT NULL THEN rdw.status_keluhan
                ELSE 'Pending' -- Default status jika belum ada response
            END AS status,
            CASE
                WHEN rdw.id_response IS NOT NULL THEN TRUE
                ELSE FALSE
            END AS has_response
        FROM 
            keluhan_mahasiswa km 
        LEFT JOIN
            response_dosen_wali rdw ON km.id_keluhan = rdw.id_keluhan
        WHERE 
            km.nim_keluhan = ?
        ORDER BY 
            km.tanggal_keluhan DESC`,
        [nim]
    );

    return feedbackList;
};

/**
 * @desc Ambil detail feedback berdasarkan ID termasuk lampiran dan response dengan lampiran response
 * @param {number} id_keluhan
 * @return {Promise<Object>}
 */
const getFeedbackDetail = async (id_keluhan) => {
    // Get the feedback details with response
    const [feedbackDetails] = await pool.execute(
        `SELECT 
            km.id_keluhan, 
            km.nim_keluhan, 
            km.title_keluhan, 
            km.detail_keluhan, 
            km.tanggal_keluhan,
            rdw.id_response,
            rdw.nip_dosen_wali,
            rdw.response_keluhan,
            rdw.tanggal_response,
            rdw.status_keluhan
        FROM 
            keluhan_mahasiswa km 
        LEFT JOIN
            response_dosen_wali rdw ON km.id_keluhan = rdw.id_keluhan
        WHERE 
            km.id_keluhan = ?`,
        [id_keluhan]
    );

    // If feedback not found, return null
    if (feedbackDetails.length === 0) {
        return null;
    }

    // Get attachment mahasiswa (keluhan attachment)
    const [attachments] = await pool.execute(
        `SELECT 
            lf.id_lampiran,
            lf.id_keluhan,
            lf.file_name,
            lf.original_name,
            lf.file_url,
            lf.file_type,
            lf.file_size
        FROM 
            lampiranfeedback lf
        WHERE 
            lf.id_keluhan = ?`,
        [id_keluhan]
    );

    // Add attachment to the result
    const result = feedbackDetails[0];
    result.lampiran = attachments.length > 0 ? attachments[0] : null;

    // Restructure the response information
    if (result.id_response) {
        // ADDED: Get lampiran response dari dosen wali
        const [responseAttachments] = await pool.execute(
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
            [result.id_response]
        );

        result.response = {
            id: result.id_response,
            nip_dosen_wali: result.nip_dosen_wali,
            text: result.response_keluhan,
            date: result.tanggal_response,
            status: result.status_keluhan,
            // ADDED: Include lampiran response
            lampiran:
                responseAttachments.length > 0 ? responseAttachments[0] : null,
        };
    } else {
        result.response = null;
        result.status = 'Pending'; // Default status if no response
    }

    // Clean up redundant fields
    delete result.id_response;
    delete result.nip_dosen_wali;
    delete result.response_keluhan;
    delete result.tanggal_response;

    return result;
};

// Export the functions
module.exports = {
    getMyFeedbackList,
    getFeedbackDetail,
};
