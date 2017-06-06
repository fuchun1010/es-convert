const mysql = require('mysql')
const Promise = require("bluebird")
// const mysql_info = {
//   host: 'localhost',
//   user: 'bigeye',
//   password: 'bigeye123',
//   database: "bigeye_dev"
// }
const mysql_info = require('../../../es-agent-config/mysql-config')

const executeSql = async (sql) => new Promise((resolve, reject) => {
  debugger
  let conn = mysql.createConnection(mysql_info)
  conn.connect()
  conn.query(sql,  (error, data) => {
    error ? reject(error) : resolve(data)
    conn.end()
    console.log(`execute ${sql} ok`)
  })
})


module.exports = {
  executeSql
}





