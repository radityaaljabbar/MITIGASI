const { pool } = require('../../config/database');

/**
 * Function to save file attachment data to lampiranmyreport table
 * @param {Object} lampiranData - Attachment data
 * @returns {Promise<Object>} - Saved attachment with ID
 */
const saveLampiranMyReport = async (lampiranData) => {
    const query = `
        INSERT INTO lampiranmyreport 
        (id_response, file_name, original_name, file_url, file_type, file_size) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
        lampiranData.id_response,
        lampiranData.file_name,
        lampiranData.original_name,
        lampiranData.file_url,
        lampiranData.file_type,
        lampiranData.file_size,
    ]);

    return {
        id_lampiran: result.insertId,
        ...lampiranData,
    };
};

/**
 * Function to get attachment by response ID
 * @param {number} id_response - Response ID
 * @returns {Promise<Array>} - Attachments for the response
 */
const getLampiranByResponseId = async (id_response) => {
    const query = `
        SELECT * FROM lampiranmyreport 
        WHERE id_response = ?
        ORDER BY uploaded_at DESC
    `;
    const [results] = await pool.execute(query, [id_response]);
    return results;
};

/**
 * Function to delete attachment
 * @param {number} id_lampiran - Attachment ID
 * @returns {Promise<boolean>} - Success status
 */
const deleteLampiranMyReport = async (id_lampiran) => {
    const query = `DELETE FROM lampiranmyreport WHERE id_lampiran = ?`;
    const [result] = await pool.execute(query, [id_lampiran]);
    return result.affectedRows > 0;
};

module.exports = {
    saveLampiranMyReport,
    getLampiranByResponseId,
    deleteLampiranMyReport,
};
