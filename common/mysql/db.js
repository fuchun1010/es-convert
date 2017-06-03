const mysql = require('mysql')
const Promise = require("bluebird")
const mysql_info = {
  host: 'localhost',
  user: 'bigeye',
  password: 'bigeye123',
  database: "bigeye_dev"
}

const executeSql = async (sql) => new Promise((resolve, reject) => {
  let conn = mysql.createConnection(mysql_info)
  conn.connect()
  conn.query(sql,  (error, data) => {
    error ? reject(error) : resolve(data)
    conn.end()
    console.log('close mysql db')
  })
})


module.exports = {
  executeSql
}





