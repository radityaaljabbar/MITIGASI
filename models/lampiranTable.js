// Add this to your models folder, e.g., models/lampiranTable.js

const { pool } = require('../config/database');

// Create table query if it doesn't exist
const createLampiranTable = `
CREATE TABLE IF NOT EXISTS lampiran (
  id_lampiran INT AUTO_INCREMENT PRIMARY KEY,
  id_keluhan INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(1024) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_keluhan) REFERENCES keluhan_mahasiswa(id_keluhan) ON DELETE CASCADE
)`;

// // Execute query to create table
// (async () => {
//     try {
//         await pool.query(createLampiranTable);
//         console.log('Lampiran table checked/created successfully');
//     } catch (err) {
//         console.error('Error creating lampiran table:', err);
//     }
// })();

// Function to save file data to database
const saveLampiran = async (lampiranData) => {
    const query = `
        INSERT INTO lampiranfeedback 
        (id_keluhan, file_name, original_name, file_url, file_type, file_size) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
        lampiranData.id_keluhan,
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

// Function to get lampiran by keluhan ID
const getLampiranByKeluhanId = async (id_keluhan) => {
    const query = `
        SELECT * FROM lampiran 
        WHERE id_keluhan = ?
        ORDER BY uploaded_at DESC
    `;
    const [results] = await pool.query(query, [id_keluhan]);
    return results;
};

const deleteLampiran = async (id_lampiran) => {
    const query = `DELETE FROM lampiran WHERE id_lampiran = ?`;
    const [result] = await pool.query(query, [id_lampiran]);
    return result.affectedRows > 0;
};

module.exports = {
    saveLampiran,
    getLampiranByKeluhanId,
    deleteLampiran,
};
