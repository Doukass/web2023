const { request } = require('express')

const db = require('mysql')
const pool = db.createPool({
    user: 'root',
    host: 'localhost',
    database: 'database_web',
    password: '',
    port: 3306,
})
module.exports={pool};