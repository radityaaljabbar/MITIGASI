//Importing Needs
const sequelize = require('../services/db');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Login / Authentication Handler:
const mahasiswaAuthHandler = async (request,h) => {
    const { username, password } = request.payload;

    try {
        const mahasiswa = await sequelize.query(
            'SELECT * FROM mahasiswa WHERE nim = :username',
            {
                replacements: {username},
                type: QueryTypes.SELECT,
            }
        );

        //Cek ada nim or not
        if (mahasiswa.length === 0){
            return h.response({
                status: 'fail',
                message: 'NIM tidak ditemukan',
            }).code(404);
        }

        //Verifikasi password:
        const user = mahasiswa[0];
        if(user.password !== password){
            return h.response({
                status: 'fail',
                message: 'Password salah, periksa lagi',
            }).code(401);
        }

        //Generate JWT
        const token = jwt.sign(
            {
                nim: user.nim,
                nama: user.nama,
                kelas: user.kelas,
                aud: 'urn:audience:your-audience', // Add aud claim
                iss: 'urn:issuer:your-issuer', // Add iss claim
            },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        //Login berhasil:
        return h.response({
            status: 'success',
            message: 'Login Berhasil!',
            data: {
                token, // Return the token to the client
                nim: user.nim,
                nama: user.nama,
                kelas: user.kelas,
            },
        }).code(200);
    } catch (err){
        console.log(err);
        return h.response({
            status: 'error',
            message: 'Error from server',
        }).code(500);
    }
};

const dosenwaliAuthHandler = async (request,h) => {
    const { nip, password } = request.payload;

    try {
        const dosen = await sequelize.query(
            'SELECT * FROM dosen_wali WHERE nip = :nip',
            {
                replacements: { nip },
                type: QueryTypes.SELECT,
            }
        );

        // Check if NIP exists
        if (dosen.length === 0) {
            return h.response({
                status: 'fail',
                message: 'NIP tidak ditemukan',
            }).code(404);
        }

        // Verify password
        const user = dosen[0];
        if (user.password !== password) {
            return h.response({
                status: 'fail',
                message: 'Password salah, periksa lagi',
            }).code(401);
        }

        // Generate JWT with aud and iss claims
        const token = jwt.sign(
            {
                nip: user.nip,
                nama: user.nama,
                kode_dosen: user.kode_dosen,
                aud: 'urn:audience:your-audience', // Add aud claim
                iss: 'urn:issuer:your-issuer', // Add iss claim
            },
            process.env.JWT_SECRET, // Use a strong secret key
            { expiresIn: '4h' } // Token expires in 4 hours
        );

        // Login successful
        return h.response({
            status: 'success',
            message: 'Login Berhasil!',
            data: {
                token, // Return the token to the client
                nip: user.nip,
                nama: user.nama,
                kode_dosen: user.kode_dosen,
            },
        }).code(200);
    } catch (err) {
        console.log(err);
        return h.response({
            status: 'error',
            message: 'Error from server',
        }).code(500);
    }
};

const updatePasswordHandler = async (request, h) => {
    const { currentPassword, newPassword } = request.payload;
    const user = request.auth.credentials;

    try {
        const table = user.nim ? 'mahasiswa' : 'dosen_wali';
        const idField = user.nim ? 'nim' : 'nip';
        const userId = user.nim || user.nip;

        // Fetch the user from the database
        const query = `SELECT * FROM ${table} WHERE ${idField} = :userId`;
        const users = await sequelize.query(query, {
            replacements: { userId },
            type: QueryTypes.SELECT,
        });

        if (users.length === 0) {
            return h.response({
                status: 'fail',
                message: 'User not found',
            }).code(404);
        }

        const dbUser = users[0];

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isPasswordValid) {
            return h.response({
                status: 'fail',
                message: 'Current password is incorrect',
            }).code(401);
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password in the database
        const updateQuery = `UPDATE ${table} SET password = :password WHERE ${idField} = :userId`;
        await sequelize.query(updateQuery, {
            replacements: { password: hashedNewPassword, userId },
            type: QueryTypes.UPDATE,
        });

        return h.response({
            status: 'success',
            message: 'Password updated successfully',
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'error',
            message: 'An error occurred while updating the password',
        }).code(500);
    }
};
module.exports = { mahasiswaAuthHandler, dosenwaliAuthHandler, updatePasswordHandler };