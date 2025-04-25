const { mahasiswaAuthHandler, dosenwaliAuthHandler, updatePasswordHandler } = require('../handlers/authHandler');

const routes = [
    {
        method: 'POST',
        path: '/auth/m',
        handler: mahasiswaAuthHandler,
        options: {
            auth: false, // Disable JWT authentication for this route
        },
    },
    {
        method: 'POST',
        path: '/auth/d',
        handler: dosenwaliAuthHandler,
        options: {
            auth: false, // Disable JWT authentication for this route
        },
    },
    {
        method: 'GET',
        path: '/profile/m',
        handler: (request, h) => {
            // Access Mahasiswa data from the token
            const user = request.auth.credentials;
            return h.response({
                status: 'success',
                data: user,
            }).code(200);
        },
        options: {
            auth: 'jwt', // Protect this route with JWT
        },
    },
    {
        method: 'GET',
        path: '/profile/d',
        handler: (request, h) => {
            // Access Dosen Wali data from the token
            const user = request.auth.credentials;
            return h.response({
                status: 'success',
                data: user,
            }).code(200);
        },
        options: {
            auth: 'jwt', // Protect this route with JWT
        },
    },

    {
        method: 'POST',
        path: '/update-password',
        handler: updatePasswordHandler,
        options: {
            auth: 'jwt',
        },
    },
];

module.exports = routes;