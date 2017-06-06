const mysql = require('mysql')
const Promise = require("bluebird")
const mysql_info = require('../../../es-agent-config/mysql-config')

const executeSql = async (sql) => new Promise((resolve, reject) => {
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





