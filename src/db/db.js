const { isProd } = require('../utils/env')
const { DEV_MYSQL_KEY, PROD_MYSQL_KEY } = require('../_password_')
let MYSQL_CONF = {
  user: 'root',
  password: DEV_MYSQL_KEY,
  port: '3306',
  database: 'mysql'
}

if (isProd) {
  MYSQL_CONF = {
    user: 'root',
    password: PROD_MYSQL_KEY,
    port: '3306',
    database: 'mysql'
  }
}
module.exports = {
  MYSQL_CONF
}