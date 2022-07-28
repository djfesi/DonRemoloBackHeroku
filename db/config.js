const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
    host: process.env.db_host,
    database: process.env.db_name,
    user: process.env.db_user,
    password: process.env.db_pass
})

pool.getConnection((err) => {
    err ? console.warn("No conectado", {"Error": err.message}) : console.log("Conexion establecida");
})

pool.query = util.promisify(pool.query)

module.exports = pool