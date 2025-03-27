const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('testuserdatabase', 'root', '', {
    host:'localhost',
    port:'3306',
    dialect: 'mysql'
})

async function testconnection() {
    try{
        await sequelize.authenticate();
        console.log('Db connected!');

    } catch(err){
        console.log('Db failed to connect.')
    }
}
testconnection();
module.exports = sequelize;