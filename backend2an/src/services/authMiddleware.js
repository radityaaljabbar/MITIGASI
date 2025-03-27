const { verify } = require('jsonwebtoken');

const validateJWT = async (decoded, request, h) => {
    // Check if the user exists in the database (optional)
    // You can query the database here to ensure the user is still valid.

    return { isValid: true, credentials: decoded }; // Return isValid: true if the token is valid
};

module.exports = { validateJWT };