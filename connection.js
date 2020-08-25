
require('dotenv/config')
const sequelize = require('sequelize');
const database = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{ 
    dialect : 'postgres'
})

database
.sync({
    force : false,
    logging : console.log
})
.then(function(){
    console.log("berhasil")
})
.catch(function(error)
{
    console.log(error)
});

module.exports = database;