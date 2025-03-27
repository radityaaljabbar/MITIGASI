require('dotenv').config();
const routes = require('./routes/routes')
const Hapi = require('@hapi/hapi');
const { validateJWT } = require('./services/authMiddleware');

const init = async () => {
    const server = Hapi.server({
        port: 8080,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    
    //Register JWT plugin
    await server.register(require('@hapi/jwt'));

    //JWT Strategy
    server.auth.strategy('jwt','jwt', {
        keys: process.env.JWT_SECRET,
        verify: {
            aud: 'urn:audience:your-audience',
            iss: 'urn:issuer:your-issuer',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 Jam
        },
        validate: validateJWT,
    });

    // Set default auth strategy
    server.auth.default('jwt');

    server.route(routes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};
init();